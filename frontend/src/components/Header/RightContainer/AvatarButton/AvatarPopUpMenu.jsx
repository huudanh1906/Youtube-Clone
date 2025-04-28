import React from 'react'
import styled from 'styled-components/macro'
import Popover from '@material-ui/core/Popover'
import Divider from '@material-ui/core/Divider'
import { AvatarAccountInfo } from './AvatarAccountInfo'
import { AvatarMenuTop } from './AvatarMenuTop'
import { AvatarMenuMiddle } from './AvatarMenuMiddle'
import { AvatarMenuBottom } from './AvatarMenuBottom'
import { useAuth } from '../../../../context/AuthContext'

export function AvatarPopUpMenu({ anchorAvatarButton, handleAvatarMenuClose }) {
  const { isLoggedIn, currentUser } = useAuth();

  return (
    <StyledAvatarMenu
      anchorEl={anchorAvatarButton}
      open={Boolean(anchorAvatarButton)}
      onClose={handleAvatarMenuClose}
    >
      {isLoggedIn ? (
        <>
          <AvatarAccountInfo onClick={handleAvatarMenuClose} user={currentUser} />
          <Divider />
          <AvatarMenuTop onClick={handleAvatarMenuClose} />
          <Divider />
          <AvatarMenuMiddle onClick={handleAvatarMenuClose} />
          <Divider />
          <AvatarMenuBottom onClick={handleAvatarMenuClose} />
        </>
      ) : (
        <>
          <AvatarMenuTop onClick={handleAvatarMenuClose} isUnauthenticated={true} />
          <Divider />
          <AvatarMenuBottom onClick={handleAvatarMenuClose} />
        </>
      )}
    </StyledAvatarMenu>
  )
}
const StyledAvatarMenu = styled(({ className, ...props }) => (
  <Popover
    {...props}
    classes={{ paper: className }}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    marginThreshold={0}
    transitionDuration={0}
    getContentAnchorEl={null}
    PaperProps={{ square: true }}
    elevation={0}
  />
))`
  border: 1px solid #d3d4d5;
  border-top: 0;
  border-radius: 0;
  // not sure how to set the height to avoid Popover snapping to the top of window when the screen size is small
  width: 300px;
  opacity: 0.5;

  .MuiTypography-body1 {
    font-size: 14px;
  }
`
