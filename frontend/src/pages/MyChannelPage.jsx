import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Typography, Avatar, Tabs, Tab, CircularProgress, Divider, Button, Box, Paper } from '@material-ui/core';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import EditIcon from '@material-ui/icons/Edit';
import VideoCard from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';
import { TWO_COL_MIN_WIDTH } from '../utils/utils';

const MyChannelPage = () => {
    const { currentUser } = useAuth();
    const history = useHistory();
    const [channelInfo, setChannelInfo] = useState(null);
    const [videos, setVideos] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Phân loại video ngắn (shorts - dưới 1 phút) và video thường
    const shortVideos = videos.filter(video => video.duration && video.duration < 60);
    const regularVideos = videos.filter(video => !video.duration || video.duration >= 60);

    useEffect(() => {
        const fetchMyChannelData = async () => {
            if (!currentUser) {
                history.push('/login');
                return;
            }

            try {
                setLoading(true);

                // Lấy token từ localStorage
                const authToken = `Bearer ${currentUser.token}`;

                // Gọi API để lấy thông tin đầy đủ của người dùng
                try {
                    const userResponse = await axios.get(`/api/users/${currentUser.id}`, {
                        headers: {
                            Authorization: authToken
                        }
                    });

                    if (userResponse.data) {
                        console.log("Fetched user data:", userResponse.data);
                        // Xây dựng đối tượng channelInfo với thông tin đầy đủ từ API
                        const userData = {
                            id: userResponse.data.id,
                            username: userResponse.data.username,
                            name: userResponse.data.username,
                            email: userResponse.data.email,
                            profileImage: userResponse.data.profileImageUrl ?
                                `http://localhost:8080${userResponse.data.profileImageUrl}` : null,
                            bannerImage: userResponse.data.bannerImageUrl ?
                                `http://localhost:8080${userResponse.data.bannerImageUrl}` : null,
                            subscriberCount: userResponse.data.subscriberCount || 0,
                            description: userResponse.data.channelDescription || '',
                            location: userResponse.data.location || '',
                            website: userResponse.data.website || '',
                            createdAt: userResponse.data.createdAt || new Date().toISOString()
                        };

                        setChannelInfo(userData);
                    }
                } catch (userError) {
                    console.error('Error fetching user data:', userError);
                    // Nếu lỗi khi lấy thông tin người dùng, sử dụng thông tin từ localStorage
                    console.log("Falling back to localStorage user data");
                    const userData = {
                        id: currentUser.id,
                        username: currentUser.username,
                        name: currentUser.name || currentUser.username,
                        email: currentUser.email,
                        profileImage: currentUser.profileImage || null,
                        subscriberCount: 0,
                        description: currentUser.description || '',
                        createdAt: currentUser.createdAt || new Date().toISOString()
                    };
                    setChannelInfo(userData);
                }

                // Lấy video của người dùng
                try {
                    const videosResponse = await axios.get(`/api/videos/me`, {
                        headers: {
                            Authorization: authToken
                        }
                    });

                    if (videosResponse.data) {
                        setVideos(videosResponse.data);
                        console.log("Fetched videos:", videosResponse.data);
                    }
                } catch (videoError) {
                    console.error('Error fetching videos:', videoError);
                    // Không set lỗi toàn trang nếu chỉ videos bị lỗi
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching channel data:', error);
                setError('Failed to load channel data. Please try again later.');
                setLoading(false);
            }
        };

        fetchMyChannelData();
    }, [currentUser, history]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleEditProfile = () => {
        // Chuyển đến trang edit channel
        history.push('/edit-channel');
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
                <Typography variant="h5" color="error">{error}</Typography>
            </ErrorContainer>
        );
    }

    if (!channelInfo) {
        return (
            <ErrorContainer>
                <Typography variant="h5">Channel information not available</Typography>
            </ErrorContainer>
        );
    }

    return (
        <ChannelPageContainer>
            {/* Banner kênh - hiện đầy đủ */}
            {channelInfo.bannerImage ? (
                <ChannelBanner style={{ backgroundImage: `url(${channelInfo.bannerImage})` }} />
            ) : (
                <ChannelBanner />
            )}

            <ChannelInfoSection>
                {/* Phần thông tin kênh - được đẩy xuống dưới banner */}
                <ChannelInfoContainer>
                    <ChannelAvatarSection>
                        <ChannelAvatar
                            src={channelInfo.profileImage || "https://via.placeholder.com/48x48?text=User"}
                            alt={channelInfo.name}
                        />
                    </ChannelAvatarSection>

                    <ChannelDetails>
                        <ChannelTitle variant="h1">{channelInfo.name}</ChannelTitle>
                        <ChannelStats>
                            <Typography variant="body2">
                                {numeral(channelInfo.subscriberCount || 0).format('0,0')} subscribers • {numeral(videos.length || 0).format('0,0')} videos
                            </Typography>
                        </ChannelStats>

                        {channelInfo.description && (
                            <ChannelDescription variant="body2">
                                {channelInfo.description}
                            </ChannelDescription>
                        )}

                        <ChannelActions>
                            <EditProfileButton
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={handleEditProfile}
                                size="medium"
                            >
                                Edit Channel
                            </EditProfileButton>
                        </ChannelActions>
                    </ChannelDetails>
                </ChannelInfoContainer>

                <Divider style={{ margin: '20px 0' }} />

                <StyledTabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <StyledTab label="VIDEOS" />
                    <StyledTab label="SHORTS" />
                    <StyledTab label="ABOUT" />
                    <StyledTab label="CHANNELS" />
                </StyledTabs>

                {tabValue === 0 && (
                    <TabContent>
                        {regularVideos.length > 0 ? (
                            <VideosGrid>
                                {regularVideos.map(video => (
                                    <VideoGridItem key={video.id || video.videoId}>
                                        <VideoCard video={video} />
                                    </VideoGridItem>
                                ))}
                            </VideosGrid>
                        ) : (
                            <EmptyState>
                                <Typography variant="body1">You haven't uploaded any regular videos yet</Typography>
                                <Box mt={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => history.push('/upload')}
                                    >
                                        Upload a Video
                                    </Button>
                                </Box>
                            </EmptyState>
                        )}
                    </TabContent>
                )}

                {tabValue === 1 && (
                    <TabContent>
                        {shortVideos.length > 0 ? (
                            <ShortsGrid>
                                {shortVideos.map(video => (
                                    <ShortVideoItem key={video.id || video.videoId}>
                                        <VideoCard video={video} />
                                    </ShortVideoItem>
                                ))}
                            </ShortsGrid>
                        ) : (
                            <EmptyState>
                                <Typography variant="body1">You haven't uploaded any short videos yet</Typography>
                                <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
                                    Short videos are less than 1 minute long
                                </Typography>
                                <Box mt={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => history.push('/upload')}
                                    >
                                        Upload a Short
                                    </Button>
                                </Box>
                            </EmptyState>
                        )}
                    </TabContent>
                )}

                {tabValue === 2 && (
                    <TabContent>
                        <AboutSection>
                            <Paper elevation={0} style={{ padding: 20, marginBottom: 20 }}>
                                <Typography variant="h6" gutterBottom>Description</Typography>
                                <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                                    {channelInfo.description || 'No description available. Add one by editing your channel profile.'}
                                </Typography>
                            </Paper>

                            <Paper elevation={0} style={{ padding: 20 }}>
                                <Typography variant="h6" gutterBottom>Stats</Typography>
                                <StatItem>
                                    <Typography variant="body2" color="textSecondary">
                                        Joined YouTube
                                    </Typography>
                                    <Typography variant="body1">
                                        {channelInfo.createdAt ? new Date(channelInfo.createdAt).toLocaleDateString() : 'Unknown'}
                                    </Typography>
                                </StatItem>
                                <StatItem>
                                    <Typography variant="body2" color="textSecondary">
                                        Total subscribers
                                    </Typography>
                                    <Typography variant="body1">
                                        {numeral(channelInfo.subscriberCount || 0).format('0,0')}
                                    </Typography>
                                </StatItem>
                                <StatItem>
                                    <Typography variant="body2" color="textSecondary">
                                        Total videos
                                    </Typography>
                                    <Typography variant="body1">
                                        {numeral(videos.length || 0).format('0,0')}
                                    </Typography>
                                </StatItem>
                            </Paper>
                        </AboutSection>
                    </TabContent>
                )}

                {tabValue === 3 && (
                    <TabContent>
                        <EmptyState>
                            <Typography variant="body1">No channels to display</Typography>
                        </EmptyState>
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
`;

const ChannelBanner = styled.div`
  height: 160px;
  background-color: #e9e9e9;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  @media (min-width: ${TWO_COL_MIN_WIDTH}px) {
    height: 200px;
  }
`;

const ChannelInfoSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ChannelInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 20px;
  padding: 0 24px;
`;

const ChannelAvatarSection = styled.div`
  margin-right: 24px;
  display: flex;
  align-items: flex-start;
  padding-top: 10px;
`;

const ChannelAvatar = styled(Avatar)`
  width: 120px !important;
  height: 120px !important;
  border-radius: 50%;
  
  @media (min-width: ${TWO_COL_MIN_WIDTH}px) {
    width: 160px !important;
    height: 160px !important;
  }
`;

const ChannelDetails = styled.div`
  text-align: left;
  flex-grow: 1;
`;

const ChannelTitle = styled(Typography)`
  && {
    font-size: 1.4rem;
    font-weight: 500;
    margin-bottom: 4px;
    
    @media (min-width: ${TWO_COL_MIN_WIDTH}px) {
      font-size: 1.6rem;
    }
  }
`;

const ChannelStats = styled.div`
  margin-bottom: 4px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.9rem;
`;

const ChannelActions = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

const ChannelDescription = styled(Typography)`
  margin-bottom: 12px;
  max-width: 800px;
  white-space: pre-line;
  line-height: 1.5;
  font-size: 0.9rem;
  color: #606060;
`;

const EditProfileButton = styled(Button)`
  margin-top: 0;
  font-weight: 500;
  padding: 6px 12px;
  font-size: 0.8rem;
  text-transform: none;
  background-color: #cc0000;
  color: white;
  
  &:hover {
    background-color: #aa0000;
  }
`;

const StyledTabs = styled(Tabs)`
  && {
    margin-bottom: 16px;
    border-bottom: 1px solid #e0e0e0;
  }
`;

const StyledTab = styled(Tab)`
  && {
    font-weight: 500;
    font-size: 0.9rem;
    min-width: 80px;
    padding: 0 16px;
    height: 48px;
  }
`;

const TabContent = styled.div`
  min-height: 400px;
`;

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
`;

const VideoGridItem = styled.div`
  min-width: 240px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

const AboutSection = styled.div`
  max-width: 800px;
`;

const StatItem = styled.div`
  margin-bottom: 16px;
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
  text-align: center;
`;

const ShortsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const ShortVideoItem = styled.div`
  min-width: 180px;
  
  /* Điều chỉnh tỷ lệ khung hình cho Shorts (dạng dọc 9:16) */
  .MuiCardMedia-root {
    height: 320px !important;
    border-radius: 8px;
  }
  
  /* Thêm biểu tượng shorts */
  .MuiCard-root {
    position: relative;
  }
  
  .MuiCard-root::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    width: 24px;
    height: 24px;
    background-color: red;
    border-radius: 50%;
    z-index: 2;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M10 8l6 4-6 4V8z"/></svg>');
    background-size: 14px;
    background-position: center;
    background-repeat: no-repeat;
  }
`;

export default MyChannelPage; 