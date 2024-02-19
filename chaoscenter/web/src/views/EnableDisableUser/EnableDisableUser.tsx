import React, { useState } from 'react';
import { Button, ButtonVariation, Layout, OverlaySpinner, Text } from '@harnessio/uicore';
import { Icon } from '@harnessio/icons';
import { FontVariation } from '@harnessio/design-system';
import type { UseMutateFunction } from '@tanstack/react-query';
import { useStrings } from '@strings';
import type { UpdateStateOkResponse, UpdateStateMutationProps } from '@api/auth';

interface EnableDisableUserViewProps {
  handleClose: () => void;
  currentState: boolean | undefined;
  username: string | undefined;
  updateStateMutation: UseMutateFunction<UpdateStateOkResponse, unknown, UpdateStateMutationProps<never>, unknown>;
}

export default function EnableDisableUserView(props: EnableDisableUserViewProps): React.ReactElement {
  const { handleClose, username, currentState, updateStateMutation } = props;
  const { getString } = useStrings();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleMutation = () => {
    setIsLoading(true);
    updateStateMutation(
      {
        body: {
          username: username ?? '',
          isDeactivate: !currentState
        }
      },
      {
        onSuccess: () => {
          setIsLoading(false);
          handleClose();
        }
      }
    )
  }

  return (
    <OverlaySpinner show={isLoading}>
    <Layout.Vertical padding="medium" style={{ gap: '1rem' }}>
      <Layout.Horizontal flex={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Text font={{ variation: FontVariation.H4 }}>
          {!currentState ? getString('disableUser') : getString('enableUser')}
        </Text>
        <Icon name="cross" style={{ cursor: 'pointer' }} size={18} onClick={() => handleClose()} />
      </Layout.Horizontal>
      <Text font={{ variation: FontVariation.BODY }}>
        {!currentState ? getString('disableUserDescription') : getString('enableUserDescription')}
      </Text>
      <Layout.Horizontal style={{ gap: '1rem' }}>
        <Button
          type="submit"
          variation={ButtonVariation.PRIMARY}
          intent={!currentState ? 'danger' : 'primary'}
          text={getString('confirm')}
          onClick={handleMutation}
        />
        <Button variation={ButtonVariation.TERTIARY} text={getString('cancel')} onClick={() => handleClose()} />
      </Layout.Horizontal>
    </Layout.Vertical>
    </OverlaySpinner>
  );
}
