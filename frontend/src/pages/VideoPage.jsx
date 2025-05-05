import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'
import { Typography, Avatar, Divider, CircularProgress, Grid, Button } from '@material-ui/core'
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined'
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined'
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined'
import PlaylistAddOutlinedIcon from '@material-ui/icons/PlaylistAddOutlined'
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined'
import IconButton from '@material-ui/core/IconButton'
import moment from 'moment'
import numeral from 'numeral'
import { request } from '../utils/api'
import {
  TWO_COL_MIN_WIDTH,
  StyledAvatar,
  useIsMobileView,
  getFormattedDurationString,
} from '../utils/utils'
import he from 'he'
import { useAuth } from '../context/AuthContext'
import VideoService from '../services/video.service'
import SubscriptionService from '../services/subscription.service'
import HistoryService from '../services/history.service'
import PlaylistService from '../services/playlist.service'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined'
import SubscribeButton from '../components/Videos/SubscribeButton'
import PlaylistDialog from '../components/Playlists/PlaylistDialog'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import WatchLaterService from '../services/watchlater.service'
import QueryBuilderOutlinedIcon from '@material-ui/icons/QueryBuilderOutlined'

const VideoPage = () => {
  const { videoId } = useParams()
  const history = useHistory()
  const [video, setVideo] = useState(null)
  const [channelDetails, setChannelDetails] = useState(null)
  const [comments, setComments] = useState([])
  const [relatedVideos, setRelatedVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const isMobileView = useIsMobileView()
  const [isLiked, setIsLiked] = useState(false)
  const { isLoggedIn } = useAuth()
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [isInWatchLater, setIsInWatchLater] = useState(false)

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setLoading(true)
        const { data } = await request('/videos', {
          params: {
            part: 'snippet,contentDetails,statistics',
            id: videoId,
          },
        })

        if (data.items.length > 0) {
          setVideo(data.items[0])

          // Fetch channel details
          const channelResponse = await request('/channels', {
            params: {
              part: 'snippet,statistics',
              id: data.items[0].snippet.channelId,
            },
          })

          if (channelResponse.data.items.length > 0) {
            setChannelDetails(channelResponse.data.items[0])
          }

          // Fetch comments
          const commentsResponse = await request('/commentThreads', {
            params: {
              part: 'snippet',
              videoId: videoId,
              maxResults: 20,
            },
          })

          if (commentsResponse.data.items) {
            setComments(commentsResponse.data.items)
          } else {
            setComments([])
          }

          // Fetch related videos using the video title as search query
          fetchRelatedVideos(data.items[0].snippet.title)

          // Add to watch history if user is logged in
          if (isLoggedIn) {
            // Chuyển đổi thời lượng ISO 8601 thành số giây
            const duration = moment.duration(data.items[0].contentDetails.duration).asSeconds()

            await HistoryService.addToHistory({
              videoId: data.items[0].id,
              title: data.items[0].snippet.title,
              description: data.items[0].snippet.description,
              thumbnailUrl: data.items[0].snippet.thumbnails.high.url,
              channelTitle: data.items[0].snippet.channelTitle,
              duration: Math.round(duration)
            })
          }
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }

    fetchVideoDetails()
  }, [videoId, isLoggedIn])

  useEffect(() => {
    const checkIfVideoIsLiked = async () => {
      if (isLoggedIn && videoId) {
        try {
          const liked = await VideoService.isVideoLiked(videoId)
          setIsLiked(liked)
        } catch (error) {
          console.error('Error checking if video is liked:', error)
        }
      }
    }

    checkIfVideoIsLiked()
  }, [isLoggedIn, videoId])

  useEffect(() => {
    const checkIfInWatchLater = async () => {
      if (isLoggedIn && videoId) {
        try {
          const inWatchLater = await WatchLaterService.isInWatchLater(videoId)
          setIsInWatchLater(inWatchLater)
        } catch (error) {
          console.error('Error checking if video is in watch later:', error)
        }
      }
    }

    checkIfInWatchLater()
  }, [isLoggedIn, videoId])

  const fetchRelatedVideos = async (videoTitle) => {
    try {
      // Thay vì sử dụng relatedToVideoId (có thể bị hạn chế), 
      // chúng ta sẽ tìm kiếm dựa trên tiêu đề video
      const searchQuery = videoTitle.split(' ').slice(0, 3).join(' ') // Lấy 3 từ đầu tiên từ tiêu đề

      const { data } = await request('/search', {
        params: {
          part: 'snippet',
          q: searchQuery,
          type: 'video',
          maxResults: 10,
          regionCode: 'VN',
          relevanceLanguage: 'vi',
        },
      })

      if (data.items && data.items.length > 0) {
        // Lọc ra video hiện tại nếu nó xuất hiện trong kết quả tìm kiếm
        const filteredItems = data.items.filter(item => item.id.videoId !== videoId)

        // Lấy thêm thông tin chi tiết của các video
        if (filteredItems.length > 0) {
          const videoIds = filteredItems.map(item => item.id.videoId).join(',')

          const videoDetailsResponse = await request('/videos', {
            params: {
              part: 'snippet,contentDetails,statistics',
              id: videoIds,
            },
          })

          if (videoDetailsResponse.data.items) {
            setRelatedVideos(videoDetailsResponse.data.items)
          }
        } else {
          // Nếu không tìm thấy video phù hợp, sử dụng API videos để lấy video phổ biến
          const popularVideosResponse = await request('/videos', {
            params: {
              part: 'snippet,contentDetails,statistics',
              chart: 'mostPopular',
              regionCode: 'VN',
              maxResults: 10,
            },
          })

          if (popularVideosResponse.data.items) {
            // Lọc ra video hiện tại nếu có
            const filteredPopularVideos = popularVideosResponse.data.items.filter(
              item => item.id !== videoId
            )
            setRelatedVideos(filteredPopularVideos)
          }
        }
      } else {
        // Nếu không tìm thấy video liên quan, sử dụng API videos để lấy video phổ biến
        const popularVideosResponse = await request('/videos', {
          params: {
            part: 'snippet,contentDetails,statistics',
            chart: 'mostPopular',
            regionCode: 'VN',
            maxResults: 10,
          },
        })

        if (popularVideosResponse.data.items) {
          // Lọc ra video hiện tại nếu có
          const filteredPopularVideos = popularVideosResponse.data.items.filter(
            item => item.id !== videoId
          )
          setRelatedVideos(filteredPopularVideos)
        }
      }

      setLoading(false)
    } catch (error) {
      console.log(error)
      // Nếu có lỗi khi tìm kiếm, sử dụng API videos để lấy video phổ biến
      try {
        const popularVideosResponse = await request('/videos', {
          params: {
            part: 'snippet,contentDetails,statistics',
            chart: 'mostPopular',
            regionCode: 'VN',
            maxResults: 10,
          },
        })

        if (popularVideosResponse.data.items) {
          // Lọc ra video hiện tại nếu có
          const filteredPopularVideos = popularVideosResponse.data.items.filter(
            item => item.id !== videoId
          )
          setRelatedVideos(filteredPopularVideos)
        }
      } catch (fallbackError) {
        console.log("Fallback error:", fallbackError)
      }

      setLoading(false)
    }
  }

  const handleRelatedVideoClick = (relatedVideoId) => {
    history.push(`/watch/${relatedVideoId}`)
  }

  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        await VideoService.unlikeVideo(videoId)
        setIsLiked(false)
      } else {
        const videoData = {
          videoId,
          title: video?.snippet?.title || '',
          description: video?.snippet?.description || '',
          thumbnailUrl: video?.snippet?.thumbnails?.high?.url || '',
          channelTitle: video?.snippet?.channelTitle || ''
        }
        await VideoService.likeVideo(videoData)
        setIsLiked(true)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleSaveClick = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true)
      return
    }
    setPlaylistDialogOpen(true)
  }

  const handleAddToPlaylist = async (playlist) => {
    try {
      // Convert ISO duration to seconds for storage
      const duration = video?.contentDetails?.duration ?
        moment.duration(video.contentDetails.duration).asSeconds() : 0

      const videoData = {
        videoId: videoId,
        title: video?.snippet?.title || '',
        description: video?.snippet?.description || '',
        thumbnailUrl: video?.snippet?.thumbnails?.high?.url || '',
        channelTitle: video?.snippet?.channelTitle || '',
        duration: Math.round(duration)
      }

      await PlaylistService.addToPlaylist(playlist.id, videoData)
      // Could add a success notification here
    } catch (error) {
      console.error('Error adding video to playlist:', error)
    }
  }

  const handleWatchLaterToggle = async () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true)
      return
    }

    try {
      if (isInWatchLater) {
        await WatchLaterService.removeFromWatchLater(videoId)
        setIsInWatchLater(false)
      } else {
        const videoData = {
          videoId,
          title: video?.snippet?.title || '',
          description: video?.snippet?.description || '',
          thumbnailUrl: video?.snippet?.thumbnails?.high?.url || '',
          channelTitle: video?.snippet?.channelTitle || '',
          duration: video?.contentDetails?.duration ?
            moment.duration(video.contentDetails.duration).asSeconds() : 0
        }
        await WatchLaterService.addToWatchLater(videoData)
        setIsInWatchLater(true)
      }
    } catch (error) {
      console.error('Error toggling watch later:', error)
    }
  }

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    )
  }

  if (!video) {
    return (
      <ErrorContainer>
        <Typography variant="h5">Video not found</Typography>
      </ErrorContainer>
    )
  }

  const {
    snippet: {
      title,
      channelTitle,
      publishedAt,
      description
    },
    statistics: {
      viewCount,
      likeCount,
      dislikeCount
    }
  } = video

  return (
    <VideoPageContainer>
      <PageContent>
        <MainContent>
          <VideoPlayerContainer>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title}
            ></iframe>
          </VideoPlayerContainer>

          <VideoInfoSection>
            <VideoTitle variant="h1">{he.decode(title)}</VideoTitle>

            <VideoStats>
              <ViewsAndDate>
                <Typography variant="body2">
                  {numeral(viewCount).format('0,0')} views • {moment(publishedAt).format('MMM D, YYYY')}
                </Typography>
              </ViewsAndDate>

              <ActionButtons>
                <VideoLikeButton
                  videoInfo={video}
                  isLiked={isLiked}
                  onLikeToggle={handleLikeToggle}
                />

                <ActionButton>
                  <ThumbDownAltOutlinedIcon />
                  <Typography variant="body2">{dislikeCount ? numeral(dislikeCount).format('0,0') : ''}</Typography>
                </ActionButton>

                <ActionButton>
                  <ShareOutlinedIcon />
                  <Typography variant="body2">SHARE</Typography>
                </ActionButton>

                <ActionButton onClick={handleSaveClick}>
                  <PlaylistAddOutlinedIcon />
                  <Typography variant="body2">SAVE</Typography>
                </ActionButton>

                <ActionButton onClick={handleWatchLaterToggle}>
                  <QueryBuilderOutlinedIcon style={{ color: isInWatchLater ? '#3ea6ff' : 'inherit' }} />
                  <Typography variant="body2" style={{ color: isInWatchLater ? '#3ea6ff' : 'inherit' }}>
                    {isInWatchLater ? 'ADDED' : 'WATCH LATER'}
                  </Typography>
                </ActionButton>

                <IconButton>
                  <MoreHorizOutlinedIcon />
                </IconButton>
              </ActionButtons>
            </VideoStats>

            <Divider />

            <ChannelInfo>
              <ChannelHeader>
                <ChannelAvatar
                  src={channelDetails?.snippet?.thumbnails?.default?.url}
                  alt={channelTitle}
                  onClick={() => history.push(`/channel/${video.snippet.channelId}`)}
                />

                <ChannelText>
                  <ChannelNameLink
                    onClick={() => history.push(`/channel/${video.snippet.channelId}`)}
                  >
                    {channelTitle}
                  </ChannelNameLink>
                  <Typography variant="body2">
                    {channelDetails ? numeral(channelDetails.statistics.subscriberCount).format('0.0a') : '0'} subscribers
                  </Typography>
                </ChannelText>

                {video && video.snippet && video.snippet.channelId && (
                  <SubscribeButtonWrapper>
                    <SubscribeButton
                      channelId={video.snippet.channelId}
                      channelTitle={channelTitle}
                      channelThumbnailUrl={channelDetails?.snippet?.thumbnails?.default?.url || ''}
                    />
                  </SubscribeButtonWrapper>
                )}
              </ChannelHeader>

              <DescriptionContainer>
                <Typography variant="body2">{description}</Typography>
              </DescriptionContainer>
            </ChannelInfo>

            <Divider />

            <CommentsSection>
              <CommentHeader>
                <Typography variant="h2">
                  {numeral(comments?.length || 0).format('0,0')} Comments
                </Typography>
              </CommentHeader>

              {comments?.map((comment) => (
                <CommentItem key={comment.id}>
                  <CommentAvatar
                    src={comment.snippet.topLevelComment.snippet.authorProfileImageUrl}
                    alt={comment.snippet.topLevelComment.snippet.authorDisplayName}
                  />

                  <CommentContent>
                    <CommentHeader>
                      <Typography variant="body1">
                        {comment.snippet.topLevelComment.snippet.authorDisplayName}
                      </Typography>
                      <Typography variant="body2">
                        {moment(comment.snippet.topLevelComment.snippet.publishedAt).fromNow()}
                      </Typography>
                    </CommentHeader>

                    <Typography variant="body2">
                      {comment.snippet.topLevelComment.snippet.textDisplay}
                    </Typography>

                    <CommentActions>
                      <ThumbUpAltOutlinedIcon fontSize="small" />
                      <Typography variant="body2">
                        {numeral(comment.snippet.topLevelComment.snippet.likeCount).format('0,0')}
                      </Typography>
                      <ThumbDownAltOutlinedIcon fontSize="small" />
                    </CommentActions>
                  </CommentContent>
                </CommentItem>
              ))}
            </CommentsSection>

            {/* Hiển thị video liên quan trên mobile */}
            {isMobileView && relatedVideos.length > 0 && (
              <RelatedVideosMobile>
                <Typography variant="h2" gutterBottom>
                  Đề xuất xem tiếp
                </Typography>
                {relatedVideos.map((video) => (
                  <RelatedVideoItem
                    key={video.id}
                    onClick={() => handleRelatedVideoClick(video.id)}
                  >
                    <RelatedVideoThumbnail>
                      <img
                        src={video.snippet.thumbnails.medium.url}
                        alt={video.snippet.title}
                      />
                      <Duration>
                        {getFormattedDurationString(video.contentDetails.duration)}
                      </Duration>
                    </RelatedVideoThumbnail>
                    <RelatedVideoInfo>
                      <RelatedVideoTitle>
                        {he.decode(video.snippet.title)}
                      </RelatedVideoTitle>
                      <RelatedVideoChannel>
                        {video.snippet.channelTitle}
                      </RelatedVideoChannel>
                      <RelatedVideoStats>
                        {numeral(video.statistics.viewCount).format('0.0a')} views • {moment(video.snippet.publishedAt).fromNow()}
                      </RelatedVideoStats>
                    </RelatedVideoInfo>
                  </RelatedVideoItem>
                ))}
              </RelatedVideosMobile>
            )}
          </VideoInfoSection>
        </MainContent>

        {/* Hiển thị video liên quan trên desktop */}
        {!isMobileView && relatedVideos.length > 0 && (
          <RelatedVideosSection>
            <Typography variant="h2" gutterBottom>
              Đề xuất xem tiếp
            </Typography>
            {relatedVideos.map((video) => (
              <RelatedVideoItem
                key={video.id}
                onClick={() => handleRelatedVideoClick(video.id)}
              >
                <RelatedVideoThumbnail>
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                  />
                  <Duration>
                    {getFormattedDurationString(video.contentDetails.duration)}
                  </Duration>
                </RelatedVideoThumbnail>
                <RelatedVideoInfo>
                  <RelatedVideoTitle>
                    {he.decode(video.snippet.title)}
                  </RelatedVideoTitle>
                  <RelatedVideoChannel>
                    {video.snippet.channelTitle}
                  </RelatedVideoChannel>
                  <RelatedVideoStats>
                    {numeral(video.statistics.viewCount).format('0.0a')} views • {moment(video.snippet.publishedAt).fromNow()}
                  </RelatedVideoStats>
                </RelatedVideoInfo>
              </RelatedVideoItem>
            ))}
          </RelatedVideosSection>
        )}
      </PageContent>

      {/* Playlist Dialog */}
      <PlaylistDialog
        open={playlistDialogOpen}
        onClose={() => setPlaylistDialogOpen(false)}
        onSuccess={handleAddToPlaylist}
      />

      {/* Login Dialog */}
      <Dialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      >
        <DialogTitle>Sign In Required</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Signed-in users can like videos and build playlists. Sign in to save your preferences.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLoginDialog(false)} color="default">
            Cancel
          </Button>
          <Button onClick={() => history.push('/login')} color="primary">
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </VideoPageContainer>
  )
}

const VideoLikeButton = ({ videoInfo, isLiked, onLikeToggle }) => {
  const { isLoggedIn } = useAuth()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const history = useHistory()

  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true)
      return
    }

    onLikeToggle()
  }

  const handleLogin = () => {
    history.push('/login')
    setShowLoginDialog(false)
  }

  const handleClose = () => {
    setShowLoginDialog(false)
  }

  return (
    <>
      <LikeButtonContainer onClick={handleLikeClick}>
        {isLiked ?
          <ThumbUpIcon style={{ color: '#3ea6ff' }} /> :
          <ThumbUpOutlinedIcon />
        }
        <LikeText isActive={isLiked}>Like</LikeText>
      </LikeButtonContainer>

      {showLoginDialog && (
        <LoginDialogBackdrop onClick={handleClose}>
          <LoginDialogContainer onClick={(e) => e.stopPropagation()}>
            <CustomDialogTitle>Sign in to like this video</CustomDialogTitle>
            <CustomDialogContent>
              Signed-in users can like videos and build playlists. Sign in to save your preferences.
            </CustomDialogContent>
            <FixedDialogActions>
              <FixedDialogButton onClick={handleClose}>Cancel</FixedDialogButton>
              <FixedDialogButton primary onClick={handleLogin}>Sign In</FixedDialogButton>
            </FixedDialogActions>
          </LoginDialogContainer>
        </LoginDialogBackdrop>
      )}
    </>
  )
}

export default VideoPage

// Styled components
const VideoPageContainer = styled.div`
  padding: 0;
  width: 100%;
  margin: 0 auto;
  padding-top: 56px; /* Thêm padding-top cho header */
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    padding: 80px 24px 0 24px; /* Tăng padding top trên desktop */
  }
`

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    flex-direction: row;
    max-width: 1280px;
    margin: 0 auto;
  }
`

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    flex: 1;
    margin-right: 24px;
  }
`

const VideoPlayerContainer = styled.div`
  width: 100%;
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  margin-top: 10px; /* Thêm margin-top để không bị che khuất */
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`

const VideoInfoSection = styled.div`
  margin-top: 12px;
  padding: 0 16px;
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    padding: 0;
  }
`

const VideoTitle = styled(Typography)`
  && {
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
    margin-bottom: 8px;
    
    @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
      font-size: 20px;
      line-height: 28px;
    }
  }
`

const VideoStats = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

const ViewsAndDate = styled.div`
  margin-bottom: 8px;
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    margin-bottom: 0;
  }
`

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
`

const ActionButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
  cursor: pointer;
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    flex-direction: row;
    
    svg {
      margin-right: 4px;
    }
  }
`

const ChannelInfo = styled.div`
  margin: 16px 0;
`

const ChannelHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`

const ChannelAvatar = styled(Avatar)`
  && {
    width: 48px;
    height: 48px;
    margin-right: 12px;
  }
`

const ChannelText = styled.div`
  margin-left: 12px;
`

const ChannelNameLink = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    
    &:hover {
      color: #065fd4;
    }
  }
`

const SubscribeButtonWrapper = styled.div`
  margin-left: auto;
  
  @media screen and (max-width: ${TWO_COL_MIN_WIDTH}px) {
    margin-top: 10px;
    margin-left: 0;
  }
`

const DescriptionContainer = styled.div`
  margin-top: 16px;
  white-space: pre-line;
`

const CommentsSection = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
`

const CommentHeader = styled.div`
  margin-bottom: 24px;
  
  h2 {
    font-size: 16px;
    font-weight: 500;
  }
`

const CommentItem = styled.div`
  display: flex;
  margin-bottom: 24px;
`

const CommentAvatar = styled(Avatar)`
  && {
    width: 40px;
    height: 40px;
    margin-right: 16px;
  }
`

const CommentContent = styled.div`
  flex: 1;
`

const CommentActions = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  
  svg {
    margin-right: 4px;
    cursor: pointer;
  }
  
  p {
    margin-right: 12px;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`

// Style cho các video liên quan
const RelatedVideosSection = styled.div`
  display: none;
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    display: block;
    width: 350px;
    
    h2 {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 16px;
    }
  }
`

const RelatedVideosMobile = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
  
  h2 {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    display: none;
  }
`

const RelatedVideoItem = styled.div`
  display: flex;
  margin-bottom: 16px;
  cursor: pointer;
`

const RelatedVideoThumbnail = styled.div`
  position: relative;
  width: 168px;
  min-width: 168px;
  height: 94px;
  margin-right: 8px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const Duration = styled.div`
  position: absolute;
  right: 4px;
  bottom: 4px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 12px;
  padding: 1px 4px;
  border-radius: 2px;
  font-weight: 500;
`

const RelatedVideoInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const RelatedVideoTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  margin: 0 0 4px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const RelatedVideoChannel = styled.p`
  font-size: 13px;
  color: #606060;
  margin: 0 0 4px 0;
`

const RelatedVideoStats = styled.p`
  font-size: 13px;
  color: #606060;
  margin: 0;
`

const LikeButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin-right: 16px;
  padding: 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    flex-direction: row;
  }
`

const LikeText = styled.span`
  margin-left: 4px;
  font-size: 14px;
  color: ${props => props.isActive ? '#3ea6ff' : 'inherit'};
`

const LoginDialogBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`

const LoginDialogContainer = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 4px;
  width: 300px;
`

const CustomDialogTitle = styled.h2`
  margin-bottom: 16px;
`

const CustomDialogContent = styled.p`
  margin-bottom: 24px;
`

const FixedDialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
`

const FixedDialogButton = styled.button`
  background-color: ${props => props.primary ? '#3ea6ff' : 'inherit'};
  color: ${props => props.primary ? 'white' : 'inherit'};
  border: none;
  padding: 10px 16px;
  border-radius: 2px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-left: ${props => props.primary ? '16px' : '0'};
`