import { Typography, TextField, Hidden, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import useStyles from './styles';

interface authData {
  username: string;
  password: string;
}

const LoginPage = () => {
  const classes = useStyles();
  const [authData, setAuthData] = useState<authData>({
    username: '',
    password: '',
  });

  const handleForm = () => {
    const formData: HTMLFormElement | null = document.querySelector(
      '#login-form'
    );
    const data = new FormData(formData as HTMLFormElement);
    const username = data.get('username') as string;
    const password = data.get('password') as string;
    data.append('username', username);
    data.append('password', password);
    fetch('/login', {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.text();
    });
  };

  return (
    <div className={classes.rootContainer}>
      <div className={classes.root}>
        <div className={classes.rootDiv}>
          <div className={classes.mainDiv}>
            <img src="icons/LitmusLogo.png" alt="litmus logo" />
            <Typography variant="h2" className={classes.heading}>
              Welcome to <strong>Litmus!</strong>
            </Typography>
            <Typography className={classes.description}>
              {' '}
              Your one-stop-shop for Chaos Engineering on{' '}
              <img
                src="icons/kubernetes.png"
                alt="Kubernetes"
                className={classes.descImg}
              />{' '}
              . Browse, create, manage monitor and analyze your chaos workflows.
              With your own private ChaosHub, you can create your new chaos
              experiments and share them with your team.
            </Typography>
            <form
              id="login-form"
              className={classes.root}
              autoComplete="on"
              onSubmit={(event) => {
                event.preventDefault();
                handleForm();
              }}
            >
              <div className={classes.inputDiv}>
                <TextField
                  label="Username"
                  name="username"
                  value={authData.username}
                  InputProps={{ disableUnderline: true }}
                  data-cy="inputEmail"
                  required
                  className={classes.inputArea}
                  onChange={(e) =>
                    setAuthData({
                      username: e.target.value,
                      password: authData.password,
                    })
                  }
                />
                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  required
                  className={classes.inputArea}
                  value={authData.password}
                  autoComplete="current-password"
                  InputProps={{ disableUnderline: true }}
                  data-cy="inputPassword"
                  onChange={(e) =>
                    setAuthData({
                      username: authData.username,
                      password: e.target.value,
                    })
                  }
                />
                <Typography className={classes.forgotPasssword}>
                  <Link
                    to="/reset"
                    className={classes.linkForgotPass}
                    data-cy="forgotPassword"
                  >
                    Don’t remember your password?
                  </Link>
                </Typography>
                <div className={classes.loginDiv}>
                  <Button
                    type="submit"
                    className={classes.submitButton}
                    data-cy="loginButton"
                  >
                    Login
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <Hidden mdDown>
          <div className={classes.imageDiv}>
            <img src="/icons/LoginScreen.png" alt="Login screen" />
          </div>
        </Hidden>
      </div>
    </div>
  );
};

export default LoginPage;
