import { useMutation } from '@apollo/client';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  TableCell,
  Typography,
} from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import GetAppIcon from '@material-ui/icons/GetApp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReplayIcon from '@material-ui/icons/Replay';
import cronstrue from 'cronstrue';
import { ButtonFilled, ButtonOutlined, Modal } from 'litmus-ui';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import YAML from 'yaml';
import parser from 'cron-parser';
import { RERUN_CHAOS_WORKFLOW } from '../../../graphql/mutations';
import { ScheduleWorkflow } from '../../../models/graphql/scheduleData';
import useActions from '../../../redux/actions';
import * as TabActions from '../../../redux/actions/tabs';
import * as WorkflowActions from '../../../redux/actions/workflow';
import { history } from '../../../redux/configureStore';
import { ReactComponent as CrossMarkIcon } from '../../../svg/crossmark.svg';
import timeDifferenceForDate from '../../../utils/datesModifier';
import { getProjectID, getProjectRole } from '../../../utils/getSearchParams';
import ExperimentPoints from './ExperimentPoints';
import useStyles from './styles';

interface TableDataProps {
  data: ScheduleWorkflow;
  deleteRow: (wfid: string) => void;
}

const TableData: React.FC<TableDataProps> = ({ data, deleteRow }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const projectID = getProjectID();
  const projectRole = getProjectRole();

  // States for PopOver to display Experiment Weights
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [popAnchorEl, setPopAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const tabs = useActions(TabActions);
  const open = Boolean(anchorEl);
  const isOpen = Boolean(popAnchorEl);
  const id = isOpen ? 'simple-popover' : undefined;
  const handlePopOverClose = () => {
    setPopAnchorEl(null);
  };

  const workflow = useActions(WorkflowActions);

  const handlePopOverClick = (event: React.MouseEvent<HTMLElement>) => {
    setPopAnchorEl(event.currentTarget);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsModalOpen(false);
  };

  // States for PopOver to display schedule details
  const [
    popAnchorElSchedule,
    setPopAnchorElSchedule,
  ] = React.useState<null | HTMLElement>(null);
  const isOpenSchedule = Boolean(popAnchorElSchedule);
  const idSchedule = isOpenSchedule ? 'simple-popover' : undefined;
  const handlePopOverCloseForSchedule = () => {
    setPopAnchorElSchedule(null);
  };

  const handlePopOverClickForSchedule = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setPopAnchorElSchedule(event.currentTarget);
  };

  // Function to download the manifest
  const downloadYAML = (manifest: string, name: string) => {
    const parsedYAML = YAML.parse(manifest);
    const doc = new YAML.Document();
    doc.contents = parsedYAML;
    const element = document.createElement('a');
    const file = new Blob([YAML.stringify(doc)], {
      type: 'text/yaml',
    });
    element.href = URL.createObjectURL(file);
    element.download = `${name}.yaml`;
    document.body.appendChild(element);
    element.click();
  };

  // Function to convert UNIX time in format of DD MMM YYY
  const formatDate = (date: string) => {
    const updated = new Date(parseInt(date, 10) * 1000).toString();
    const resDate = moment(updated).format('DD MMM YYYY');
    if (date) return resDate;
    return 'Date not available';
  };

  const editSchedule = () => {
    history.push({
      pathname: `/workflows/schedule/${data.project_id}/${data.workflow_name}`,
      search: `?projectID=${projectID}&projectRole=${projectRole}`,
    });
  };

  // If regularity is not Once then set recurring schedule state to true
  if (data.cronSyntax !== '') {
    workflow.setWorkflowDetails({
      isRecurring: true,
    });
  }

  const [reRunChaosWorkFlow] = useMutation(RERUN_CHAOS_WORKFLOW, {
    onCompleted: () => {
      tabs.changeWorkflowsTabs(0);
    },
  });

  const reRunSchedule = () => {
    reRunChaosWorkFlow({
      variables: {
        data: data.workflow_id,
      },
    });
  };

  return (
    <>
      <TableCell className={classes.workflowNameData}>
        <Typography>
          <span
            className={
              YAML.parse(data.workflow_manifest).spec.suspend === true
                ? classes.dark
                : ''
            }
          >
            <strong>{data.workflow_name}</strong>
          </span>
        </Typography>
      </TableCell>
      <TableCell>
        <Typography>
          <span
            className={
              YAML.parse(data.workflow_manifest).spec.suspend === true
                ? classes.dark
                : ''
            }
          >
            {data.cluster_name}
          </span>
        </Typography>
      </TableCell>
      <TableCell>
        <Button onClick={handlePopOverClick} style={{ textTransform: 'none' }}>
          <span
            className={
              YAML.parse(data.workflow_manifest).spec.suspend === true
                ? classes.dark
                : ''
            }
          >
            <div className={classes.expDiv}>
              <Typography className={classes.expInfo}>
                <strong>
                  {t('chaosWorkflows.browseSchedule.showExperiment')}
                </strong>
              </Typography>
              {isOpen ? <KeyboardArrowDownIcon /> : <ChevronRightIcon />}
            </div>
          </span>
        </Button>
        <Popover
          id={id}
          open={isOpen}
          anchorEl={popAnchorEl}
          onClose={handlePopOverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          style={{
            marginTop: 10,
          }}
        >
          <div className={classes.weightDiv}>
            {data.weightages.map((expData) => {
              return (
                <div key={expData.experiment_name} style={{ marginBottom: 8 }}>
                  <ExperimentPoints
                    expName={expData.experiment_name}
                    weight={expData.weightage}
                  />
                </div>
              );
            })}
          </div>
        </Popover>
      </TableCell>
      <TableCell>
        <Button
          onClick={handlePopOverClickForSchedule}
          style={{ textTransform: 'none' }}
        >
          <span
            className={
              YAML.parse(data.workflow_manifest).spec.suspend === true
                ? classes.dark
                : ''
            }
          >
            <div className={classes.expDiv}>
              <Typography className={classes.expInfo}>
                <strong>Show Schedule</strong>
              </Typography>
              {isOpenSchedule ? (
                <KeyboardArrowDownIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </div>
          </span>
        </Button>
        <Popover
          id={idSchedule}
          open={isOpenSchedule}
          anchorEl={popAnchorElSchedule}
          onClose={handlePopOverCloseForSchedule}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          style={{
            marginTop: 10,
          }}
        >
          <div className={classes.weightDiv}>
            <Typography className={classes.scheduleDetailsFlex}>
              <strong>Starting Date:</strong>
              <span className={classes.scheduleDetailsValue}>
                {formatDate(data.created_at)}
              </span>
            </Typography>
            <Typography className={classes.scheduleDetailsFlex}>
              <strong>Last Run:</strong>
              <span className={classes.scheduleDetailsValue}>
                {timeDifferenceForDate(data.updated_at)}
              </span>
            </Typography>
            <Typography className={classes.scheduleDetailsFlex}>
              <strong>Regularity:</strong>
              <span className={classes.scheduleDetailsValue}>
                {data.cronSyntax === '' ? (
                  <>{t('chaosWorkflows.browseSchedule.regularityOnce')}</>
                ) : (
                  cronstrue.toString(data.cronSyntax)
                )}
              </span>
            </Typography>
          </div>
        </Popover>
      </TableCell>
      <TableCell>
        <span
          className={
            YAML.parse(data.workflow_manifest).spec.suspend === true
              ? classes.dark
              : ''
          }
        >
          {data.cronSyntax !== '' && (
            <Typography>
              {parser.parseExpression(data.cronSyntax).next().toString()}
            </Typography>
          )}
        </span>
      </TableCell>
      <TableCell className={classes.menuCell}>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
          className={classes.optionBtn}
          data-cy="browseScheduleOptions"
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
        >
          {data.cronSyntax !== '' ? (
            <MenuItem value="Edit_Schedule" onClick={() => editSchedule()}>
              <div className={classes.expDiv}>
                <img
                  src="./icons/Edit.svg"
                  alt="Edit Schedule"
                  className={classes.btnImg}
                />
                <Typography data-cy="editSchedule" className={classes.btnText}>
                  Edit Schedule
                </Typography>
              </div>
            </MenuItem>
          ) : (
            <></>
          )}
          {projectRole !== 'Viewer' && data.cronSyntax === '' ? (
            <MenuItem value="Rerun_Schedule" onClick={() => reRunSchedule()}>
              <div className={classes.expDiv}>
                <ReplayIcon className={classes.rerunBtn} />
                <Typography data-cy="reRunSchedule" className={classes.btnText}>
                  Re-Run Schedule
                </Typography>
              </div>
            </MenuItem>
          ) : (
            <></>
          )}
          <MenuItem
            value="Download"
            onClick={() =>
              downloadYAML(data.workflow_manifest, data.workflow_name)
            }
          >
            <div className={classes.expDiv}>
              <GetAppIcon className={classes.downloadBtn} />
              <Typography
                data-cy="downloadManifest"
                className={classes.downloadText}
              >
                Download Manifest
              </Typography>
            </div>
          </MenuItem>
          {projectRole !== 'Viewer' ? (
            <MenuItem value="Analysis" onClick={() => setIsModalOpen(true)}>
              <div className={classes.expDiv}>
                <img
                  src="/icons/deleteSchedule.svg"
                  alt="Delete Schedule"
                  className={classes.btnImg}
                />
                <Typography
                  data-cy="deleteSchedule"
                  className={classes.btnText}
                >
                  Delete Schedule
                </Typography>
              </div>
            </MenuItem>
          ) : null}
        </Menu>
      </TableCell>
      {isModalOpen ? (
        <Modal
          open={isModalOpen}
          onClose={handleClose}
          width="60%"
          modalActions={
            <ButtonOutlined onClick={handleClose}>&#x2715;</ButtonOutlined>
          }
        >
          <div className={classes.modalDiv}>
            <CrossMarkIcon />
            <Typography className={classes.modalHeader}>
              {t('createWorkflow.scheduleWorkflow.modalHeader')}
            </Typography>
            <Typography className={classes.modalConfirm}>
              {t('createWorkflow.scheduleWorkflow.modalSubheader')}
            </Typography>
            <div className={classes.modalBtns}>
              <ButtonOutlined onClick={() => setIsModalOpen(false)}>
                {t('createWorkflow.scheduleWorkflow.cancelBtn')}
              </ButtonOutlined>
              <ButtonFilled
                variant="error"
                className={classes.w7}
                onClick={() => {
                  deleteRow(data.workflow_id);
                  setIsModalOpen(false);
                }}
              >
                {t('createWorkflow.scheduleWorkflow.deleteBtn')}
              </ButtonFilled>
            </div>
          </div>
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
};
export default TableData;
