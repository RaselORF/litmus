import { makeStyles } from '@material-ui/core/styles';

// Community Component Styling
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    fontFamily: 'Ubuntu',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  mainHeader: {
    color: theme.palette.text.primary,
    fontSize: '2rem',
    marginBottom: theme.spacing(6),
  },
  LitmusAnalyticsBlock: {
    margin: '1rem 0',
  },
  LitmusAnalyticsDiv: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '0.2rem 0',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  header2: {
    fontSize: '1.5rem',
    padding: '1rem 0',
  },
  cardDiv: {
    display: 'flex',
    flexDirection: 'row',
    padding: '2rem 0',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      marginLeft: theme.spacing(8),
    },
  },
  paper: {
    padding: theme.spacing(20),
    width: theme.spacing(80),
    height: theme.spacing(42.5),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      width: theme.spacing(50),
      flexDirection: 'column',
    },
  },
  card: {
    backgroundColor: theme.palette.secondary.dark,
    height: theme.spacing(42.5),
    width: theme.spacing(35),
    textAlign: 'center',
    color: '#FFFFFF',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      marginTop: theme.spacing(2),
      width: theme.spacing(50),
      flexDirection: 'column',
    },
  },
  cardContent: {
    marginTop: theme.spacing(4),
  },
  LitmusOnDev: {
    marginTop: theme.spacing(2),
    fontWeight: 'bold',
    fontSize: '2rem',
  },
  LitmusOnDevSpan: {
    position: 'relative',
    fontWeight: 'normal',
    fontSize: '2rem',
    bottom: theme.spacing(2),
    left: theme.spacing(3),
  },
  devToLogo: {
    fill: 'white',
    filter:
      'invert(98%) sepia(100%) saturate(0%) hue-rotate(86deg) brightness(118%) contrast(119%)',
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
    width: theme.spacing(10),
    height: theme.spacing(6),
  },
  followBtn: {
    width: theme.spacing(20),
    height: theme.spacing(6),
    backgroundColor: '#FFFFFF',
    fontSize: '0.8rem',
    color: theme.palette.text.primary,
    textTransform: 'none',
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(15),
    },
  },
  LitmusUsedBlock: {
    margin: '2rem 0',
  },
  LitmusUsedDiv: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '0.2rem 0',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  quickActionCard: {
    height: theme.spacing(42.5),
    width: theme.spacing(40),
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      width: theme.spacing(30),
      flexDirection: 'column',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      marginTop: theme.spacing(5),
      width: theme.spacing(50),
      flexDirection: 'column',
    },
  },
}));

export default useStyles;
