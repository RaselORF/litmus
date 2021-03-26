/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useMutation, useQuery } from '@apollo/client';
import {
  IconButton,
  Paper,
  Table,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import YAML from 'yaml';
import DashboardTemplatesList from '../../../../components/PreconfiguredDashboards/data';
import { SCHEDULE_DETAILS, UPDATE_PANEL } from '../../../../graphql';
import {
  Artifact,
  CronWorkflowYaml,
  Parameter,
  Template,
  WorkflowYaml,
} from '../../../../models/chaosWorkflowYaml';
import { ChaosResultNamesAndNamespacesMap } from '../../../../models/dashboardsData';
import {
  ListDashboardResponse,
  Panel,
  PanelGroup,
  PanelGroupResponse,
  PanelOption,
  PanelResponse,
  PromQuery,
  UpdatePanelInput,
} from '../../../../models/graphql/dashboardsDetails';
import {
  ScheduleDataVars,
  Schedules,
  ScheduleWorkflow,
} from '../../../../models/graphql/scheduleData';
import useActions from '../../../../redux/actions';
import * as DashboardActions from '../../../../redux/actions/dashboards';
import * as DataSourceActions from '../../../../redux/actions/dataSource';
import * as TabActions from '../../../../redux/actions/tabs';
import { history } from '../../../../redux/configureStore';
import { ReactComponent as Arrow } from '../../../../svg/arrow.svg';
import {
  getProjectID,
  getProjectRole,
} from '../../../../utils/getSearchParams';
import getEngineNameAndNamespace from '../../../../utils/promUtils';
import { GetTimeDiff } from '../../../../utils/timeDifferenceString';
import { validateWorkflowParameter } from '../../../../utils/validate';
import {
  generateChaosQuery,
  getWorkflowParameter,
} from '../../../../utils/yamlUtils';
import useStyles from '../styles';

interface TableDashboardData {
  dashboardDataList: ListDashboardResponse[];
}
const TableDashboardData: React.FC<TableDashboardData> = ({
  dashboardDataList,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const tabs = useActions(TabActions);
  const currentTime = new Date().valueOf();
  const dataSource = useActions(DataSourceActions);
  const dashboard = useActions(DashboardActions);
  // selecedProjectID
  const projectID = getProjectID();
  const projectRole = getProjectRole();

  // schedule data
  const { data: schedulesData } = useQuery<Schedules, ScheduleDataVars>(
    SCHEDULE_DETAILS,
    {
      variables: {
        projectID,
      },
    }
  );
  // schedule data end
  // update pannel
  const [updatePanel] = useMutation<UpdatePanelInput>(UPDATE_PANEL, {
    onError: () => {
      console.error('error updating dashboard details');
    },
  });
  // update pannel end
  // reSyncChaos

  const reSyncChaosQueries = (data: ListDashboardResponse) => {
    const chaosResultNamesAndNamespacesMap: ChaosResultNamesAndNamespacesMap[] = [];
    schedulesData?.getScheduledWorkflows.forEach(
      (schedule: ScheduleWorkflow) => {
        if (schedule.cluster_id === data.cluster_id && !schedule.isRemoved) {
          let workflowYaml: WorkflowYaml | CronWorkflowYaml;
          let parametersMap: Parameter[];
          let workflowYamlCheck: boolean = true;
          try {
            workflowYaml = JSON.parse(schedule.workflow_manifest);
            parametersMap = (workflowYaml as WorkflowYaml).spec.arguments
              .parameters;
          } catch (err) {
            workflowYaml = JSON.parse(schedule.workflow_manifest);
            parametersMap = (workflowYaml as CronWorkflowYaml).spec.workflowSpec
              .arguments.parameters;
            workflowYamlCheck = false;
          }
          (workflowYamlCheck
            ? (workflowYaml as WorkflowYaml).spec.templates
            : (workflowYaml as CronWorkflowYaml).spec.workflowSpec.templates
          ).forEach((template: Template) => {
            if (template.inputs && template.inputs.artifacts) {
              template.inputs.artifacts.forEach((artifact: Artifact) => {
                const parsedEmbeddedYaml = YAML.parse(artifact.raw.data);
                if (parsedEmbeddedYaml.kind === 'ChaosEngine') {
                  let engineNamespace: string = '';
                  if (
                    typeof parsedEmbeddedYaml.metadata.namespace === 'string'
                  ) {
                    engineNamespace = (parsedEmbeddedYaml.metadata
                      .namespace as string).substring(
                      1,
                      (parsedEmbeddedYaml.metadata.namespace as string).length -
                        1
                    );
                  } else {
                    engineNamespace = Object.keys(
                      parsedEmbeddedYaml.metadata.namespace
                    )[0];
                  }
                  if (validateWorkflowParameter(engineNamespace)) {
                    engineNamespace = getWorkflowParameter(engineNamespace);
                    parametersMap.forEach((parameterKeyValue: Parameter) => {
                      if (parameterKeyValue.name === engineNamespace) {
                        engineNamespace = parameterKeyValue.value;
                      }
                    });
                  } else {
                    engineNamespace = parsedEmbeddedYaml.metadata.namespace;
                  }
                  let matchIndex: number = -1;
                  const check: number = chaosResultNamesAndNamespacesMap.filter(
                    (data, index) => {
                      if (
                        data.resultName.includes(
                          parsedEmbeddedYaml.metadata.name
                        ) &&
                        data.resultNamespace === engineNamespace
                      ) {
                        matchIndex = index;
                        return true;
                      }
                      return false;
                    }
                  ).length;
                  if (check === 0) {
                    chaosResultNamesAndNamespacesMap.push({
                      resultName: `${parsedEmbeddedYaml.metadata.name}-${parsedEmbeddedYaml.spec.experiments[0].name}`,
                      resultNamespace: engineNamespace,
                      workflowName: workflowYaml.metadata.name,
                      experimentName:
                        parsedEmbeddedYaml.spec.experiments[0].name,
                    });
                  } else {
                    chaosResultNamesAndNamespacesMap[
                      matchIndex
                    ].workflowName = `${chaosResultNamesAndNamespacesMap[matchIndex].workflowName}, \n${workflowYaml.metadata.name}`;
                  }
                }
              });
            }
          });
        }
      }
    );

    const isChaosQueryPresent: number[] = Array(
      chaosResultNamesAndNamespacesMap.length
    ).fill(0);

    data.panel_groups[0].panels[0].prom_queries.forEach(
      (existingPromQuery: PromQuery) => {
        if (
          existingPromQuery.prom_query_name.startsWith(
            'litmuschaos_awaited_experiments'
          )
        ) {
          const chaosDetails: ChaosResultNamesAndNamespacesMap = getEngineNameAndNamespace(
            existingPromQuery.prom_query_name
          );
          chaosResultNamesAndNamespacesMap.forEach(
            (
              chaosDetailsFomSchedule: ChaosResultNamesAndNamespacesMap,
              index: number
            ) => {
              if (
                chaosDetailsFomSchedule.resultName.includes(
                  chaosDetails.resultName
                ) &&
                chaosDetailsFomSchedule.resultNamespace ===
                  chaosDetails.resultNamespace
              ) {
                isChaosQueryPresent[index] = 1;
              }
            }
          );
        }
      }
    );

    const dashboardTemplateID: number =
      data.db_type === 'Kubernetes Platform' ? 0 : 1;

    const updatedPanelGroups: PanelGroup[] = [];

    data.panel_groups.forEach((panelGroup: PanelGroupResponse) => {
      const updatedPanels: Panel[] = [];
      panelGroup.panels.forEach((panel: PanelResponse) => {
        const updatedQueries: PromQuery[] = [];
        panel.prom_queries.forEach((query: PromQuery) => {
          let updatedLegend: string = query.legend;
          if (
            query.prom_query_name.startsWith('litmuschaos_awaited_experiments')
          ) {
            const chaosDetails: ChaosResultNamesAndNamespacesMap = getEngineNameAndNamespace(
              query.prom_query_name
            );
            chaosResultNamesAndNamespacesMap.forEach(
              (chaosDetailsFomSchedule: ChaosResultNamesAndNamespacesMap) => {
                if (
                  chaosDetailsFomSchedule.resultName.includes(
                    chaosDetails.resultName
                  ) &&
                  chaosDetailsFomSchedule.resultNamespace ===
                    chaosDetails.resultNamespace &&
                  !query.legend.includes(chaosDetailsFomSchedule.workflowName)
                ) {
                  updatedLegend = `${chaosDetailsFomSchedule.workflowName}, \n${query.legend}`;
                }
              }
            );
          }
          const updatedQuery: PromQuery = {
            queryid: query.queryid,
            prom_query_name: query.prom_query_name,
            resolution: query.resolution,
            minstep: query.minstep,
            line: query.line,
            close_area: query.close_area,
            legend: updatedLegend,
          };
          updatedQueries.push(updatedQuery);
        });
        chaosResultNamesAndNamespacesMap.forEach(
          (keyValue: ChaosResultNamesAndNamespacesMap, index: number) => {
            if (isChaosQueryPresent[index] === 0) {
              updatedQueries.push({
                queryid: uuidv4(),
                prom_query_name: generateChaosQuery(
                  DashboardTemplatesList[dashboardTemplateID]
                    .chaosEventQueryTemplate,
                  keyValue.resultName,
                  keyValue.resultNamespace
                ),
                legend: `${keyValue.workflowName} / \n${keyValue.experimentName}`,
                resolution: '1/1',
                minstep: '1',
                line: false,
                close_area: true,
              });
            }
          }
        );
        const existingPanelOptions: PanelOption = {
          points: panel.panel_options.points,
          grids: panel.panel_options.grids,
          left_axis: panel.panel_options.left_axis,
        };
        const updatedPanel: Panel = {
          panel_id: panel.panel_id,
          panel_name: panel.panel_name,
          panel_options: existingPanelOptions,
          prom_queries: updatedQueries,
          y_axis_left: panel.y_axis_left,
          y_axis_right: panel.y_axis_right,
          x_axis_down: panel.x_axis_down,
          unit: panel.unit,
        };
        updatedPanels.push(updatedPanel);
      });
      updatedPanelGroups.push({
        panel_group_id: panelGroup.panel_group_id,
        panel_group_name: panelGroup.panel_group_name,
        panels: updatedPanels,
      });
    });

    const panelInputData: Panel[] = [];

    updatedPanelGroups.forEach((panelGroup: PanelGroup) => {
      panelGroup.panels.forEach((panel: Panel) => {
        panelInputData.push({
          panel_id: panel.panel_id,
          db_id: data.db_id,
          panel_group_id: panelGroup.panel_group_id,
          prom_queries: panel.prom_queries,
          panel_options: panel.panel_options,
          panel_name: panel.panel_name,
          y_axis_left: panel.y_axis_left,
          y_axis_right: panel.y_axis_right,
          x_axis_down: panel.x_axis_down,
          unit: panel.unit,
        });
      });
    });
    updatePanel({
      variables: { panelInput: panelInputData },
    });

    return true;
  };
  //
  const onDashboardLoadRoutine = async (data: ListDashboardResponse) => {
    dashboard.selectDashboard({
      selectedDashboardID: data.db_id,
      selectedDashboardName: data.db_name,
      selectedDashboardTemplateName: data.db_type,
      selectedAgentID: data.cluster_id,
      selectedAgentName: data.cluster_name,
    });
    return Promise.resolve(reSyncChaosQueries(data));
  };
  return (
    <div>
      {dashboardDataList && dashboardDataList.length > 0 ? (
        <Paper className={classes.dataTable}>
          <div className={classes.tableHeading}>
            <Typography variant="h4" className={classes.weightedHeading}>
              {t('analyticsDashboard.applicationDashboard')}
            </Typography>
            {dashboardDataList.length > 3 ? (
              <IconButton
                className={classes.seeAllArrowBtn}
                onClick={() => {
                  tabs.changeAnalyticsDashboardTabs(2);
                  history.push({
                    pathname: '/analytics',
                    search: `?projectID=${projectID}&projectRole=${projectRole}`,
                  });
                }}
              >
                <Typography className={classes.seeAllText}>
                  {t('analyticsDashboard.seeAll')}
                </Typography>
                <Arrow className={classes.arrowForwardIcon} />
              </IconButton>
            ) : (
              <div />
            )}
          </div>
          <Table className={classes.tableStyling}>
            {dashboardDataList.slice(0, 3).map((dashboard) => (
              <TableRow key={dashboard.db_id} className={classes.tableRow}>
                <TableCell scope="row" className={classes.tableRowHeader}>
                  <Typography className={classes.dataRowName}>
                    {dashboard.db_name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography className={classes.dateText}>
                    {t('analyticsDashboard.timeText.lastOpened')}:{' '}
                    {GetTimeDiff(
                      currentTime / 1000,
                      parseInt(dashboard.updated_at, 10),
                      t
                    )}{' '}
                    {t('analyticsDashboard.timeText.ago')}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    className={classes.seeAllBtn}
                    disableRipple
                    disableFocusRipple
                    onClick={() => {
                      onDashboardLoadRoutine(dashboard).then(() => {
                        dataSource.selectDataSource({
                          selectedDataSourceURL: '',
                          selectedDataSourceID: '',
                          selectedDataSourceName: '',
                        });
                        history.push({
                          pathname: '/analytics/dashboard',
                          search: `?projectID=${projectID}&projectRole=${projectRole}`,
                        });
                      });
                    }}
                  >
                    <Typography className={classes.seeAllText}>
                      {t('analyticsDashboard.seeAnalytics')}
                    </Typography>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </Paper>
      ) : (
        <div />
      )}
    </div>
  );
};
export { TableDashboardData };
