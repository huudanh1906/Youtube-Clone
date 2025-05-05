import React, { useState } from 'react'
import styled from 'styled-components/macro'
import { useMediaQuery } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import {
  TWO_COL_MIN_WIDTH,
  useIsMobileView,
  getFormattedDurationString,
  TWO_COL_MAX_WIDTH,
  useGetChannelDetails,
} from '../../utils/utils'
import { useGetVideoDetails } from './searchUtils'
import { ChannelImage } from './ChannelImage'
import { VideoThumbnail } from './VideoThumbnail'
import { MobileChannelContent } from './MobileChannelContent'
import { MobileVideoContent } from './MobileVideoContent'
import SubscribeButton from '../Videos/SubscribeButton'
import { DesktopChannelContent } from './DesktopChannelContent'
import { DesktopVideoContent } from './DesktopVideoContent'

const ResultsVideoCard = ({ video }) => {
  const history = useHistory()
  const {
    id: { kind, videoId, channelId: idChannelId },
    snippet: {
      channelId: snippetChannelId,
      channelTitle,
      title,
      publishedAt,
      thumbnails,
      description,
    },
  } = video

  // Sử dụng channelId từ id hoặc snippet tùy theo trường hợp
  const channelId = idChannelId || snippetChannelId

  const isMobileView = useIsMobileView()
  const isVideo = kind === 'youtube#video'
  const showSubscribeButton = useMediaQuery(
    `(min-width: ${TWO_COL_MAX_WIDTH}px)`
  )
  const [viewCount, setViewCount] = useState(null)
  const [duration, setDuration] = useState(null)
  const [channelAvatar, setChannelAvatar] = useState(null)
  const [channelInfo, setChannelInfo] = useState(null)
  const thumbnailImage = thumbnails.medium.url

  // get duration and viewCount
  useGetVideoDetails(
    true, // useLocalStorage
    videoId,
    setDuration,
    setViewCount
  )

  // get channelAvatar for video or get channel info for channel
  useGetChannelDetails(
    true, // useLocalStorage
    isVideo,
    videoId,
    channelId,
    setChannelAvatar,
    setChannelInfo
  )

  const formattedDuration = getFormattedDurationString(duration)

  const handleVideoClick = () => {
    if (isVideo) {
      history.push(`/watch/${videoId}`)
    }
  }

  const handleChannelClick = () => {
    history.push(`/channel/${channelId}`)
  }

  if (isVideo) {
    return (
      <StyledCard onClick={handleVideoClick} isVideo={isVideo}>
        <VideoThumbnail {...{ thumbnailImage, formattedDuration }} />

        {isMobileView ? (
          <MobileVideoContent
            {...{ title, channelTitle, publishedAt, viewCount }}
          />
        ) : (
          <DesktopVideoContent
            {...{
              title,
              viewCount,
              publishedAt,
              channelAvatar,
              channelTitle,
              description,
              channelId,
            }}
          />
        )}
      </StyledCard>
    )
  } else {
    // if the row is a channel
    return (
      <StyledCard isVideo={isVideo}>
        <div onClick={handleChannelClick} style={{ cursor: 'pointer', display: 'flex' }}>
        <ChannelImage thumbnailImage={thumbnailImage} />

        {isMobileView ? (
          <MobileChannelContent
            {...{ channelTitle, isMobileView, channelInfo }}
          />
        ) : (
          <DeskChannelContentContainer>
            <DesktopChannelContent {...{ channelTitle, channelInfo }} />
          </DeskChannelContentContainer>
          )}
        </div>

        {/* Nút Subscribe mới với chức năng thực tế */}
        {!isMobileView && showSubscribeButton && (
          <SubscribeButtonContainer>
            <SubscribeButton
              channelId={channelId}
              channelTitle={channelTitle}
              channelThumbnailUrl={thumbnailImage}
            />
          </SubscribeButtonContainer>
        )}
      </StyledCard>
    )
  }
}

export default ResultsVideoCard

const DeskChannelContentContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-basis: 60%;
`

const SubscribeButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
`

const StyledCard = styled.div`
  margin-top: 12px;
  padding: 0 12px;
  height: 90px;
  display: flex;
  cursor: ${props => props.isVideo ? 'pointer' : 'default'};

  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    height: 100%;
    width: 100%;
  }
`
