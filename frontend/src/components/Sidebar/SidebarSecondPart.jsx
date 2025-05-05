import React, { useState, useEffect } from 'react'
import styled from 'styled-components/macro'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import { ShowMoreRow } from './ShowMoreRow'
import { ShowLessRow } from './ShowLessRow'
import { SubHeading, SidebarMenuItem } from './FullWidthSidebar'
import { isSidebarDrawerOpenAtom } from '../../store'
import { useAtom } from 'jotai'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

export const SidebarSecondPart = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const { currentUser, isLoggedIn } = useAuth()

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!isLoggedIn || !currentUser) {
        setLoading(false)
        return
      }

      try {
        const token = currentUser.token || currentUser.accessToken
        if (!token) {
          console.error('No authentication token available')
          setLoading(false)
          return
        }

        const response = await axios.get('http://localhost:8080/api/subscriptions/my-subscriptions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setSubscriptions(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching subscriptions:', error)
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [currentUser, isLoggedIn])

  const expandMenu = () => {
    setIsExpanded(true)
  }

  const collapseMenu = () => {
    setIsExpanded(false)
  }

  const visibleSubscriptions = isExpanded ? subscriptions : subscriptions.slice(0, 3)

  if (loading) {
    return (
      <>
        <SubHeading>SUBSCRIPTIONS</SubHeading>
        <LoadingContainer>
          <CircularProgress size={20} />
        </LoadingContainer>
      </>
    )
  }

  if (!isLoggedIn) {
    return (
      <>
        <SubHeading>SUBSCRIPTIONS</SubHeading>
        <SignInContainer>
          <Typography variant="body2">Sign in to see your subscriptions</Typography>
        </SignInContainer>
      </>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <>
        <SubHeading>SUBSCRIPTIONS</SubHeading>
        <EmptyContainer>
          <Typography variant="body2">No subscriptions yet</Typography>
        </EmptyContainer>
      </>
    )
  }

  return (
    <>
      <SubHeading>SUBSCRIPTIONS</SubHeading>
      {visibleSubscriptions.map((subscription) => (
        <SubscriptionItem key={subscription.id} subscription={subscription} />
      ))}
      {subscriptions.length > 3 && (
        isExpanded ? (
          <ShowLessRow onClick={collapseMenu} />
        ) : (
          <ShowMoreRow onClick={expandMenu} />
        )
      )}
    </>
  )
}

const SubscriptionItem = ({ subscription }) => {
  const [, setIsSidebarDrawerOpen] = useAtom(isSidebarDrawerOpenAtom)
  const history = useHistory()

  const handleClick = () => {
    setIsSidebarDrawerOpen(false)
    history.push(`/channel/${subscription.channelId}`)
  }

  // Lấy chữ cái đầu tiên của tên kênh để hiển thị trong avatar nếu không có thumbnail
  const firstLetter = subscription.channelTitle ? subscription.channelTitle.charAt(0).toUpperCase() : 'C'

  return (
    <SidebarMenuItem onClick={handleClick}>
      <StyledListItemAvatar>
        {subscription.channelThumbnailUrl ? (
          <StyledAvatar src={subscription.channelThumbnailUrl} alt={subscription.channelTitle} />
        ) : (
          <StyledAvatar>{firstLetter}</StyledAvatar>
        )}
      </StyledListItemAvatar>
      <ListItemText
        primary={subscription.channelTitle}
        primaryTypographyProps={{
          noWrap: true,
          style: { textOverflow: 'ellipsis', overflow: 'hidden' }
        }}
      />
    </SidebarMenuItem>
  )
}

const StyledListItemAvatar = styled(ListItemAvatar)`
  && {
    min-width: 0;
    margin-right: 24px;
  }
`

const StyledAvatar = styled(Avatar)`
  && {
    width: 24px;
    height: 24px;
    font-size: 0.75rem;
    background-color: #ef6c00;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px;
`

const EmptyContainer = styled.div`
  padding: 16px;
  text-align: center;
  color: rgba(0, 0, 0, 0.6);
`

const SignInContainer = styled.div`
  padding: 16px;
  text-align: center;
  color: rgba(0, 0, 0, 0.6);
`
