import { IconButton, TableCell, Tooltip, Typography } from '@material-ui/core';
import { ButtonFilled, ButtonOutlined } from 'litmus-ui';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Unimodal from '../../../containers/layouts/Unimodal';
import { Cluster } from '../../../models/graphql/clusterData';
import { history } from '../../../redux/configureStore';
import { RootState } from '../../../redux/reducers';
import timeDifferenceForDate from '../../../utils/datesModifier';
import useStyles from './styles';

interface TableDataProps {
  data: Cluster;
  deleteRow: (clid: string) => void;
}

const TableData: React.FC<TableDataProps> = ({ data, deleteRow }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  // Function to convert UNIX time in format of DD MMM YYY
  const formatDate = (date: string) => {
    const updated = new Date(parseInt(date, 10) * 1000).toString();
    const resDate = moment(updated).format('DD MMM YYYY');
    if (date) return resDate;
    return 'Date not available';
  };

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };
  const userRole = useSelector((state: RootState) => state.userData.userRole);

  const handleClose = () => {
    deleteRow(data.cluster_id);
    setOpen(false);
  };

  return (
    <>
      <TableCell className={classes.tableDataStatus}>
        {data.is_cluster_confirmed === false ? (
          <Typography className={`${classes.check} ${classes.pending}`}>
            {t('workflowCluster.header.formControl.menu6')}
          </Typography>
        ) : data.is_cluster_confirmed === true && data.is_active ? (
          <Typography className={`${classes.check} ${classes.active}`}>
            {t('workflowCluster.header.formControl.menu1')}
          </Typography>
        ) : (
          <Typography className={`${classes.check} ${classes.notactive}`}>
            {t('workflowCluster.header.formControl.menu2')}
          </Typography>
        )}
      </TableCell>
      <TableCell
        key={data.cluster_id}
        onClick={() => {
          history.push({ pathname: '/targets/cluster', state: { data } });
        }}
        className={classes.workflowNameData}
      >
        <IconButton size="small">
          <Typography>{data.cluster_name}</Typography>
        </IconButton>
      </TableCell>
      <TableCell className={classes.stepsDataTime}>
        {formatDate(data.updated_at)}
      </TableCell>
      <TableCell>
        <Typography className={classes.stepsData}>
          {data.no_of_schedules}
        </Typography>
      </TableCell>
      <TableCell className={classes.stepsDataschedule}>
        <Typography>{data.no_of_workflows}</Typography>
      </TableCell>
      <TableCell>{timeDifferenceForDate(data.updated_at)}</TableCell>
      <TableCell>
        <Tooltip
          classes={{
            tooltip: classes.customTooltip,
          }}
          disableFocusListener
          disableHoverListener={userRole !== 'Viewer'}
          placement="bottom"
          title="Insufficient Permissions"
        >
          <div className={classes.deleteCluster}>
            <div>
              <IconButton
                disabled={userRole === 'Viewer'}
                onClick={handleClick}
              >
                <img alt="delete" src="./icons/bin-red.svg" />
              </IconButton>
            </div>
            <div>
              <Typography>{t('targets.modalDelete.delete')}</Typography>
            </div>
          </div>
        </Tooltip>
        <div>
          {open ? (
            <div>
              <Unimodal
                open={open}
                handleClose={() => {
                  setOpen(false);
                }}
                hasCloseBtn
              >
                <div className={classes.body}>
                  <img src="/icons/bin-red-delete.svg" alt="Delete" />
                  <div className={classes.text}>
                    <Typography className={classes.typo} align="center">
                      {t('targets.modalDelete.head1')} <br />
                      <strong> {t('targets.modalDelete.head2')}</strong>
                    </Typography>
                  </div>
                  <div className={classes.textSecond}>
                    <Typography className={classes.typoSub} align="center">
                      {t('targets.modalDelete.head3')}
                    </Typography>
                  </div>
                  <div className={classes.buttonGroup}>
                    <ButtonOutlined
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <> {t('targets.modalDelete.no')}</>
                    </ButtonOutlined>

                    <ButtonFilled
                      disabled={userRole === 'Viewer'}
                      variant="error"
                      onClick={handleClose}
                      className={classes.w7}
                    >
                      <>{t('targets.modalDelete.yes')}</>
                    </ButtonFilled>
                  </div>
                </div>
              </Unimodal>
            </div>
          ) : null}
        </div>
      </TableCell>
    </>
  );
};
export default TableData;
