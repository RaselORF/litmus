import { Card, CardActionArea, Typography } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import InfoFilled from '../../components/InfoFilled/index';
import QuickActionCard from '../../components/QuickActionCard';
import Scaffold from '../../containers/layouts/Scaffold';
import useStyles from './style';

const CreateWorkflowCard = () => {
  const classes = useStyles();
  const history = useHistory();

  const routeChange = () => {
    const path = `/workflow`;
    history.push(path);
  };
  return (
    <Card
      elevation={3}
      className={classes.createWorkflowCard}
      onClick={() => {
        routeChange();
      }}
      data-cy="createWorkflow"
    >
      <CardActionArea>
        <Typography className={classes.createWorkflowHeading}>
          Let&#39;s Start
        </Typography>
        <Typography className={classes.createWorkflowTitle}>
          Schedule your first workflow
        </Typography>
        <ArrowForwardIcon className={classes.arrowForwardIcon} />
      </CardActionArea>
    </Card>
  );
};

interface CardValueData {
  color: string;
  value: number;
  statType: string;
  plus?: boolean | undefined;
}

const HomePage = () => {
  const cardData: CardValueData[] = [
    {
      color: '#109B67',
      value: 11200,
      statType: 'Operator Installed',
      plus: false,
    },
    { color: '#858CDD', value: 29, statType: 'Total Experiments', plus: true },
    {
      color: '#F6B92B',
      value: 6000,
      statType: 'Total Runs Experiments',
      plus: true,
    },
    { color: '#BA3B34', value: 800, statType: 'Github Stars', plus: true },
  ];
  const [userName] = useState('Richard Hill');
  const classes = useStyles();
  return (
    <Scaffold>
      <div className={classes.rootContainer}>
        <div className={classes.root}>
          <Typography className={classes.userName}>
            Welcome, <strong>{userName}</strong>
          </Typography>
          <div className={classes.headingDiv}>
            <div className={classes.mainDiv}>
              <div>
                <Typography className={classes.mainHeading}>
                  <strong>Congratulations!</strong>
                </Typography>
                <Typography className={classes.mainResult}>
                  <strong>
                    You have established your own first project on Litmus
                    portal.{' '}
                  </strong>
                </Typography>
                <Typography className={classes.mainDesc}>
                  Now this is successfully running on your Kubernetes cluster.
                  Once you schedule chaos workflows, reliability analytics are
                  displayed here.
                </Typography>
              </div>
              <div className={classes.imageDiv}>
                <img src="icons/applause.png" alt="Applause icon" />
              </div>
            </div>
            <div>
              <CreateWorkflowCard data-cy="CreateWorkflowCard" />
            </div>
          </div>
          <div className={classes.contentDiv}>
            <div className={classes.statDiv}>
              <Typography className={classes.statsHeading}>
                <strong>How busy Litmus Project is?</strong>
              </Typography>
              <div className={classes.cardDiv}>
                {cardData.map((data) => (
                  <InfoFilled
                    color={data.color}
                    value={data.value}
                    statType={data.statType}
                    plus={data.plus}
                  />
                ))}
              </div>
            </div>
            <div className={classes.quickActionDiv}>
              <QuickActionCard />
            </div>
          </div>
        </div>
      </div>
    </Scaffold>
  );
};

export default HomePage;
