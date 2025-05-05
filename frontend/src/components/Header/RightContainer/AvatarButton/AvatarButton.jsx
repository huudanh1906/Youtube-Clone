import React, { useState, useEffect } from 'react'
import AvatarIconButton from './AvatarIconButton'
import AvatarMenu from './AvatarMenu'
import { useAuth } from '../../../../context/AuthContext'

const AvatarButton = () => {
  const [anchorAvatarButton, setAnchorAvatarButton] = useState(null)
  const auth = useAuth();
  const { isLoggedIn, currentUser } = auth;

  useEffect(() => {
    console.log("Auth state in AvatarButton:", { isLoggedIn, currentUser });
  }, [isLoggedIn, currentUser]);

  const handleAvatarMenuClose = () => {
    setAnchorAvatarButton(null)
  }

  return (
    <>
      <AvatarIconButton {...{ setAnchorAvatarButton }} />
      {isLoggedIn && <AvatarMenu {...{ anchorAvatarButton, handleAvatarMenuClose }} />}
    </>
  )
}

export default AvatarButton
