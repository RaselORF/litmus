import { useLazyQuery, useQuery } from '@apollo/client';
import {
  Button,
  ClickAwayListener,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  MenuList,
  OutlinedInput,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { ButtonFilled, InputField } from 'litmus-ui';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import YAML from 'yaml';
import Loader from '../../../../components/Loader';
import { GET_CHARTS_DATA, GET_HUB_STATUS } from '../../../../graphql';
import { GET_EXPERIMENT_YAML } from '../../../../graphql/queries';
import { MyHubDetail } from '../../../../models/graphql/user';
import { Charts, HubStatus } from '../../../../models/redux/myhub';
import WorkflowDetails from '../../../../pages/WorkflowDetails';
import useActions from '../../../../redux/actions';
import * as TemplateSelectionActions from '../../../../redux/actions/template';
import * as WorkflowActions from '../../../../redux/actions/workflow';
import { history } from '../../../../redux/configureStore';
import { RootState } from '../../../../redux/reducers';
import { validateWorkflowName } from '../../../../utils/validate';
import BackButton from '../BackButton';
import useStyles, { MenuProps } from './styles';

interface WorkflowDetails {
  workflow_name: string;
  workflow_desc: string;
  namespace: string;
}

interface ChartName {
  ChaosName: string;
  ExperimentName: string;
}

interface VerifyCommitProps {
  gotoStep: (page: number) => void;
}

const CreateWorkflow: React.FC<VerifyCommitProps> = ({ gotoStep }) => {
  const workflowDetails = useSelector((state: RootState) => state.workflowData);
  const workflowAction = useActions(WorkflowActions);

  const { selectedProjectID } = useSelector(
    (state: RootState) => state.userData
  );

  const [workflowData, setWorkflowData] = useState<WorkflowDetails>({
    workflow_name: workflowDetails.name,
    workflow_desc: workflowDetails.description,
    namespace: workflowDetails.namespace,
  });

  const { t } = useTranslation();
  const classes = useStyles();

  const [allExperiments, setAllExperiments] = useState<ChartName[]>([]);
  const [selectedHub, setSelectedHub] = useState('');
  const [selectedExp, setSelectedExp] = useState(
    t('customWorkflow.createWorkflow.selectAnExp') as string
  );
  const [availableHubs, setAvailableHubs] = useState<MyHubDetail[]>([]);
  const template = useActions(TemplateSelectionActions);

  const [selectedHubDetails, setSelectedHubDetails] = useState<MyHubDetail>();

  const [getExperimentYaml] = useLazyQuery(GET_EXPERIMENT_YAML, {
    variables: {
      experimentInput: {
        ProjectID: selectedProjectID,
        HubName: selectedHub,
        ChartName: selectedExp.split('/')[0],
        ExperimentName: selectedExp.split('/')[1],
        FileType: 'experiment',
      },
    },
    onCompleted: (data) => {
      const parsedYaml = YAML.parse(data.getYAMLData);
      workflowAction.setWorkflowDetails({
        customWorkflow: {
          ...workflowDetails.customWorkflow,
          description: parsedYaml.description.message,
          experimentYAML: data.getYAMLData,
        },
      });
      gotoStep(1);
    },
  });
  const [verifyYAML, setVerifyYAML] = useState(true);
  // Graphql query to get charts
  const [getCharts, { loading: chartsLoading }] = useLazyQuery<Charts>(
    GET_CHARTS_DATA,
    {
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
    }
  );

  // Get all MyHubs with status
  const { data } = useQuery<HubStatus>(GET_HUB_STATUS, {
    variables: { data: selectedProjectID },
    fetchPolicy: 'cache-and-network',
    onCompleted: (hubData) => {
      if (hubData.getHubStatus.length) {
        setSelectedHub(hubData.getHubStatus[0].HubName);
        setAvailableHubs([...hubData.getHubStatus]);
        getCharts({
          variables: {
            projectID: selectedProjectID,
            HubName: hubData.getHubStatus[0].HubName,
          },
        });
        setSelectedHubDetails(hubData.getHubStatus[0]);
      }
    },
  });
  const [constructYAML, setConstructYAML] = useState('construct');
  useEffect(() => {
    if (data?.getHubStatus.length) {
      setConstructYAML('construct');
    } else {
      setConstructYAML('upload');
    }
  }, [data]);
  // Function to get charts of a particular hub
  const findChart = (hubname: string) => {
    const myHubData = data?.getHubStatus.filter((myHub) => {
      return hubname === myHub.HubName;
    })[0];
    getCharts({
      variables: {
        projectID: selectedProjectID,
        HubName: hubname,
      },
    });
    setSelectedHubDetails(myHubData);
  };

  const [open, setOpen] = useState(false);

  const filteredExperiment = allExperiments.filter((exp) => {
    const name = `${exp.ChaosName}/${exp.ExperimentName}`;
    if (selectedExp === 'Select an experiment') {
      return true;
    }
    return name.includes(selectedExp);
  });
  const [uploadedYAML, setUploadedYAML] = useState('');
  const [fileName, setFileName] = useState<string | null>('');

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    Array.from(e.dataTransfer.files)
      .filter(
        (file) =>
          file.name.split('.')[1] === 'yaml' ||
          file.name.split('.')[1] === 'yml'
      )
      .forEach(async (file) => {
        const readFile = await file.text();
        setUploadedYAML(readFile);
        setFileName(file.name);
        try {
          const parsedYaml = YAML.parse(readFile);
          setVerifyYAML(true);
          workflowAction.setWorkflowDetails({
            ...workflowDetails,
            yaml: YAML.stringify(parsedYaml),
          });
        } catch (err) {
          console.error(err);
          setVerifyYAML(false);
          setUploadedYAML('');
        }
      });
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const readFile = e.target.files && e.target.files[0];
    setFileName(readFile && readFile.name);
    const extension = readFile?.name.substring(
      readFile.name.lastIndexOf('.') + 1
    );
    if ((extension === 'yaml' || extension === 'yml') && readFile) {
      readFile.text().then((response) => {
        setUploadedYAML(response);
        try {
          const parsedYaml = YAML.parse(response);
          setVerifyYAML(true);
          workflowAction.setWorkflowDetails({
            ...workflowDetails,
            yaml: YAML.stringify(parsedYaml),
          });
        } catch (err) {
          console.error(err);
          setVerifyYAML(false);
          setUploadedYAML('');
        }
      });
    } else {
      workflowAction.setWorkflowDetails({
        ...workflowDetails,
        yaml: '',
      });
    }
  };
  return (
    <div className={classes.root}>
      <div className={classes.headerDiv}>
        <BackButton
          isDisabled={false}
          onClick={() => {
            workflowAction.setWorkflowDetails({
              isCustomWorkflow: false,
            });
            window.history.back();
          }}
        />
        <Typography variant="h3" className={classes.headerText} gutterBottom>
          {t('customWorkflow.createWorkflow.create')}
        </Typography>
        <Typography className={classes.headerDesc}>
          {t('customWorkflow.createWorkflow.createDesc')}
        </Typography>
      </div>
      <div className={classes.workflowDiv}>
        <Typography variant="h4">
          <strong> {t('customWorkflow.createWorkflow.workflowInfo')}</strong>
        </Typography>
        <div>
          <div className={classes.inputDiv}>
            <Typography variant="h6" className={classes.titleText}>
              {t('customWorkflow.createWorkflow.workflowName')}:
            </Typography>
            <InputField
              label="Workflow Name"
              fullWidth
              data-cy="inputWorkflowName"
              variant={
                validateWorkflowName(workflowData.workflow_name)
                  ? 'error'
                  : 'primary'
              }
              helperText={
                validateWorkflowName(workflowData.workflow_name)
                  ? t('createWorkflow.chooseWorkflow.validate')
                  : ''
              }
              onChange={(e) => {
                setWorkflowData({
                  workflow_name: e.target.value,
                  workflow_desc: workflowData.workflow_desc,
                  namespace: workflowData.namespace,
                });
              }}
              value={workflowData.workflow_name}
            />
          </div>
          <div className={classes.inputDiv}>
            <Typography variant="h6" className={classes.titleText}>
              {t('customWorkflow.createWorkflow.workflowDesc')}:
            </Typography>
            <InputField
              label="Description"
              data-cy="inputWorkflowDesc"
              InputProps={{
                disableUnderline: true,
              }}
              onChange={(e) => {
                setWorkflowData({
                  workflow_name: workflowData.workflow_name,
                  workflow_desc: e.target.value,
                  namespace: workflowData.namespace,
                });
              }}
              value={workflowData.workflow_desc}
              multiline
              rows={14}
            />
          </div>
          <hr />
          <Typography variant="h5" className={classes.configureYAML}>
            <strong>{t('customWorkflow.createWorkflow.configure')}</strong>
          </Typography>

          <FormControl component="fieldset">
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={constructYAML}
              onChange={(event) => {
                setConstructYAML(event.target.value);
                if (event.target.value === 'construct') {
                  setUploadedYAML('');
                }
              }}
            >
              <FormControlLabel
                value="construct"
                control={
                  <Radio
                    classes={{ root: classes.radio, checked: classes.checked }}
                  />
                }
                disabled={data?.getHubStatus.length === 0}
                label={
                  <Typography className={classes.radioText}>
                    {t('customWorkflow.createWorkflow.construct')}
                  </Typography>
                }
              />
              {constructYAML === 'construct' ? (
                <>
                  <div className={classes.inputDiv}>
                    <Typography variant="h6" className={classes.titleText}>
                      {t('customWorkflow.createWorkflow.firstChaos')}
                    </Typography>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                      color="primary"
                      focused
                    >
                      <InputLabel className={classes.selectText}>
                        {t('customWorkflow.createWorkflow.selectHub')}
                      </InputLabel>
                      <Select
                        value={selectedHub}
                        onChange={(e) => {
                          setSelectedHub(e.target.value as string);
                          findChart(e.target.value as string);
                        }}
                        label="Cluster Status"
                        MenuProps={MenuProps}
                        className={classes.selectText}
                      >
                        {availableHubs.map((hubs) => (
                          <MenuItem key={hubs.HubName} value={hubs.HubName}>
                            {hubs.HubName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className={classes.inputDiv}>
                    <Typography variant="h6" className={classes.titleText}>
                      {t('customWorkflow.createWorkflow.chooseExp')}
                    </Typography>
                    {chartsLoading ? (
                      <div className={classes.chooseExpDiv}>
                        <Loader />
                        <Typography variant="body2">
                          {t('customWorkflow.createWorkflow.loadingExp')}
                        </Typography>
                      </div>
                    ) : (
                      <FormControl
                        variant="outlined"
                        color="primary"
                        focused
                        component="button"
                        className={classes.formControlExp}
                      >
                        <InputLabel className={classes.selectText1}>
                          {t('customWorkflow.createWorkflow.selectExp')}
                        </InputLabel>
                        <OutlinedInput
                          value={selectedExp}
                          onChange={(e) => {
                            setSelectedExp(e.target.value);
                            setOpen(true);
                          }}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => {
                                  setOpen(!open);
                                }}
                                edge="end"
                              >
                                <ArrowDropDownIcon color="secondary" />
                              </IconButton>
                            </InputAdornment>
                          }
                          className={classes.inputExpDiv}
                          labelWidth={150}
                        />
                        {open ? (
                          <ClickAwayListener onClickAway={() => setOpen(!open)}>
                            <Paper elevation={3}>
                              <MenuList className={classes.expMenu}>
                                {filteredExperiment.length > 0 ? (
                                  filteredExperiment.map((exp) => (
                                    <MenuItem
                                      key={`${exp.ChaosName}/${exp.ExperimentName}`}
                                      value={`${exp.ChaosName}/${exp.ExperimentName}`}
                                      onClick={() => {
                                        setSelectedExp(
                                          `${exp.ChaosName}/${exp.ExperimentName}`
                                        );
                                        setOpen(false);
                                      }}
                                    >
                                      {exp.ExperimentName}
                                    </MenuItem>
                                  ))
                                ) : (
                                  <MenuItem value="Select an experiment">
                                    {t('customWorkflow.createWorkflow.noExp')}
                                  </MenuItem>
                                )}
                              </MenuList>
                            </Paper>
                          </ClickAwayListener>
                        ) : null}
                      </FormControl>
                    )}
                  </div>
                  <div className={classes.inputDiv}>
                    <Typography variant="h6" className={classes.titleText}>
                      {t('customWorkflow.createWorkflow.chooseNamespace')}
                    </Typography>
                    <FormControl
                      variant="outlined"
                      color="primary"
                      focused
                      component="button"
                      className={classes.formControlExp}
                    >
                      <InputLabel className={classes.selectText1}>
                        {t('customWorkflow.createWorkflow.chooseNamespace')}
                      </InputLabel>

                      <OutlinedInput
                        value={workflowData.namespace}
                        onChange={(e) => {
                          setWorkflowData({
                            workflow_name: workflowData.workflow_name,
                            workflow_desc: workflowData.workflow_desc,
                            namespace: e.target.value,
                          });
                        }}
                        className={classes.inputExpDiv}
                        labelWidth={130}
                      />
                    </FormControl>
                  </div>
                </>
              ) : null}

              <FormControlLabel
                value="upload"
                control={
                  <Radio
                    classes={{ root: classes.radio, checked: classes.checked }}
                  />
                }
                disabled={workflowDetails.customWorkflows.length !== 0}
                label={
                  <Typography className={classes.radioText}>
                    {t('customWorkflow.createWorkflow.upload')}{' '}
                    <strong>{t('customWorkflow.createWorkflow.yaml')}</strong>
                  </Typography>
                }
              />
              {constructYAML === 'upload' ? (
                <Paper
                  elevation={3}
                  component="div"
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDrag(e);
                  }}
                  className={classes.uploadYAMLDiv}
                >
                  {uploadedYAML === '' ? (
                    <div className={classes.uploadYAMLText}>
                      <img src="/icons/upload-yaml.svg" alt="upload yaml" />
                      <Typography variant="h5">
                        {t('customWorkflow.createWorkflow.drag')}
                      </Typography>
                      <Typography>or</Typography>
                      <input
                        accept=".yaml"
                        style={{ display: 'none' }}
                        id="contained-button-file"
                        type="file"
                        onChange={(e) => {
                          handleFileUpload(e);
                        }}
                      />
                      <label htmlFor="contained-button-file">
                        <Button
                          variant="outlined"
                          className={classes.uploadBtn}
                          component="span"
                        >
                          {t('customWorkflow.createWorkflow.uploadFile')}
                        </Button>
                      </label>
                    </div>
                  ) : (
                    <div className={classes.uploadSuccessDiv}>
                      <img
                        src="/icons/upload-success.svg"
                        alt="checkmark"
                        className={classes.uploadSuccessImg}
                      />
                      <Typography className={classes.uploadSuccessText}>
                        {t('customWorkflow.createWorkflow.uploadSuccess')}{' '}
                        {fileName}
                      </Typography>
                    </div>
                  )}
                </Paper>
              ) : null}
              {!verifyYAML ? (
                <Typography className={classes.uploadTextWarning}>
                  {t('customWorkflow.createWorkflow.uploadFailMessage')}{' '}
                </Typography>
              ) : null}
            </RadioGroup>
          </FormControl>
        </div>
      </div>
      <div className={classes.nextButtonDiv}>
        <ButtonFilled
          onClick={() => {
            if (constructYAML === 'upload' && uploadedYAML !== '') {
              const parsedYaml = YAML.parse(workflowDetails.yaml);
              parsedYaml.metadata.name = workflowData.workflow_name;
              parsedYaml.metadata.namespace = workflowData.namespace;
              workflowAction.setWorkflowDetails({
                ...workflowDetails,
                yaml: YAML.stringify(parsedYaml),
              });
              history.push('/create-workflow');
              template.selectTemplate({ isDisable: false });
            }
            workflowAction.setWorkflowDetails({
              name: workflowData.workflow_name,
              description: workflowData.workflow_desc,
              namespace: workflowData.namespace,
              customWorkflow: {
                ...workflowDetails.customWorkflow,
                hubName: selectedHub,
                experiment_name: selectedExp,
                repoUrl: selectedHubDetails?.RepoURL,
                repoBranch: selectedHubDetails?.RepoBranch,
                yaml: '',
                index: -1,
              },
            });
            getExperimentYaml();
          }}
          disabled={
            constructYAML === 'construct' &&
            (selectedExp === 'Select an experiment' ||
              filteredExperiment.length !== 1 ||
              workflowData.namespace.trim() === '')
              ? true
              : !!(constructYAML === 'upload' && uploadedYAML === '')
          }
        >
          <div>
            {t('customWorkflow.createWorkflow.nextBtn')}
            <img
              alt="next"
              src="/icons/nextArrow.svg"
              className={classes.nextArrow}
            />
          </div>
        </ButtonFilled>
      </div>
    </div>
  );
};
export default CreateWorkflow;
