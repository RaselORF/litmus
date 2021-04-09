import { useLazyQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';
import { ButtonOutlined, Modal } from 'litmus-ui';
import localforage from 'localforage';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import YAML from 'yaml';
import YamlEditor from '../../../components/YamlEditor/Editor';
import Row from '../../../containers/layouts/Row';
import Width from '../../../containers/layouts/Width';
import {
  GET_CHARTS_DATA,
  GET_ENGINE_YAML,
  GET_EXPERIMENT_YAML,
} from '../../../graphql/queries';
import { ChooseWorkflowRadio } from '../../../models/localforage/radioButton';
import { WorkflowDetailsProps } from '../../../models/localforage/workflow';
import { CustomYAML, Steps } from '../../../models/redux/customyaml';
import { Charts } from '../../../models/redux/myhub';
import useActions from '../../../redux/actions';
import * as AlertActions from '../../../redux/actions/alert';
import * as WorkflowActions from '../../../redux/actions/workflow';
import { RootState } from '../../../redux/reducers';
import capitalize from '../../../utils/capitalize';
import { getProjectID } from '../../../utils/getSearchParams';
import { updateEngineName } from '../../../utils/yamlUtils';
import AddExperimentModal from './AddExperimentModal';
import useStyles from './styles';
import WorkflowPreview from './WorkflowPreview';
import WorkflowTable from './WorkflowTable';

interface WorkflowProps {
  name: string;
  crd: string;
  description: string;
}

interface WorkflowExperiment {
  ChaosEngine: string;
  Experiment: string;
}

interface ChartName {
  ChaosName: string;
  ExperimentName: string;
}

interface WorkflowExperiment {
  ChaosEngine: string;
  Experiment: string;
}

let installAllExp = '';
// Initial step in experiment
const customSteps: Steps[][] = [
  [
    {
      name: 'install-chaos-experiments',
      template: 'install-chaos-experiments',
    },
  ],
];

// UpdateCRD is used to updated the manifest while adding experiments from MyHub
const updateCRD = (crd: CustomYAML, experiment: WorkflowExperiment[]) => {
  const generatedYAML: CustomYAML = crd;

  const modifyYAML = (link: string) => {
    customSteps.push([
      {
        name: YAML.parse(link as string).metadata.name,
        template: YAML.parse(link as string).metadata.name,
      },
    ]);
    installAllExp = `${installAllExp}kubectl apply -f /tmp/${
      YAML.parse(link as string).metadata.name
    }.yaml -n {{workflow.parameters.adminModeNamespace}} | `;
  };

  experiment.forEach((exp) => {
    modifyYAML(Object.values(exp.Experiment)[0]);
  });

  // Step 1 in template (creating array of chaos-steps)
  generatedYAML.spec.templates[0] = {
    name: 'custom-chaos',
    steps: customSteps,
  };

  if (experiment.length) {
    // Step 2 in template (experiment YAMLs of all experiments)
    generatedYAML.spec.templates[1] = {
      name: 'install-chaos-experiments',
      inputs: {
        artifacts: [],
      },
      container: {
        args: [`${installAllExp}sleep 30`],
        command: ['sh', '-c'],
        image: 'alpine/k8s:1.18.2',
      },
    };
  }

  // Step 3 in template (engine YAMLs of all experiments)
  experiment.forEach((data) => {
    const ExperimentYAML = YAML.parse(Object.values(data.Experiment)[0]);
    ExperimentYAML.metadata.name = YAML.parse(
      Object.values(data.Experiment)[0]
    ).metadata.name;
    ExperimentYAML.metadata.namespace =
      '{{workflow.parameters.adminModeNamespace}}';
    const artifacts = generatedYAML.spec.templates[1].inputs?.artifacts;
    if (artifacts !== undefined) {
      artifacts.push({
        name: ExperimentYAML.metadata.name,
        path: `/tmp/${ExperimentYAML.metadata.name}.yaml`,
        raw: {
          data: YAML.stringify(ExperimentYAML),
        },
      });
    }
    const ChaosEngine = YAML.parse(Object.values(data.ChaosEngine)[0]);
    ChaosEngine.metadata.name = YAML.parse(
      Object.values(data.Experiment)[0]
    ).metadata.name;
    ChaosEngine.metadata.namespace =
      '{{workflow.parameters.adminModeNamespace}}';

    generatedYAML.spec.templates.push({
      name: ChaosEngine.metadata.name,
      inputs: {
        artifacts: [
          {
            name: ChaosEngine.metadata.name,
            path: `/tmp/chaosengine-${ChaosEngine.metadata.name}.yaml`,
            raw: {
              data: YAML.stringify(ChaosEngine),
            },
          },
        ],
      },
      container: {
        args: [
          `-file=/tmp/chaosengine-${ChaosEngine.metadata.name}.yaml`,
          `-saveName=/tmp/engine-name`,
        ],
        image: 'litmuschaos/litmus-checker:latest',
      },
    });
  });

  return generatedYAML;
};

const TuneWorkflow = forwardRef((_, ref) => {
  const classes = useStyles();

  // State Variables for Tune Workflow
  const [hubName, setHubName] = useState<string>('');
  const [experiment, setExperiment] = useState<WorkflowExperiment[]>([]);
  const [allExperiments, setAllExperiments] = useState<ChartName[]>([]);
  const [selectedExp, setSelectedExp] = useState('');
  const selectedProjectID = getProjectID();
  const [addExpModal, setAddExpModal] = useState(false);
  const [workflow, setWorkflow] = useState<WorkflowProps>({
    name: '',
    crd: '',
    description: '',
  });
  const { manifest, isCustomWorkflow } = useSelector(
    (state: RootState) => state.workflowManifest
  );

  const [YAMLModal, setYAMLModal] = useState<boolean>(false);

  // Actions
  const workflowAction = useActions(WorkflowActions);
  const alert = useActions(AlertActions);

  const { t } = useTranslation();

  // Graphql query to get charts
  const [getCharts] = useLazyQuery<Charts>(GET_CHARTS_DATA, {
    onCompleted: (data) => {
      const allExp: ChartName[] = [];
      data.getCharts.forEach((data) => {
        return data.Spec.Experiments?.forEach((experiment) => {
          allExp.push({
            ChaosName: data.Metadata.Name,
            ExperimentName: experiment,
          });
        });
      });
      setAllExperiments([...allExp]);
    },
    fetchPolicy: 'cache-and-network',
  });

  // Default CRD
  const yamlTemplate: CustomYAML = {
    apiVersion: 'argoproj.io/v1alpha1',
    kind: 'Workflow',
    metadata: {
      name: `${workflow.name}-${Math.round(new Date().getTime() / 1000)}`,
      namespace: `litmus`,
    },
    spec: {
      arguments: {
        parameters: [
          {
            name: 'adminModeNamespace',
            value: `litmus`,
          },
        ],
      },
      entrypoint: 'custom-chaos',
      securityContext: {
        runAsNonRoot: true,
        runAsUser: 1000,
      },
      serviceAccountName: 'argo-chaos',
      templates: [
        {
          name: '',
          steps: [[]],
          container: {
            image: '',
            command: [],
            args: [],
          },
        },
      ],
    },
  };

  // Generated YAML for custom workflows
  const [generatedYAML, setGeneratedYAML] = useState<CustomYAML>(
    manifest === '' ? yamlTemplate : YAML.parse(manifest)
  );

  // This function fetches the manifest for pre-defined workflows
  const fetchYaml = (link: string) => {
    fetch(link)
      .then((data) => {
        data.text().then((yamlText) => {
          const wfmanifest = updateEngineName(YAML.parse(yamlText));
          workflowAction.setWorkflowManifest({
            manifest: wfmanifest,
          });
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Index DB Fetching for extracting selected Button and Workflow Details
  const getSelectedWorkflowDetails = () => {
    localforage.getItem('workflow').then((workflow) =>
      setWorkflow({
        name: (workflow as WorkflowDetailsProps).name,
        crd: (workflow as WorkflowDetailsProps).CRDLink,
        description: (workflow as WorkflowDetailsProps).description,
      })
    );
    localforage.getItem('selectedScheduleOption').then((value) => {
      // Setting default data when MyHub is selected
      if (value !== null && (value as ChooseWorkflowRadio).selected === 'A') {
        localforage.getItem('workflow').then((value) => {
          if (
            value !== null &&
            (value as WorkflowDetailsProps).CRDLink !== '' &&
            manifest === ''
          )
            fetchYaml((value as WorkflowDetailsProps).CRDLink);
        });
      }
      if (value !== null && (value as ChooseWorkflowRadio).selected === 'C') {
        localforage.getItem('selectedHub').then((hub) => {
          setHubName(hub as string);
          getCharts({
            variables: { projectID: selectedProjectID, HubName: hub as string },
          });
        });
      }
    });
  };

  useEffect(() => {
    getSelectedWorkflowDetails();
  }, []);

  // Graphql Query for fetching Engine YAML
  const [
    getEngineYaml,
    { data: engineData, loading: engineDataLoading },
  ] = useLazyQuery(GET_ENGINE_YAML, {
    fetchPolicy: 'network-only',
  });

  // Graphql Query for fetching Experiment YAML
  const [
    getExperimentYaml,
    { data: experimentData, loading: experimentDataLoading },
  ] = useLazyQuery(GET_EXPERIMENT_YAML, {
    fetchPolicy: 'network-only',
  });

  /**
   * On Clicking the Done button present at Add Experiment Modal this function will get triggered
   * Click => Done
   * Function => handleDone()
   * */
  const handleDone = () => {
    getExperimentYaml({
      variables: {
        experimentInput: {
          ProjectID: selectedProjectID,
          HubName: hubName,
          ChartName: selectedExp.split('/')[0],
          ExperimentName: selectedExp.split('/')[1],
          FileType: 'experiment',
        },
      },
    });
    getEngineYaml({
      variables: {
        experimentInput: {
          ProjectID: selectedProjectID,
          HubName: hubName,
          ChartName: selectedExp.split('/')[0],
          ExperimentName: selectedExp.split('/')[1],
          FileType: 'engine',
        },
      },
    });

    setAddExpModal(false);
  };

  // UseEffect to make changes in the generated YAML
  // when a new experiment is added from MyHub
  useEffect(() => {
    if (isCustomWorkflow) {
      setGeneratedYAML(updateCRD(generatedYAML, experiment));
      workflowAction.setWorkflowManifest({
        manifest: YAML.stringify(generatedYAML),
      });
    }
  }, [experiment]);

  const onModalClose = () => {
    setAddExpModal(false);
  };

  const onSelectChange = (
    e: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    setSelectedExp(e.target.value as string);
  };

  useEffect(() => {
    if (engineData !== undefined && experimentData !== undefined) {
      setExperiment([
        {
          ChaosEngine: engineData,
          Experiment: experimentData,
        },
      ]);
    }
  }, [engineDataLoading, experimentDataLoading]);

  function onNext() {
    if (isCustomWorkflow && experiment.length === 0) {
      alert.changeAlertState(true); // Custom Workflow has no experiments
      return false;
    }
    return true;
  }

  useImperativeHandle(ref, () => ({
    onNext,
  }));

  return (
    <div className={classes.root}>
      {/* Header */}
      <div className={classes.headerWrapper}>
        <Typography className={classes.heading}>
          {t('createWorkflow.tuneWorkflow.header')}
        </Typography>
        <Row className={classes.descriptionWrapper}>
          <Typography className={classes.description}>
            {t('createWorkflow.tuneWorkflow.selectedWorkflowInfo')}{' '}
            <i>
              <strong>
                {workflow.name.split('-').map((text) => `${capitalize(text)} `)}
              </strong>
            </i>
            <br />
            {t('createWorkflow.tuneWorkflow.description')}
          </Typography>
          <div className={classes.headerBtn}>
            <ButtonOutlined
              onClick={() => {
                setYAMLModal(true);
              }}
              className={classes.editBtn}
            >
              <img src="./icons/viewYAMLicon.svg" alt="view YAML" />
              <Width width="1rem" /> {t('createWorkflow.tuneWorkflow.edit')}
            </ButtonOutlined>
            <Modal
              open={YAMLModal}
              onClose={() => {
                setYAMLModal(false);
              }}
              width="60%"
              modalActions={
                <ButtonOutlined
                  onClick={() => {
                    setYAMLModal(false);
                  }}
                  className={classes.closeBtn}
                >
                  <img src="./icons/cross-disabled.svg" alt="cross" />
                </ButtonOutlined>
              }
            >
              <div>
                <YamlEditor
                  content={
                    isCustomWorkflow ? YAML.stringify(generatedYAML) : manifest
                  }
                  filename={workflow.name}
                  readOnly={false}
                />
              </div>
            </Modal>
            <ButtonOutlined
              onClick={() => {
                setSelectedExp('');
                setAddExpModal(true);
              }}
            >
              {t('createWorkflow.tuneWorkflow.addANewExperiment')}
            </ButtonOutlined>
          </div>
        </Row>
      </div>
      {/* Add Experiment Modal */}
      <AddExperimentModal
        addExpModal={addExpModal}
        onModalClose={onModalClose}
        hubName={hubName}
        selectedExp={selectedExp}
        onSelectChange={onSelectChange}
        allExperiments={allExperiments}
        handleDone={handleDone}
      />
      {/* Experiment Details */}
      <div className={classes.experimentWrapper}>
        {/* Edit Button */}
        <ButtonOutlined>
          <img src="./icons/editsequence.svg" alt="Edit Sequence" />{' '}
          <Width width="0.5rem" />
          {t('createWorkflow.tuneWorkflow.editSequence')}
        </ButtonOutlined>
        {/* Details Section -> Graph on the Left and Table on the Right */}
        <Row>
          {/* Argo Workflow Graph */}
          <Width width="30%">
            <WorkflowPreview isCustomWorkflow={isCustomWorkflow} />
          </Width>
          {/* Workflow Table */}
          <Width width="70%">
            <WorkflowTable isCustom={isCustomWorkflow} />
          </Width>
        </Row>
      </div>
    </div>
  );
});

export default TuneWorkflow;
