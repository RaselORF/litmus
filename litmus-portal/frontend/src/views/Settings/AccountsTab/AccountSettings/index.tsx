import { Divider, Typography } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import ButtonFilled from '../../../../components/Button/ButtonFilled';
import InputField from '../../../../components/InputField';
import config from '../../../../config';
import Unimodal from '../../../../containers/layouts/Unimodal';
import getToken from '../../../../utils/getToken';
import {
  validateConfirmPassword,
  validateStartEmptySpacing,
} from '../../../../utils/validate';
import PersonalDetails from '../PersonalDetails';
import useStyles from './styles';

// used for password field
interface Password {
  currPassword: string;
  newPassword: string;
  confNewPassword: string;
}

// AccountSettings displays the starting page of "Accounts" tab
const AccountSettings: React.FC = () => {
  const classes = useStyles();

  // used for modal
  const [open, setOpen] = React.useState(false);
  const isSuccess = useRef<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  // states for the three password fields
  const [password, setPassword] = React.useState<Password>({
    newPassword: '',
    currPassword: '',
    confNewPassword: '',
  });

  // handleCurrPassword handles password for first password field
  const handleCurrPassword = (prop: keyof Password) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword({
      ...password,
      [prop]: event.target.value,
    });
  };

  // handleNewPassword handles password for second password field
  const handleNewPassword = (prop: keyof Password) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword({
      ...password,
      [prop]: event.target.value,
    });
  };

  // handleConfPassword handles password for third password field
  const handleConfPassword = (prop: keyof Password) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword({
      ...password,
      [prop]: event.target.value,
    });
  };

  if (
    password.confNewPassword.length > 0 &&
    password.newPassword === password.confNewPassword
  )
    isSuccess.current = true;
  else isSuccess.current = false;
  const [error, setError] = useState<string>('');
  const handleChangePassword = () => {
    fetch(`${config.auth.url}/update/password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        old_password: password.currPassword,
        new_password: password.newPassword,
      }),
    })
      .then((response) => {
        if (response.status !== 200) {
          setError('Current password is wrong');
          console.error('Current password is wrong');
        } else {
          setError('');
        }
        setOpen(true);
      })
      .catch((err) => {
        console.error('current password is wrong', err);
      });
  };

  return (
    <div className={classes.container}>
      <div>
        <div className={classes.suSegments}>
          {/* Below component renders the upper section of the page, displays personal details */}
          <PersonalDetails />
          <Divider className={classes.divider} />

          {/* Displays the lower segment containing the password details */}
          <Typography className={classes.headerText}>
            <strong>Password</strong>
          </Typography>
          <div className={classes.outerPass}>
            <form className={classes.innerPass}>
              {/* Current Password */}
              <InputField
                required
                value={password.currPassword}
                handleChange={handleCurrPassword('currPassword')}
                type="password"
                label="Current Password"
                validationError={false}
              />

              {/* New Password */}
              <InputField
                required
                type="password"
                handleChange={handleNewPassword('newPassword')}
                success={isSuccess.current}
                helperText={
                  validateStartEmptySpacing(password.newPassword)
                    ? 'Should not start with empty space'
                    : ''
                }
                label="New Password"
                validationError={validateStartEmptySpacing(
                  password.newPassword
                )}
                value={password.newPassword}
              />

              {/* Confirm new password */}
              <InputField
                helperText={
                  validateConfirmPassword(
                    password.newPassword,
                    password.confNewPassword
                  )
                    ? 'Password is not same'
                    : ''
                }
                required
                type="password"
                handleChange={handleConfPassword('confNewPassword')}
                success={isSuccess.current}
                label="Confirm Password"
                validationError={validateConfirmPassword(
                  password.newPassword,
                  password.confNewPassword
                )}
                value={password.confNewPassword}
              />
              <div className={classes.buttonModal}>
                <ButtonFilled
                  data-cy="button"
                  isPrimary
                  isDisabled={
                    !(isSuccess.current && password.currPassword.length > 0)
                  }
                  handleClick={handleChangePassword}
                >
                  <> Change password</>
                </ButtonFilled>
              </div>

              <Unimodal
                isOpen={open}
                handleClose={handleClose}
                hasCloseBtn={false}
              >
                {error.length ? (
                  <div className={classes.errDiv}>
                    <div className={classes.textError}>
                      <Typography className={classes.typo} align="center">
                        <strong> Error </strong> while creating a new user.
                      </Typography>
                    </div>
                    <div className={classes.textSecondError}>
                      <Typography className={classes.typoSub}>
                        Error: {error}
                      </Typography>
                    </div>
                    <div className={classes.buttonModal}>
                      <ButtonFilled
                        isPrimary
                        isDisabled={false}
                        handleClick={handleClose}
                      >
                        <>Done</>
                      </ButtonFilled>
                    </div>
                  </div>
                ) : (
                  <div className={classes.body}>
                    <img src="./icons/lock.svg" alt="lock" />
                    <div className={classes.text}>
                      <Typography className={classes.typo} align="center">
                        Your password <strong>has been changed!</strong>
                      </Typography>
                    </div>
                    <div className={classes.text1}>
                      <Typography className={classes.typo1}>
                        You can now use your new password to login to your
                        account
                      </Typography>
                    </div>
                    <div className={classes.buttonModal}>
                      <ButtonFilled
                        isPrimary
                        isDisabled={false}
                        handleClick={handleClose}
                      >
                        <>Done</>
                      </ButtonFilled>
                    </div>
                  </div>
                )}
              </Unimodal>
            </form>

            <div className={classes.col2}>
              <img src="./icons/pass.svg" data-cy="lock" alt="lockIcon" />
              {/*  <Typography className={classes.txt1}>
                Your new password <strong>must</strong> be:
              </Typography>
              <Typography className={classes.txt2}>
                1. Be at least 8 characters in length
              </Typography>
              <Typography className={classes.txt2}>
                2. Not be same as your current password
              </Typography>
              <Typography className={classes.txt2}>
                3. Be a combination of letters, numbers and special characters
              </Typography> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AccountSettings;
