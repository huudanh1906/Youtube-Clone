import React from 'react'
import he from 'he'
import moment from 'moment'
import numeral from 'numeral'
import { useHistory } from 'react-router-dom'
import { MoreButton } from '../Videos/MoreButton'
import { DotSeparator } from '../Videos/ChannelDetails'
import {
  ContentContainer,
  VideoContentTop,
  SearchVideoTitle,
  StatsContainer,
  ContentText,
  AvatarContainer,
  StyledAvatar,
  DescriptionsContainer,
} from './searchUtils'
import styled from 'styled-components/macro'

// desktop view can't use MUI CardHeader because position of elements inside CardHeader can't be changed.
export const DesktopVideoContent = ({
  title,
  viewCount,
  publishedAt,
  channelAvatar,
  channelTitle,
  description,
  channelId,
}) => {
  return (
    <ContentContainer>
      <Title title={title} />
      <Stats {...{ viewCount, publishedAt }} />
      <Avatar {...{ channelAvatar, channelTitle, channelId }} />
      <Descriptions description={description} />
    </ContentContainer>
  )
}

const Title = ({ title }) => {
  return (
    <VideoContentTop>
      <SearchVideoTitle variant="h3">{he.decode(title)}</SearchVideoTitle>
      <MoreButton isSearchPage={true} />
    </VideoContentTop>
  )
}

const Stats = ({ viewCount, publishedAt }) => {
  return (
    <StatsContainer>
      <ContentText variant="body2">
        <span style={{ marginRight: '4px' }}>
          {numeral(viewCount).format('0.a')} views
        </span>
        <DotSeparator /> <span>{moment(publishedAt).fromNow()}</span>
      </ContentText>
    </StatsContainer>
  )
}

const Avatar = ({ channelAvatar, channelTitle, channelId }) => {
  const history = useHistory()

  const handleChannelClick = (e) => {
    e.stopPropagation() // Ngăn sự kiện click lan tỏa đến video card
    history.push(`/channel/${channelId}`)
  }

  return (
    <AvatarContainer>
      <ChannelLink onClick={handleChannelClick}>
        <StyledAvatar src={channelAvatar} />
        <ContentText variant="subtitle1" style={{ paddingLeft: '8px' }}>
          {channelTitle}
        </ContentText>
      </ChannelLink>
    </AvatarContainer>
  )
}

const Descriptions = ({ description }) => {
  return (
    <DescriptionsContainer>
      {description.substr(0, 120) + '...'}
    </DescriptionsContainer>
  )
}

const ChannelLink = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  
  &:hover {
    color: #065fd4;
  }
`
