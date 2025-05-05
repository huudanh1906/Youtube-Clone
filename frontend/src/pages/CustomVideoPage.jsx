import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Typography, Avatar, Divider, CircularProgress, Button, IconButton } from '@material-ui/core';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import PlaylistAddOutlinedIcon from '@material-ui/icons/PlaylistAddOutlined';
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';
import QueryBuilderOutlinedIcon from '@material-ui/icons/QueryBuilderOutlined';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import authHeader from '../services/auth-header';
import CustomVideoPlayer from '../components/Videos/CustomVideoPlayer';
import {
  TWO_COL_MIN_WIDTH,
  useIsMobileView
} from '../utils/utils';
import { useAuth } from '../context/AuthContext';
import { request } from '../utils/api';
import numeral from 'numeral';
import moment from 'moment';

// Thêm hàm tiện ích để xử lý localStorage
const hasViewedRecently = (videoId) => {
  try {
    const viewedVideos = JSON.parse(localStorage.getItem('viewedVideos') || '{}');
    const lastViewTime = viewedVideos[videoId];

    if (!lastViewTime) return false;

    // Kiểm tra nếu đã xem trong 30 phút qua
    const thirtyMinutesMs = 30 * 60 * 1000; // 30 phút tính bằng ms
    return (Date.now() - lastViewTime) < thirtyMinutesMs;
  } catch (e) {
    console.error("Error checking viewed videos:", e);
    return false;
  }
};

const markAsViewed = (videoId) => {
  try {
    const viewedVideos = JSON.parse(localStorage.getItem('viewedVideos') || '{}');
    viewedVideos[videoId] = Date.now();

    // Dọn dẹp các mục cũ (hơn 30 ngày)
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    Object.keys(viewedVideos).forEach(id => {
      if (Date.now() - viewedVideos[id] > thirtyDaysMs) {
        delete viewedVideos[id];
      }
    });

    localStorage.setItem('viewedVideos', JSON.stringify(viewedVideos));
  } catch (e) {
    console.error("Error marking video as viewed:", e);
  }
};

const CustomVideoPage = () => {
  const { videoId } = useParams();
  const history = useHistory();
  const [video, setVideo] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobileView = useIsMobileView();
  const [activeButton, setActiveButton] = useState(null);
  const { isLoggedIn } = useAuth();
  const [viewCounted, setViewCounted] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState([]);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/videos/${videoId}`, { headers: authHeader() });
        console.log("Video data:", response.data); // Debug log
        setVideo(response.data);

        // Kiểm tra nếu đã xem gần đây thì đánh dấu đã tính view
        if (hasViewedRecently(videoId)) {
          console.log("Video already viewed recently, not counting as new view");
          setViewCounted(true);
        }

        // Fetch user details if we have a user ID
        if (response.data.user && response.data.user.id) {
          try {
            const userResponse = await axios.get(`/api/users/${response.data.user.id}`, { headers: authHeader() });
            setUser(userResponse.data);
          } catch (userErr) {
            console.error('Error fetching user details:', userErr);
            // Continue even if user details fetch fails
          }
        }

        // Tìm kiếm các video liên quan dựa vào tiêu đề video
        if (response.data.title) {
          fetchRelatedVideos(response.data.title);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching video details:', err);
        setError('Failed to load video. Please try again later.');
        setLoading(false);
      }
    };

    fetchVideoDetails();

    // Reset view counted state when video changes
    setViewCounted(hasViewedRecently(videoId));

    // Add class to body for styling
    document.body.classList.add('video-page-active');

    return () => {
      // Clean up when component unmounts
      document.body.classList.remove('video-page-active');
    };
  }, [videoId]);

  // Hàm để tìm kiếm video liên quan từ YouTube API
  const fetchRelatedVideos = async (videoTitle) => {
    try {
      // Lấy 3 từ đầu tiên từ tiêu đề để tìm kiếm
      const searchQuery = videoTitle.split(' ').slice(0, 3).join(' ');

      const { data } = await request('/search', {
        params: {
          part: 'snippet',
          q: searchQuery,
          type: 'video',
          maxResults: 10,
          regionCode: 'VN',
          relevanceLanguage: 'vi',
        },
      });

      if (data.items && data.items.length > 0) {
        // Lọc ra video hiện tại nếu nó xuất hiện trong kết quả tìm kiếm
        const filteredItems = data.items.filter(item => item.id.videoId !== videoId);

        // Lấy thêm thông tin chi tiết của các video
        if (filteredItems.length > 0) {
          const videoIds = filteredItems.map(item => item.id.videoId).join(',');

          const videoDetailsResponse = await request('/videos', {
            params: {
              part: 'snippet,contentDetails,statistics',
              id: videoIds,
            },
          });

          if (videoDetailsResponse.data.items) {
            setRelatedVideos(videoDetailsResponse.data.items);
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
          });

          if (popularVideosResponse.data.items) {
            setRelatedVideos(popularVideosResponse.data.items);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching related videos:', error);
      // Nếu có lỗi, thử lấy video phổ biến
      try {
        const popularVideosResponse = await request('/videos', {
          params: {
            part: 'snippet,contentDetails,statistics',
            chart: 'mostPopular',
            regionCode: 'VN',
            maxResults: 10,
          },
        });

        if (popularVideosResponse.data.items) {
          setRelatedVideos(popularVideosResponse.data.items);
        }
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
      }
    }
  };

  // Hàm xử lý khi người dùng click vào video liên quan
  const handleRelatedVideoClick = (relatedVideoId) => {
    // Chuyển đến trang YouTube nếu là video YouTube
    if (relatedVideoId.startsWith('http')) {
      window.open(relatedVideoId, '_blank');
    } else {
      // Chuyển đến trang watch của YouTube
      history.push(`/watch/${relatedVideoId}`);
    }
  };

  // Format để hiển thị thời lượng video
  const formatDuration = (isoDuration) => {
    const duration = moment.duration(isoDuration);
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  // Hàm xử lý khi xem đủ lâu để tính view
  const handleValidView = async () => {
    if (viewCounted || hasViewedRecently(videoId)) return; // Tránh đếm nhiều lần

    try {
      // Gọi API để tăng lượt xem
      await axios.get(`/api/videos/${videoId}/view`, { headers: authHeader() });
      console.log("View count incremented after meeting valid view criteria");

      // Đánh dấu video đã xem vào localStorage
      markAsViewed(videoId);

      // Cập nhật state để biết đã tính view
      setViewCounted(true);

      // Cập nhật số lượt xem trong state của video
      if (video) {
        setVideo({
          ...video,
          viewCount: video.viewCount + 1
        });
      }
    } catch (err) {
      console.error("Failed to increment view count:", err);
    }
  };

  // Format view count
  const formatViewCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    } else {
      return count;
    }
  };

  const handleButtonClick = (buttonName) => {
    if (!isLoggedIn) {
      // Show login dialog if needed
      return;
    }
    setActiveButton(buttonName === activeButton ? null : buttonName);

    // Xử lý các hành động tương ứng
    switch (buttonName) {
      case 'like':
        // Handle like logic
        break;
      case 'watchLater':
        // Handle watch later logic
        break;
      case 'save':
        // Handle save to playlist logic
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <Typography variant="h5">{error}</Typography>
      </ErrorContainer>
    );
  }

  if (!video) {
    return (
      <ErrorContainer>
        <Typography variant="h5">Video not found</Typography>
      </ErrorContainer>
    );
  }

  return (
    <VideoPageContainer>
      <PageContent>
        <MainContent>
          <VideoPlayerWrapper>
            {console.log("Rendering player with video:", video)}
            {video && (
              <CustomVideoPlayer
                videoId={video.filePath}
                title={video.title}
                autoPlay={false}
                onValidView={handleValidView}
              />
            )}
          </VideoPlayerWrapper>

          <VideoInfoSection>
            <VideoTitle variant="h1">{video.title}</VideoTitle>

            <VideoStats>
              <ViewsAndDate>
                <Typography variant="body2">
                  {formatViewCount(video.viewCount)} views • {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                </Typography>
              </ViewsAndDate>

              <ActionButtons>
                <ActionButton
                  active={activeButton === 'like'}
                  onClick={() => handleButtonClick('like')}
                >
                  <ThumbUpAltOutlinedIcon />
                  <Typography variant="body2">LIKE</Typography>
                </ActionButton>

                <ActionButton>
                  <ThumbDownAltOutlinedIcon />
                  <Typography variant="body2">DISLIKE</Typography>
                </ActionButton>

                <ActionButton>
                  <ShareOutlinedIcon />
                  <Typography variant="body2">SHARE</Typography>
                </ActionButton>

                <ActionButton
                  active={activeButton === 'save'}
                  onClick={() => handleButtonClick('save')}
                >
                  <PlaylistAddOutlinedIcon />
                  <Typography variant="body2">SAVE</Typography>
                </ActionButton>

                <ActionButton
                  active={activeButton === 'watchLater'}
                  onClick={() => handleButtonClick('watchLater')}
                >
                  <QueryBuilderOutlinedIcon />
                  <Typography variant="body2">WATCH LATER</Typography>
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
                  src={user?.profileImageUrl ?
                    `http://localhost:8080${user.profileImageUrl}` :
                    (video?.user?.profilePictureUrl ?
                      `http://localhost:8080${video.user.profilePictureUrl}` :
                      "https://via.placeholder.com/40")}
                  alt={user?.name || video?.user?.name || "User"}
                />

                <ChannelText>
                  <ChannelNameLink>
                    {user?.name || video?.user?.name || "User"}
                  </ChannelNameLink>
                  <Typography variant="body2">
                    {user?.subscriberCount || 0} subscribers
                  </Typography>
                </ChannelText>

                <SubscribeButton>
                  SUBSCRIBE
                </SubscribeButton>
              </ChannelHeader>

              <DescriptionContainer>
                <Typography variant="body2">{video.description}</Typography>
              </DescriptionContainer>
            </ChannelInfo>

            <Divider />

            {/* Comments section would go here */}

            {/* Hiển thị video liên quan trên mobile */}
            {isMobileView && relatedVideos.length > 0 && (
              <RelatedVideosMobile>
                <Typography variant="h2" gutterBottom>
                  Đề xuất xem tiếp
                </Typography>
                {relatedVideos.map((relatedVideo) => (
                  <RelatedVideoItem
                    key={relatedVideo.id}
                    onClick={() => handleRelatedVideoClick(relatedVideo.id)}
                  >
                    <RelatedVideoThumbnail>
                      <img
                        src={relatedVideo.snippet.thumbnails.medium.url}
                        alt={relatedVideo.snippet.title}
                      />
                      {relatedVideo.contentDetails && (
                        <Duration>
                          {formatDuration(relatedVideo.contentDetails.duration)}
                        </Duration>
                      )}
                    </RelatedVideoThumbnail>
                    <RelatedVideoInfo>
                      <RelatedVideoTitle>
                        {relatedVideo.snippet.title}
                      </RelatedVideoTitle>
                      <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                        <Avatar
                          src={relatedVideo.snippet.thumbnails.default.url}
                          alt={relatedVideo.snippet.channelTitle}
                          style={{ width: '24px', height: '24px', marginRight: '8px' }}
                        />
                        <RelatedVideoChannel>
                          {relatedVideo.snippet.channelTitle}
                        </RelatedVideoChannel>
                      </div>
                      <RelatedVideoStats>
                        {relatedVideo.statistics && numeral(relatedVideo.statistics.viewCount).format('0.0a')} views
                        • {moment(relatedVideo.snippet.publishedAt).fromNow()}
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
            {relatedVideos.map((relatedVideo) => (
              <RelatedVideoItem
                key={relatedVideo.id}
                onClick={() => handleRelatedVideoClick(relatedVideo.id)}
              >
                <RelatedVideoThumbnail>
                  <img
                    src={relatedVideo.snippet.thumbnails.medium.url}
                    alt={relatedVideo.snippet.title}
                  />
                  {relatedVideo.contentDetails && (
                    <Duration>
                      {formatDuration(relatedVideo.contentDetails.duration)}
                    </Duration>
                  )}
                </RelatedVideoThumbnail>
                <RelatedVideoInfo>
                  <RelatedVideoTitle>
                    {relatedVideo.snippet.title}
                  </RelatedVideoTitle>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                    <Avatar
                      src={relatedVideo.snippet.thumbnails.default.url}
                      alt={relatedVideo.snippet.channelTitle}
                      style={{ width: '24px', height: '24px', marginRight: '8px' }}
                    />
                    <RelatedVideoChannel>
                      {relatedVideo.snippet.channelTitle}
                    </RelatedVideoChannel>
                  </div>
                  <RelatedVideoStats>
                    {relatedVideo.statistics && numeral(relatedVideo.statistics.viewCount).format('0.0a')} views
                    • {moment(relatedVideo.snippet.publishedAt).fromNow()}
                  </RelatedVideoStats>
                </RelatedVideoInfo>
              </RelatedVideoItem>
            ))}
          </RelatedVideosSection>
        )}
      </PageContent>
    </VideoPageContainer>
  );
};

// Styled components
const VideoPageContainer = styled.div`
  padding: 0;
  width: 100%;
  margin: 0 auto;
  padding-top: 56px; /* Thêm padding-top cho header */
  min-height: 100vh;
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    padding: 80px 24px 0 24px; /* Tăng padding top trên desktop */
  }
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    flex-direction: row;
    max-width: 1280px;
    margin: 0 auto;
    padding-left: 0; /* Reset padding and use margin instead */
    margin-left: 240px; /* Space for sidebar */
  }
  
  @media screen and (max-width: ${TWO_COL_MIN_WIDTH - 1}px) {
    /* Mobile view: full width */
    width: 100%;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    flex: 1;
    margin-right: 24px;
    max-width: calc(100% - 24px); /* Ensure content doesn't overflow */
  }
`;

const VideoPlayerWrapper = styled.div`
  width: 100%;
  margin-top: 10px;
  background-color: #000;
  position: relative;
  
  @media screen and (max-width: ${TWO_COL_MIN_WIDTH - 1}px) {
    margin-left: -16px;
    margin-right: -16px;
    width: calc(100% + 32px);
  }
`;

const VideoInfoSection = styled.div`
  margin-top: 12px;
  padding: 0 16px;
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    padding: 0;
  }
`;

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
`;

const VideoStats = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const ViewsAndDate = styled.div`
  margin-bottom: 8px;
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    margin-bottom: 0;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap; /* Cho phép các nút xuống dòng trên màn hình nhỏ */
  justify-content: flex-start;
  
  @media screen and (max-width: 768px) {
    margin-top: 8px;
    justify-content: space-around;
    width: 100%;
    
    & > * {
      margin-bottom: 12px;
    }
  }
`;

const ActionButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  color: ${props => props.active ? '#3ea6ff' : 'inherit'};
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #3ea6ff;
  }
  
  svg {
    color: ${props => props.active ? '#3ea6ff' : 'inherit'};
  }
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    flex-direction: row;
    margin-right: 16px;
    
    svg {
      margin-right: 6px;
    }
  }
  
  @media screen and (max-width: 768px) {
    margin-right: 0;
    min-width: 50px;
    
    p {
      font-size: 10px;
      margin-top: 4px;
    }
  }
`;

const ChannelInfo = styled.div`
  margin: 16px 0;
`;

const ChannelHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const ChannelAvatar = styled(Avatar)`
  && {
    width: 48px;
    height: 48px;
    margin-right: 12px;
  }
`;

const ChannelText = styled.div`
  margin-left: 12px;
`;

const ChannelNameLink = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    
    &:hover {
      color: #065fd4;
    }
  }
`;

const SubscribeButton = styled(Button)`
  && {
    margin-left: auto;
    background-color: #cc0000;
    color: white;
    text-transform: uppercase;
    font-weight: 500;
    padding: 6px 16px;
    border-radius: 2px;
    
    &:hover {
      background-color: #aa0000;
    }
    
    @media screen and (max-width: 600px) {
      font-size: 12px;
      padding: 4px 10px;
    }
  }
`;

const DescriptionContainer = styled.div`
  margin-top: 16px;
  white-space: pre-line;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

// Thêm styled components cho các video liên quan
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
`;

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
`;

const RelatedVideoItem = styled.div`
  display: flex;
  margin-bottom: 16px;
  cursor: pointer;
`;

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
`;

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
`;

const RelatedVideoInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const RelatedVideoTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  margin: 0 0 4px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RelatedVideoChannel = styled.p`
  font-size: 13px;
  color: #606060;
  margin: 0 0 4px 0;
`;

const RelatedVideoStats = styled.p`
  font-size: 13px;
  color: #606060;
  margin: 0;
`;

export default CustomVideoPage; 