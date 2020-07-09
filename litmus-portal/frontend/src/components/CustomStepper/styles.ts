import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  content: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

export default useStyles;
