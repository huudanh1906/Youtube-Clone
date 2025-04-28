import React, { useState } from 'react'
import AvatarIconButton from './AvatarIconButton'
import AvatarMenu from './AvatarMenu'
import { useAuth } from '../../../../context/AuthContext'

const AvatarButton = () => {
  const [anchorAvatarButton, setAnchorAvatarButton] = useState(null)
  const { isLoggedIn } = useAuth();

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
