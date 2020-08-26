import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import SearchIcon from '@material-ui/icons/Search';
import {
  InputBase,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from '@material-ui/core';
import useStyles from './styles';
import { WORKFLOW_DETAILS } from '../../../../graphql';
import TableData from './TableData';
import { Workflow, WorkflowDataVars } from '../../../../models/workflowData';
import Loader from '../../../Loader';

interface FilterOption {
  search: string;
  cluster: string;
}

interface PaginationData {
  pageNo: number;
  rowsPerPage: number;
}

const ScheduleWorkflow = () => {
  const classes = useStyles();

  // Apollo query to get the scheduled data
  const { data, loading, error } = useQuery<Workflow, WorkflowDataVars>(
    WORKFLOW_DETAILS,
    { variables: { projectID: '00000' } }
  );

  // State for search and filtering
  const [filter, setFilter] = React.useState<FilterOption>({
    search: '',
    cluster: 'All',
  });

  // State for pagination
  const [paginationData, setPaginationData] = useState<PaginationData>({
    pageNo: 0,
    rowsPerPage: 5,
  });

  const filteredData = data?.getWorkFlowRuns.filter((dataRow) =>
    filter.cluster === 'All'
      ? true
      : dataRow.cluster_name.toLowerCase().includes(filter.cluster)
  );

  return (
    <div>
      <section className="Heading section">
        <div className={classes.headerSection}>
          <InputBase
            id="input-with-icon-adornment"
            placeholder="Search"
            className={classes.search}
            value={filter.search}
            onChange={(event) =>
              setFilter({ ...filter, search: event.target.value as string })
            }
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
          />
          <FormControl className={classes.select1}>
            <InputLabel id="demo-simple-select-outlined-label">
              Target Cluster
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={filter.cluster}
              onChange={(event) =>
                setFilter({ ...filter, cluster: event.target.value as string })
              }
              disableUnderline
            >
              <MenuItem value="All">
                <Typography className={classes.menuItem}>All</Typography>
              </MenuItem>
              <MenuItem value="Predefined">
                <Typography className={classes.menuItem}>
                  Cluset pre-defined
                </Typography>
              </MenuItem>
              <MenuItem value="Kubernetes">
                <Typography className={classes.menuItem}>
                  Kubernetes Cluster
                </Typography>
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      </section>
      <section className="table section">
        <TableContainer className={classes.tableMain}>
          <Table stickyHeader aria-label="simple table">
            <TableHead>
              <TableRow className={classes.tableHead}>
                <TableCell className={classes.workflowName}>
                  <Typography style={{ paddingLeft: 25 }}>
                    Workflow Name
                  </Typography>
                </TableCell>
                <TableCell className={classes.headerStatus}>
                  Starting Date
                </TableCell>
                <TableCell>
                  <Typography className={classes.targetCluster}>
                    Regularity
                  </Typography>
                </TableCell>
                <TableCell style={{ width: 200 }}>Cluster</TableCell>
                <TableCell>Show Experiments</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Loader />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography align="center">Unable to fetch data</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredData && filteredData.length ? (
                filteredData
                  .slice(
                    paginationData.pageNo * paginationData.rowsPerPage,
                    paginationData.pageNo * paginationData.rowsPerPage +
                      paginationData.rowsPerPage
                  )
                  .map((data: any) => (
                    <TableRow>
                      <TableData data={data} />
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography align="center">No records available</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data?.getWorkFlowRuns.length ?? 0}
          rowsPerPage={paginationData.rowsPerPage}
          page={paginationData.pageNo}
          onChangePage={(_, page) =>
            setPaginationData({ ...paginationData, pageNo: page })
          }
          onChangeRowsPerPage={(event) => {
            const newRowsPerPage = parseInt(event.target.value, 10);
            const rowsPerPage =
              newRowsPerPage < (data?.getWorkFlowRuns.length ?? 0)
                ? newRowsPerPage
                : 5;

            setPaginationData({
              ...paginationData,
              pageNo: 0,
              rowsPerPage,
            });
          }}
        />
      </section>
    </div>
  );
};

export default ScheduleWorkflow;
