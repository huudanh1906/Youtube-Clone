import React from 'react'
import styled from 'styled-components/macro'
import { Typography } from '@material-ui/core'
import { TWO_COL_MIN_WIDTH, useIsMobileView } from '../../utils/utils'
import moment from 'moment'
import numeral from 'numeral'
import SubscribeButton from './SubscribeButton'
import { Link } from 'react-router-dom'

export const ChannelDetails = ({
  channelTitle,
  publishedAt,
  viewCount,
  isSearchPage,
  channelId,
  channelThumbnailUrl,
  showSubscribeButton = false,
}) => {
  const isMobileView = useIsMobileView()

  if (isMobileView) {
    return (
      <ChannelDetailsContainer style={{ fontSize: '12px' }}>
        <StatsContainer>
          {isSearchPage ? (
            // no DotSeparator on mobile search result page, channelTitle on its own line
            <SearchChannelName variant="h3">
              {channelId ? (
                <ChannelLink to={`/channel/${channelId}`}>{channelTitle}</ChannelLink>
              ) : (
                channelTitle
              )}
            </SearchChannelName>
          ) : (
            // mobile view landing page
            <ChannelName variant="h3">
              {channelId ? (
                <ChannelLink to={`/channel/${channelId}`}>{channelTitle}</ChannelLink>
              ) : (
                channelTitle
              )} <DotSeparator />
            </ChannelName>
          )}
          <Stats {...{ viewCount, publishedAt }} />
        </StatsContainer>
        {showSubscribeButton && channelId && (
          <MobileSubscribeButtonWrapper>
            <SubscribeButton
              channelId={channelId}
              channelTitle={channelTitle}
              channelThumbnailUrl={channelThumbnailUrl}
            />
          </MobileSubscribeButtonWrapper>
        )}
      </ChannelDetailsContainer>
    )
  } else {
    return (
      <ChannelDetailsContainer>
        <ChannelInfoContainer>
          {/* ChannelName is outside StatsContainer in desktop view */}
          <ChannelName variant="subtitle2">
            {channelId ? (
              <ChannelLink to={`/channel/${channelId}`}>{channelTitle}</ChannelLink>
            ) : (
              channelTitle
            )}
          </ChannelName>
          <StatsContainer>
            <Stats {...{ viewCount, publishedAt }} />
          </StatsContainer>
        </ChannelInfoContainer>
        {showSubscribeButton && channelId && (
          <SubscribeButton
            channelId={channelId}
            channelTitle={channelTitle}
            channelThumbnailUrl={channelThumbnailUrl}
          />
        )}
      </ChannelDetailsContainer>
    )
  }
}

const Stats = ({ viewCount, publishedAt }) => {
  return (
    <>
      <span style={{ marginRight: '4px' }}>
        {numeral(viewCount).format('0.a')} views <DotSeparator />
      </span>
      <span>{moment(publishedAt).fromNow()}</span>
    </>
  )
}

const ChannelDetailsContainer = styled.div`
  && {
    line-height: 14px;
    color: rgb(96, 96, 96);
    display: flex;
    flex-direction: column;

    @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
      line-height: 18px;
      flex-direction: row;
      align-items: center;
    }
  }
`

const ChannelInfoContainer = styled.div`
  flex: 1;
`

const ChannelName = styled(Typography)`
  && {
    font-size: 12px;
    margin-right: 4px;
    display: inline;

    @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
      font-size: 14px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`

const SearchChannelName = styled(ChannelName)`
  && {
    display: block;
  }
`

const ChannelLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  
  &:hover {
    color: #065fd4;
  }
`

const StatsContainer = styled.div`
  opacity: 0.6;
  /* letter-spacing: 0.3px; */
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    opacity: 1;
    display: flex;
    flex-wrap: wrap;
  }
`

const MobileSubscribeButtonWrapper = styled.div`
  margin-top: 10px;
`

export const DotSeparator = () => {
  return <span>•</span>
}

// change 'a' & 'an' to '1'
moment.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '1 few seconds',
    ss: '%d seconds',
    m: '1 minute',
    mm: '%d minutes',
    h: '1 hour',
    hh: '%d hours',
    d: '1 day',
    dd: '%d days',
    w: '1 week',
    ww: '%d weeks',
    M: '1 month',
    MM: '%d months',
    y: '1 year',
    yy: '%d years',
  },
})
