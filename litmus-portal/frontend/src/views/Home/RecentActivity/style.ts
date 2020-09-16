import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  // Styles for RecentActivity.
  tabContainer: {
    overflowY: 'auto',
    height: '14rem',
    '&::-webkit-scrollbar': {
      width: '0.2em',
    },
    '&::-webkit-scrollbar-track': {
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.secondary.dark,
      outline: '1px solid slategrey',
    },
  },

  // Styles for RecentActivityListItem
  messageID: {
    color: theme.palette.text.disabled,
  },
}));

export default useStyles;
