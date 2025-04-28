import React from 'react'
import styled from 'styled-components/macro'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import { StyledIconButton, TWO_COL_MIN_WIDTH } from '../../../../utils/utils'
import { useAuth } from '../../../../context/AuthContext'
import PersonOutlineIcon from '@material-ui/icons/PersonOutline'
import { useHistory } from 'react-router-dom'

function AvatarIconButton({ setAnchorAvatarButton }) {
  const { currentUser, isLoggedIn } = useAuth();
  const history = useHistory();

  const handleSignInClick = (event) => {
    if (!isLoggedIn) {
      history.push('/login');
    } else {
      setAnchorAvatarButton(event.currentTarget);
    }
  };

  // Get the first letter of the username for avatar
  const getAvatarContent = () => {
    if (!isLoggedIn) {
      return <PersonOutlineIcon />;
    }

    if (currentUser && currentUser.username) {
      return currentUser.username.charAt(0).toUpperCase();
    }

    return 'U'; // Default if no username
  };

  // If not logged in, show sign in button
  if (!isLoggedIn) {
    return (
      <SignInButtonContainer>
        <SignInButton
          variant="outlined"
          startIcon={<PersonOutlineIcon />}
          onClick={() => history.push('/login')}
        >
          Sign in
        </SignInButton>
      </SignInButtonContainer>
    );
  }

  // If logged in, show avatar button
  return (
    <StyledIconButton onClick={handleSignInClick}>
      <StyledAvatar>
        {getAvatarContent()}
      </StyledAvatar>
    </StyledIconButton>
  )
}

export default AvatarIconButton

const SignInButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SignInButton = styled(Button)`
  && {
    border: 1px solid #3ea6ff;
    color: #3ea6ff;
    border-radius: 2px;
    text-transform: none;
    padding: 5px 11px;
    font-size: 14px;
    font-weight: 500;
    
    &:hover {
      background-color: rgba(62, 166, 255, 0.1);
    }
    
    .MuiButton-startIcon {
      margin-right: 6px;
    }
    
    .MuiSvgIcon-root {
      font-size: 20px;
    }
  }
`;

const StyledAvatar = styled(Avatar)`
  && {
    width: 32px;
    height: 32px;
    font-size: 0.875rem;
    background-color: #ef6c00;
    color: white;
    
    @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
      width: 32px;
      height: 32px;
    }
  }
`
