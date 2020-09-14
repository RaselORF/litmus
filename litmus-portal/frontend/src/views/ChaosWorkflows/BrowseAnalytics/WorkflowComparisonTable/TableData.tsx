import React, { useRef, useState } from 'react';
import { TableCell, Typography, IconButton, Checkbox } from '@material-ui/core';
import useStyles from './styles';
import ExpandMoreTwoToneIcon from '@material-ui/icons/ExpandMoreTwoTone';
import WorkflowAnalytics from './WorkflowAnalyticsPopOver';
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';
import moment from 'moment';

interface TableDataProps {
  data: any;
  itemSelectionStatus: any;
  labelIdentifier: any;
  comparisonState: Boolean;
}

const TableData: React.FC<TableDataProps> = ({
  data,
  itemSelectionStatus,
  labelIdentifier,
  comparisonState,
}) => {
  const classes = useStyles();

  const [isProfilePopoverOpen, setProfilePopoverOpen] = useState(false);

  const profileMenuRef = useRef();

  // Function to convert UNIX time in format of DD MMM YYY
  const formatDate = (date: any) => {
    const updated = new Date(date * 1000).toString();
    const resDate = moment(updated).format('DD MMM YYYY');
    return resDate;
  };

  return (
    <>
      <TableCell padding="checkbox" className={classes.checkbox}>
        {comparisonState === false ? (
          <Checkbox
            checked={itemSelectionStatus}
            inputProps={{ 'aria-labelledby': labelIdentifier }}
          />
        ) : (
          <div />
        )}
      </TableCell>
      <TableCell className={classes.workflowName}>
        <Typography variant="body2">
          <u>
            <strong>{data.workflow_name}</strong>
          </u>
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" className={classes.tableObjects}>
          {formatDate(data.starting_date)}
        </Typography>
      </TableCell>
      <TableCell>
        <DateRangeOutlinedIcon className={classes.calIcon} />
        <Typography variant="body2" className={classes.tableObjectRegularity}>
          {data.regularity}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" className={classes.tableObjects}>
          {data.cluster_name}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" className={classes.tableObjects}>
          <strong>See analytics</strong>
          <IconButton
            edge="end"
            ref={profileMenuRef as any}
            aria-label="analytics for workflow id"
            aria-haspopup="true"
            onClick={() => setProfilePopoverOpen(true)}
            className={
              isProfilePopoverOpen
                ? classes.buttonPositionExpand
                : classes.buttonPositionClose
            }
          >
            <ExpandMoreTwoToneIcon htmlColor="black" />
          </IconButton>
        </Typography>
      </TableCell>
      <WorkflowAnalytics
        anchorEl={profileMenuRef.current as any}
        isOpen={isProfilePopoverOpen}
        onClose={() => setProfilePopoverOpen(false)}
        workflowID={data.workflow_id}
      />
    </>
  );
};
export default TableData;
