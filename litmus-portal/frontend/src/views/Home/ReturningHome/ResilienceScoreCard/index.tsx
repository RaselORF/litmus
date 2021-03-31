import { IconButton, Paper, Typography } from '@material-ui/core';
import { RadialProgressChart } from 'litmus-ui';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { history } from '../../../../redux/configureStore';
import {
  getProjectID,
  getProjectRole,
} from '../../../../utils/getSearchParams';
import useStyles from './styles';

interface AverageResilienceScoreProps {
  value: number;
}

const ResilienceScoreCard: React.FC<AverageResilienceScoreProps> = ({
  value,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  // Get selected projectID from the URL
  const projectID = getProjectID();
  // Set userRole
  const projectRole = getProjectRole();

  return (
    <Paper id="totWorkflows" className={classes.totWorkFlow}>
      <div className={classes.detailsDiv}>
        <Typography className={classes.workflowHeader}>
          Average Resilience Score
        </Typography>
        <div className={classes.flexEnd}>
          {t('home.NonAdmin.toAnalytics')}
          <IconButton
            className={classes.goToIcon}
            onClick={() => {
              history.push({
                pathname: `/analytics`,
                search: `?projectID=${projectID}&projectRole=${projectRole}`,
              });
            }}
          >
            <img src="./icons/goToIcon.svg" alt="go to" />
          </IconButton>
        </div>
      </div>
      <div style={{ height: '6.4rem', width: '11.125rem' }}>
        <RadialProgressChart
          className={classes.radialGraph}
          arcWidth={10}
          iconSize="1rem"
          imageSrc="./icons/radialIcon.svg"
          radialData={{
            value,
            label: 'pass',
            baseColor: '#5B44BA',
          }}
          semiCircle
          heading="Based on test results"
          unit="%"
        />
      </div>
    </Paper>
  );
};

export default ResilienceScoreCard;
