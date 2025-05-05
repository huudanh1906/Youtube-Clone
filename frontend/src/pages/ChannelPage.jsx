import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Typography, Avatar, Tabs, Tab, CircularProgress, Divider } from '@material-ui/core';
import { request } from '../utils/api';
import numeral from 'numeral';
import moment from 'moment';
import SubscribeButton from '../components/Videos/SubscribeButton';
import VideoCard from '../components/Videos/VideoCard';
import ShortCard from '../components/Videos/ShortCard';
import { TWO_COL_MIN_WIDTH, useIsMobileView } from '../utils/utils';

const ChannelPage = () => {
  const { channelId } = useParams();
  const [channelInfo, setChannelInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const isMobileView = useIsMobileView();
  const [regularVideos, setRegularVideos] = useState([]);
  const [shorts, setShorts] = useState([]);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        setLoading(true);

        // Fetch channel info
        const channelResponse = await request('/channels', {
          params: {
            part: 'snippet,statistics,brandingSettings',
            id: channelId,
          },
        });

        if (channelResponse.data.items && channelResponse.data.items.length > 0) {
          setChannelInfo(channelResponse.data.items[0]);
        }

        // Fetch channel videos
        const videosResponse = await request('/search', {
          params: {
            part: 'snippet',
            channelId: channelId,
            order: 'date',
            maxResults: 30, // Tăng số lượng video để có nhiều video hơn cho cả 2 tab
            type: 'video'
          },
        });

        if (videosResponse.data.items && videosResponse.data.items.length > 0) {
          const videoIds = videosResponse.data.items.map(item => item.id.videoId).join(',');

          // Get video details
          const videoDetailsResponse = await request('/videos', {
            params: {
              part: 'snippet,contentDetails,statistics',
              id: videoIds,
            },
          });

          if (videoDetailsResponse.data.items) {
            const allVideos = videoDetailsResponse.data.items;
            setVideos(allVideos);

            // Phân loại videos và shorts dựa trên thời lượng
            const regularVids = [];
            const shortsVids = [];

            allVideos.forEach(video => {
              // Phân tích thời lượng video từ định dạng ISO 8601
              const duration = video.contentDetails.duration;
              const seconds = moment.duration(duration).asSeconds();

              // Nếu video có độ dài <= 60 giây (1 phút), phân loại là Short
              if (seconds <= 60) {
                shortsVids.push(video);
              } else {
                regularVids.push(video);
              }
            });

            setRegularVideos(regularVids);
            setShorts(shortsVids);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching channel data:', error);
        setLoading(false);
      }
    };

    if (channelId) {
      fetchChannelData();
    }
  }, [channelId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  if (!channelInfo) {
    return (
      <ErrorContainer>
        <Typography variant="h5">Channel not found</Typography>
      </ErrorContainer>
    );
  }

  const {
    snippet: { title: channelTitle, description, thumbnails },
    statistics: { subscriberCount, videoCount, viewCount },
    brandingSettings
  } = channelInfo;

  return (
    <ChannelPageContainer>
      <ChannelBanner
        banner={brandingSettings?.image?.bannerExternalUrl}
      />

      <ChannelInfoSection>
        <ChannelHeader>
          <ChannelAvatar
            src={thumbnails?.high?.url || thumbnails?.default?.url}
            alt={channelTitle}
          />

          <ChannelDetails>
            <ChannelTitle variant="h1">{channelTitle}</ChannelTitle>
            <ChannelStats>
              <Typography variant="body2">
                {numeral(subscriberCount).format('0.0a')} subscribers • {numeral(videoCount).format('0,0')} videos • {numeral(viewCount).format('0.0a')} views
              </Typography>
            </ChannelStats>

            <ChannelDescription variant="body2">
              {description.length > 100
                ? `${description.substring(0, 100)}...`
                : description}
            </ChannelDescription>
          </ChannelDetails>

          <SubscribeButtonContainer>
            <SubscribeButton
              channelId={channelId}
              channelTitle={channelTitle}
              channelThumbnailUrl={thumbnails?.default?.url || ''}
            />
          </SubscribeButtonContainer>
        </ChannelHeader>

        <Divider style={{ margin: '20px 0' }} />

        <StyledTabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
        >
          <StyledTab label="VIDEOS" />
          <StyledTab label="SHORTS" />
          <StyledTab label="ABOUT" />
        </StyledTabs>

        {tabValue === 0 && (
          <TabContent>
            {regularVideos.length > 0 ? (
              <VideosGrid>
                {regularVideos.map(video => (
                  <VideoGridItem key={video.id}>
                    <VideoCard video={video} showSubscribeButton={false} />
                  </VideoGridItem>
                ))}
              </VideosGrid>
            ) : (
              <EmptyState>
                <Typography variant="body1">No videos found</Typography>
              </EmptyState>
            )}
          </TabContent>
        )}

        {tabValue === 1 && (
          <TabContent>
            {shorts.length > 0 ? (
              <ShortsGrid>
                {shorts.map(video => (
                  <ShortGridItem key={video.id}>
                    <ShortCard video={video} />
                  </ShortGridItem>
                ))}
              </ShortsGrid>
            ) : (
              <EmptyState>
                <Typography variant="body1">No shorts found</Typography>
              </EmptyState>
            )}
          </TabContent>
        )}

        {tabValue === 2 && (
          <TabContent>
            <AboutSection>
              <Typography variant="h6">Description</Typography>
              <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                {description || 'No description available.'}
              </Typography>

              <StatisticsSection>
                <Typography variant="h6">Stats</Typography>
                <StatItem>
                  <Typography variant="body2" color="textSecondary">
                    Joined YouTube
                  </Typography>
                  <Typography variant="body1">
                    {new Date(channelInfo.snippet.publishedAt).toLocaleDateString()}
                  </Typography>
                </StatItem>
                <StatItem>
                  <Typography variant="body2" color="textSecondary">
                    Total views
                  </Typography>
                  <Typography variant="body1">
                    {numeral(viewCount).format('0,0')}
                  </Typography>
                </StatItem>
              </StatisticsSection>
            </AboutSection>
          </TabContent>
        )}
      </ChannelInfoSection>
    </ChannelPageContainer>
  );
};

// Styled components
const ChannelPageContainer = styled.div`
  padding: 0 0 40px;
  width: 100%;
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    padding: 0 24px 40px;
    max-width: 1280px;
    margin: 0 auto;
  }
`;

const ChannelBanner = styled.div`
  height: 100px;
  background-image: ${props => props.banner ? `url(${props.banner})` : 'linear-gradient(to right, #606c88, #3f4c6b)'};
  background-size: cover;
  background-position: center;
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    height: 200px;
    border-radius: 12px;
    margin-top: 20px;
  }
`;

const ChannelInfoSection = styled.div`
  padding: 16px;
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    padding: 20px 0;
  }
`;

const ChannelHeader = styled.div`
  display: flex;
  flex-direction: column;
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const ChannelAvatar = styled(Avatar)`
  && {
    width: 80px;
    height: 80px;
    margin-bottom: 16px;
    
    @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
      width: 120px;
      height: 120px;
      margin-right: 24px;
      margin-bottom: 0;
    }
  }
`;

const ChannelDetails = styled.div`
  flex: 1;
`;

const ChannelTitle = styled(Typography)`
  && {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }
`;

const ChannelStats = styled.div`
  margin-bottom: 12px;
  color: #606060;
`;

const ChannelDescription = styled(Typography)`
  color: #606060;
  margin-bottom: 16px;
`;

const SubscribeButtonContainer = styled.div`
  margin-top: 16px;
  
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    margin-top: 0;
    margin-left: 16px;
  }
`;

const StyledTabs = styled(Tabs)`
  && {
    margin-bottom: 24px;
  }
`;

const StyledTab = styled(Tab)`
  && {
    font-weight: 500;
  }
`;

const TabContent = styled.div`
  padding: 16px 0;
`;

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  
  @media screen and (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media screen and (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media screen and (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const VideoGridItem = styled.div``;

const AboutSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const StatisticsSection = styled.div`
  margin-top: 24px;
`;

const StatItem = styled.div`
  margin-top: 12px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

const ShortsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  
  @media screen and (min-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
`;

const ShortGridItem = styled.div`
  height: 100%;
`;

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
`;

export default ChannelPage; 