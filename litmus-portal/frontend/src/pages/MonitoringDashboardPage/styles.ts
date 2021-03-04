import { makeStyles } from '@material-ui/core/styles';

// Component styles
const useStyles = makeStyles((theme) => ({
  rootContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflowX: 'hidden',
  },

  root: {
    marginTop: theme.spacing(5),
    marginLeft: theme.spacing(6),
    marginBottom: theme.spacing(8),
  },

  headerDiv: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    minHeight: '5rem',
  },

  dashboardType: {
    marginLeft: theme.spacing(5),
    marginTop: theme.spacing(3),
    fontSize: '1.5rem',
  },

  loaderText: {
    textAlign: 'center',
    marginBottom: '3%',
  },

  analyticsDiv: {
    marginTop: theme.spacing(5),
    backgroundColor: theme.palette.background.paper,
    minHeight: '26rem',
  },

  button: {
    marginBottom: theme.spacing(3),
    marginLeft: theme.spacing(-2),
  },

  iconButton: {
    height: '3rem',
    width: '3rem',
    marginLeft: theme.spacing(3),
  },

  dashboardSwitchIcon: {
    height: '2rem',
    width: '2rem',
  },

  weightedFont: {
    fontWeight: 500,
  },

  // Menu option
  menuItem: {
    '&:hover': {
      background: theme.palette.secondary.dark,
    },
    minWidth: '10rem',
    height: '2.5rem',
  },

  expDiv: {
    display: 'flex',
    flexDirection: 'row',
  },

  btnText: {
    fontWeight: 500,
  },

  icon: {
    width: '6rem',
    height: '6rem',
  },

  modalHeading: {
    marginTop: theme.spacing(3.5),
    fontSize: '2.25rem',
    marginBottom: theme.spacing(4.5),
  },

  modalBody: {
    marginBottom: theme.spacing(4.5),
  },

  flexButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  loader: {
    padding: '22%',
  },
}));

export default useStyles;
