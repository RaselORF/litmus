import Button from '@material-ui/core/Button';
import React from 'react';
import useStyles from './styles';

interface ButtonFilledProps {
  handleClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  isPrimary: boolean;
  isDisabled?: boolean;
  isWarning?: boolean;
  styles?: Object;
  type?: any;
}
const ButtonFilled: React.FC<ButtonFilledProps> = ({
  handleClick,
  children,
  isPrimary,
  isDisabled,
  isWarning,
  styles,
  type,
}) => {
  const classes = useStyles();
  return (
    <Button
      style={styles}
      variant="contained"
      size="medium"
      disabled={isDisabled}
      type={type}
      onClick={handleClick}
      className={
        isWarning
          ? `${classes.button} ${classes.buttonWarning}`
          : isPrimary
          ? `${classes.button} ${classes.buttonPrimary}`
          : `${classes.button} ${classes.buttonSecondary}`
      }
    >
      {children}
    </Button>
  );
};

export default ButtonFilled;
