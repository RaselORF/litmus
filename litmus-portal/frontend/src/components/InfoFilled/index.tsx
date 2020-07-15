import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import useStyles from './styles';
import { RootState } from '../../redux/reducers';
import formatCount from '../../utils/formatCount';

interface CardValueData {
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
  // Card Value Data fetched from Redux
  const communityData = useSelector((state: RootState) => state.communityData);
  const cardData: CardValueData[] = [
    {
      color: '#109B67',
      value: parseInt(communityData.google.operatorInstalls, 10),
      statType: 'Operator Installed',
      plus: true,
    },
    {
      color: '#858CDD',
      value: parseInt(communityData.google.totalRuns, 10),
      statType: 'Total Experiment Runs',
      plus: true,
    },
    {
      color: '#F6B92B',
      value: parseInt(communityData.github.experimentsCount, 10),
      statType: 'Total Experiments',
    },
    {
      color: '#BA3B34',
      value: parseInt(communityData.github.stars, 10),
      statType: 'Github Stars',
    },
  ];

  const cardArray = cardData.map((individualCard) => {
    return (
      <div
        style={{ backgroundColor: `${individualCard.color}` }}
        className={classes.infoFilledDiv}
      >
        {/*
          If value of plus is provided then render a different
          plus icon else dont
          
          formatCount -> utility is used to convert large value to
          their respective Thousands or Millions respectively
        */}
        {individualCard.plus ? (
          <Typography className={classes.value}>
            {formatCount(individualCard.value)}
            <span className={classes.plusBtn}>+</span>
          </Typography>
        ) : (
          <Typography className={classes.value}>
            {formatCount(individualCard.value)}
          </Typography>
        )}
        <hr className={classes.horizontalRule} />
        <Typography className={classes.statType}>
          {individualCard.statType}
        </Typography>
      </div>
    );
  });
  return <div className={classes.infoFilledWrap}>{cardArray}</div>;
};

export default InfoFilledWrap;
