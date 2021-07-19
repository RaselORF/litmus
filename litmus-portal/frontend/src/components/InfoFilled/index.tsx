import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Center from '../../containers/layouts/Center';
import { RootState } from '../../redux/reducers';
import DownloadIcon from '../../svg/download.svg';
import ExperimentIcon from '../../svg/myhub.svg';
import WorkflowIcon from '../../svg/workflows.svg';
import formatCount from '../../utils/formatCount';
import Loader from '../Loader';
import useStyles from './styles';

interface CardValueData {
  imgPath: string;
  color: string;
  value: number;
  statType: string;
  plus?: boolean | undefined;
}
/*
  Reusable Custom Information Card
  Required Params: color, statType
  Optional Params: plus, value
*/

const InfoFilledWrap: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const theme = useTheme();
  // Card Value Data fetched from Redux
  const { communityData, loading, error } = useSelector(
    (state: RootState) => state.communityData
  );

  const cardData: CardValueData[] = [
    {
      imgPath: ExperimentIcon,
      color: theme.palette.warning.main,
      value: parseInt(communityData.github.experimentsCount, 10),
      statType: 'Total Experiments',
    },
    {
      imgPath: DownloadIcon,
      color: theme.palette.secondary.main,
      value: parseInt(communityData.google.operatorInstalls, 10),
      statType: 'Operator Installs',
      plus: true,
    },
    {
      imgPath: WorkflowIcon,
      color: theme.palette.primary.main,
      value: parseInt(communityData.google.totalRuns, 10),
      statType: 'Total Experiment Runs',
      plus: true,
    },
    {
      imgPath: './icons/github.svg',
      color: theme.palette.error.main,
      value: parseInt(communityData.github.stars, 10),
      statType: 'GitHub Stars',
    },
  ];

  const cardArray = cardData.map((individualCard) => {
    return (
      <div key={individualCard.statType} className={classes.infoFilledDiv}>
        {/*
          If value of plus is provided then render a different
          plus icon else dont
          
          formatCount -> utility is used to convert large value to
          their respective Thousands or Millions respectively
        */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
          }}
        >
          <img
            style={{
              width: '1.5rem',
              height: '1.5rem',
              marginRight: '0.5rem',
              fill: 'red',
            }}
            src={individualCard.imgPath}
          />
          <Typography className={classes.value}>
            {formatCount(individualCard.value)}
            {individualCard.plus && <span className={classes.plusBtn}>+</span>}
          </Typography>
        </div>

        <Typography className={classes.statType}>
          {individualCard.statType}
        </Typography>
      </div>
    );
  });

  return (
    <div className={classes.infoFilledWrap}>
      {loading ? (
        <div>
          <Loader />
          <Typography>{t('internetIssues.fetchData')}</Typography>
        </div>
      ) : error ? (
        <div className={classes.errorMessage}>
          <Center>
            <Typography variant="h4">
              {t('internetIssues.connectionError')}
            </Typography>
          </Center>
        </div>
      ) : (
        cardArray
      )}
    </div>
  );
};

export default InfoFilledWrap;
