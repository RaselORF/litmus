import { Avatar, Button, Typography } from '@material-ui/core';
import { ButtonOutlined, InputField, Modal } from 'litmus-ui';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  validateEmail,
  validateStartEmptySpacing,
} from '../../../../../utils/validate';
import ChooseAvatarModal from '../ChooseAvatarModal';
import useStyles from './styles';

interface PersonalDetailsProps {
  handleNameChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  nameValue: string;
  handleUserChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  userValue: string;
  handleEmailChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  emailValue: string;
  usernameIsDisabled: boolean;
  nameIsDisabled: boolean;
  emailIsDisabled: boolean;
}

// Displays the personals details on the "accounts" tab
const UserDetails: React.FC<PersonalDetailsProps> = ({
  handleNameChange,
  nameValue,
  handleUserChange,
  userValue,
  handleEmailChange,
  emailValue,
  usernameIsDisabled,
  nameIsDisabled,
  emailIsDisabled,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);
  // avatar image source string
  const [avatar, setAvatar] = useState<string>('./avatars/default.svg');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Typography className={classes.headerText}>
        <strong>
          {t('settings.userManagementTab.createUser.userDetails.header')}
        </strong>
      </Typography>
      <form>
        <div className={classes.details}>
          <div className={classes.dp}>
            <Avatar
              data-cy="avatar"
              alt="User"
              className={classes.avatarBackground}
              src={avatar}
            />
            <Button className={classes.edit} onClick={handleOpen} disabled>
              {t('settings.userManagementTab.createUser.userDetails.button')}
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              modalActions={
                <ButtonOutlined onClick={handleClose}>&#x2715;</ButtonOutlined>
              }
            >
              <ChooseAvatarModal
                avatar={avatar}
                setAvatar={setAvatar}
                handleSubmit={handleClose}
              />
            </Modal>
          </div>
          {/* Fields for details including Full name, email, username */}
          <div className={classes.details1}>
            <div data-cy="InputName">
              <InputField
                required
                helperText={
                  validateStartEmptySpacing(nameValue)
                    ? 'Should not start with an empty space'
                    : ''
                }
                value={nameValue}
                disabled={nameIsDisabled}
                onChange={handleNameChange}
                variant={
                  validateStartEmptySpacing(nameValue) ? 'error' : 'primary'
                }
                label={t(
                  'settings.userManagementTab.createUser.userDetails.label.fullName'
                )}
              />
            </div>
            <div style={{ width: '2rem' }} />
            <div data-cy="InputEmail">
              <InputField
                required
                helperText={
                  validateEmail(emailValue) ? 'Should be a valid email' : ''
                }
                type="email"
                value={emailValue}
                disabled={emailIsDisabled}
                onChange={handleEmailChange}
                variant={validateEmail(emailValue) ? 'error' : 'primary'}
                label={t(
                  'settings.userManagementTab.createUser.userDetails.label.email'
                )}
              />
            </div>
            {/* Username is not editable by non admin user */}
            <div style={{ marginTop: '5rem' }} />
            <div data-cy="username">
              <InputField
                value={userValue}
                onChange={handleUserChange}
                disabled={usernameIsDisabled}
                variant="primary"
                label={t(
                  'settings.userManagementTab.createUser.userDetails.label.username'
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserDetails;
