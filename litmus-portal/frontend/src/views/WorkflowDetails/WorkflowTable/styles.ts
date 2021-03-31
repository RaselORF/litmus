import {
  createStyles,
  makeStyles,
  TableCell,
  Theme,
  withStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },

  // Table and Table Data Properties
  tableMain: {
    backgroundColor: theme.palette.cards.background,
    border: `1px solid ${theme.palette.cards.background}`,
    '&::-webkit-scrollbar': {
      width: '0.2em',
    },
    '&::-webkit-scrollbar-track': {
      webkitBoxShadow: `inset 0 0 6px ${theme.palette.common.black}`,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.secondary.dark,
    },
    '&:not(:last-child)': {
      borderBottom: 0,
    },
  },

  tableHead: {
    height: '4.6875rem',
    '& p': {
      fontSize: '1rem',
      fontWeight: 'bold',
      color: theme.palette.text.primary,
      opacity: 0.6,
    },
    '& th': {
      backgroundColor: theme.palette.cards.background,
      color: theme.palette.text.secondary,
    },
  },

  tableRows: {
    padding: theme.spacing(4),
    color: theme.palette.text.hint,
    height: '4.6875rem',
  },

  tableCellWidth: {
    maxWidth: '16.625rem',
  },

  // Table Cell Buttons
  applicationDetails: {
    display: 'flex',
  },

  viewLogs: {
    marginLeft: theme.spacing(1),
    color: theme.palette.highlight,
  },

  arrowMargin: {
    marginLeft: theme.spacing(1),
  },

  // Pagination
  pagination: {
    marginTop: theme.spacing(-0.25),
    borderTop: `1px solid ${theme.palette.border.main}`,
    width: '100%',
  },

  disabledText: {
    color: theme.palette.text.disabled,
  },

  popover: {
    display: 'flex',
    flexDirection: 'column',
    height: '5rem',
    padding: theme.spacing(0, 1, 0, 1),
  },

  popoverItems: {
    textAlign: 'left',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
}));

export default useStyles;

export const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    root: {
      borderBottom: `1px solid ${theme.palette.border.main}`,
    },
  })
)(TableCell);
