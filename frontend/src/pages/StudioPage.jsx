import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Tabs,
    Tab,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    CircularProgress,
    Grid,
    Card,
    CardContent
} from '@material-ui/core';
import styled from 'styled-components/macro';
import { Link, useHistory } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import PeopleIcon from '@material-ui/icons/People';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import authHeader from '../services/auth-header';
import {
    FULL_SIDEBAR_WIDTH,
    MINI_SIDEBAR_WIDTH,
    SHOW_FULL_SIDEBAR_BREAKPOINT,
    SHOW_MINI_SIDEBAR_BREAKPOINT,
    useMinWidthToShowFullSidebar,
    useShouldShowMiniSidebar
} from '../utils/utils';

const StudioPage = () => {
    const [tabValue, setTabValue] = useState(0);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const history = useHistory();
    const showFullSidebar = useMinWidthToShowFullSidebar();
    const showMiniSidebar = useShouldShowMiniSidebar();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);

                // Lấy token trực tiếp từ localStorage
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.token) {
                    setError('You need to be logged in to view your videos');
                    history.push('/login');
                    return;
                }

                const authToken = `Bearer ${user.token}`;
                console.log("Using auth token for studio page:", authToken);

                const response = await axios.get('/api/videos/me', {
                    headers: {
                        'Authorization': authToken
                    }
                });

                console.log("Fetched videos:", response.data);
                // Check if we have thumbnail URLs
                if (response.data && response.data.length > 0) {
                    response.data.forEach(video => {
                        console.log(`Video ID: ${video.videoId}, Thumbnail: ${video.thumbnailUrl}`);
                    });
                }

                setVideos(response.data);
            } catch (err) {
                setError('Failed to load videos. Please try again later.');
                console.error('Error fetching videos:', err);

                if (err.response && err.response.status === 401) {
                    console.log('Authentication error. Redirecting to login...');
                    localStorage.removeItem('user');
                    history.push('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [history]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleMenuOpen = (event, video) => {
        setAnchorEl(event.currentTarget);
        setSelectedVideo(video);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handlePublish = async () => {
        if (!selectedVideo) return;

        try {
            // Lấy token trực tiếp từ localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.token) {
                setError('You need to be logged in to publish videos');
                history.push('/login');
                return;
            }

            const authToken = `Bearer ${user.token}`;

            await axios.post(`/api/videos/${selectedVideo.videoId}/publish`, {}, {
                headers: {
                    'Authorization': authToken
                }
            });

            // Update the videos list
            setVideos(videos.map(video =>
                video.videoId === selectedVideo.videoId
                    ? { ...video, published: true }
                    : video
            ));
        } catch (error) {
            console.error('Error publishing video:', error);

            if (error.response && error.response.status === 401) {
                console.log('Authentication error. Redirecting to login...');
                localStorage.removeItem('user');
                history.push('/login');
            }
        }

        handleMenuClose();
    };

    const handleDelete = async () => {
        if (!selectedVideo) return;

        if (!window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
            handleMenuClose();
            return;
        }

        try {
            // Get token from localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.token) {
                setError('You need to be logged in to delete videos');
                history.push('/login');
                return;
            }

            const authToken = `Bearer ${user.token}`;

            await axios.delete(`/api/videos/${selectedVideo.videoId}`, {
                headers: {
                    'Authorization': authToken
                }
            });

            // Remove the deleted video from the list
            setVideos(videos.filter(video => video.videoId !== selectedVideo.videoId));

        } catch (error) {
            console.error('Error deleting video:', error);

            if (error.response && error.response.status === 401) {
                console.log('Authentication error. Redirecting to login...');
                localStorage.removeItem('user');
                history.push('/login');
            }
        }

        handleMenuClose();
    };

    const getFilteredVideos = () => {
        switch (tabValue) {
            case 0: // All videos
                return videos;
            case 1: // Published
                return videos.filter(video => video.published);
            case 2: // Drafts
                return videos.filter(video => !video.published);
            case 3: // Stats
                return []; // Tab Stats không hiển thị danh sách video
            default:
                return videos;
        }
    };

    // Khởi tạo dữ liệu thống kê từ danh sách video
    const generateStats = () => {
        // Tổng số lượt xem
        const totalViews = videos.reduce((sum, video) => sum + (video.viewCount || 0), 0);

        // Tổng số video & trạng thái
        const totalVideos = videos.length;
        const publishedVideos = videos.filter(video => video.published).length;
        const draftVideos = videos.filter(video => !video.published).length;

        // Phân bố theo trạng thái
        const statusData = [
            { name: 'Published', value: publishedVideos },
            { name: 'Draft', value: draftVideos }
        ];

        // Top 5 video có nhiều lượt xem nhất
        const topVideos = [...videos]
            .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
            .slice(0, 5);

        // Biểu đồ phân bố quyền riêng tư
        const privacyData = [
            {
                name: 'Public',
                value: videos.filter(v => v.privacy === 'public').length
            },
            {
                name: 'Unlisted',
                value: videos.filter(v => v.privacy === 'unlisted').length
            },
            {
                name: 'Private',
                value: videos.filter(v => v.privacy === 'private').length
            }
        ];

        return {
            totalViews,
            totalVideos,
            publishedVideos,
            draftVideos,
            statusData,
            topVideos,
            privacyData
        };
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

    // Get status badge
    const getStatusBadge = (video) => {
        if (!video.published) {
            return <Chip size="small" label="Draft" />;
        }

        if (video.processingStatus === 'pending' || video.processingStatus === 'processing') {
            return <Chip size="small" label="Processing" style={{ backgroundColor: '#ff9800', color: 'white' }} />;
        }

        if (video.privacy === 'private') {
            return <Chip size="small" label="Private" color="secondary" />;
        } else if (video.privacy === 'unlisted') {
            return <Chip size="small" label="Unlisted" style={{ backgroundColor: '#2196f3', color: 'white' }} />;
        } else {
            return <Chip size="small" label="Public" style={{ backgroundColor: '#4caf50', color: 'white' }} />;
        }
    };

    return (
        <StudioContainer showFullSidebar={showFullSidebar} showMiniSidebar={showMiniSidebar}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1">
                    Studio
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<VideoCallIcon />}
                    component={Link}
                    to="/upload"
                >
                    Upload Video
                </Button>
            </Box>

            <Paper style={{ marginBottom: 24 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label="All Videos" />
                    <Tab label="Published" />
                    <Tab label="Drafts" />
                    <Tab label="Stats" />
                </Tabs>
            </Paper>

            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Box my={4} textAlign="center">
                    <Typography color="error">{error}</Typography>
                </Box>
            ) : tabValue === 3 ? (
                // Hiển thị thống kê
                <StatsContainer>
                    <Grid container spacing={3}>
                        {/* Dashboard Cards - Thống kê tổng quan */}
                        <Grid item xs={12} md={3}>
                            <StatCard
                                title="Total Videos"
                                value={generateStats().totalVideos}
                                icon={<VideoLibraryIcon fontSize="large" style={{ color: '#4285F4' }} />}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <StatCard
                                title="Total Views"
                                value={formatViewCount(generateStats().totalViews)}
                                icon={<VisibilityIcon fontSize="large" style={{ color: '#34A853' }} />}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <StatCard
                                title="Published Videos"
                                value={generateStats().publishedVideos}
                                icon={<TrendingUpIcon fontSize="large" style={{ color: '#FBBC05' }} />}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <StatCard
                                title="Draft Videos"
                                value={generateStats().draftVideos}
                                icon={<EditIcon fontSize="large" style={{ color: '#EA4335' }} />}
                            />
                        </Grid>

                        {/* Biểu đồ trạng thái video */}
                        <Grid item xs={12} md={6}>
                            <Paper style={{ padding: 20, height: '100%' }}>
                                <Typography variant="h6" gutterBottom>Video Status Distribution</Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={generateStats().statusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            <Cell fill="#4caf50" />
                                            <Cell fill="#f44336" />
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        {/* Biểu đồ phân bố quyền riêng tư */}
                        <Grid item xs={12} md={6}>
                            <Paper style={{ padding: 20, height: '100%' }}>
                                <Typography variant="h6" gutterBottom>Privacy Distribution</Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={generateStats().privacyData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            <Cell fill="#4caf50" /> {/* Public */}
                                            <Cell fill="#2196f3" /> {/* Unlisted */}
                                            <Cell fill="#f44336" /> {/* Private */}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        {/* Top videos */}
                        <Grid item xs={12}>
                            <Paper style={{ padding: 20 }}>
                                <Typography variant="h6" gutterBottom>Top 5 Videos by Views</Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Video</TableCell>
                                                <TableCell align="right">Views</TableCell>
                                                <TableCell align="right">Date</TableCell>
                                                <TableCell align="right">Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {generateStats().topVideos.map((video) => (
                                                <TableRow key={video.videoId}>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center">
                                                            <Box
                                                                component="img"
                                                                src={video.thumbnailUrl ?
                                                                    `http://localhost:8080/api/media/thumbnail/${video.thumbnailUrl}` :
                                                                    'https://via.placeholder.com/480x360?text=Video'}
                                                                alt={video.title}
                                                                style={{
                                                                    width: 80,
                                                                    height: 45,
                                                                    borderRadius: 4,
                                                                    objectFit: 'cover',
                                                                    marginRight: 16
                                                                }}
                                                            />
                                                            <Typography variant="body2">{video.title}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">{formatViewCount(video.viewCount)}</TableCell>
                                                    <TableCell align="right">
                                                        {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {getStatusBadge(video)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                </StatsContainer>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Video</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Views</TableCell>
                                <TableCell align="right">Date</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getFilteredVideos().length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography variant="body1" style={{ margin: '16px 0' }}>
                                            No videos found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                getFilteredVideos().map((video) => (
                                    <TableRow key={video.videoId}>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <Box
                                                    component="img"
                                                    src={video.thumbnailUrl ?
                                                        `http://localhost:8080/api/media/thumbnail/${video.thumbnailUrl}` :
                                                        'https://i.ytimg.com/vi/hTWKbfoikeg/mqdefault.jpg'} // Default thumbnail
                                                    alt={video.title}
                                                    onError={(e) => {
                                                        console.error(`Failed to load thumbnail: ${video.thumbnailUrl}`);
                                                        // Sử dụng ảnh mặc định thay thế
                                                        e.target.src = 'https://i.ytimg.com/vi/hTWKbfoikeg/mqdefault.jpg';
                                                    }}
                                                    style={{
                                                        width: 120,
                                                        height: 68,
                                                        borderRadius: 4,
                                                        objectFit: 'cover',
                                                        backgroundColor: '#000',
                                                        marginRight: 16
                                                    }}
                                                />
                                                <Box>
                                                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                                                        {video.title}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="textSecondary"
                                                        style={{
                                                            display: '-webkit-box',
                                                            WebkitBoxOrient: 'vertical',
                                                            WebkitLineClamp: 2,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    >
                                                        {video.description}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(video)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatViewCount(video.viewCount)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                component={Link}
                                                to={`/custom-watch/${video.videoId}`}
                                                size="small"
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>

                                            <IconButton
                                                size="small"
                                                component={Link}
                                                to={`/studio/edit/${video.videoId}`}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>

                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuOpen(e, video)}
                                            >
                                                <MoreVertIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {selectedVideo && !selectedVideo.published && (
                    <MenuItem onClick={handlePublish}>
                        Publish
                    </MenuItem>
                )}
                <MenuItem onClick={handleDelete}>
                    <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
                    Delete
                </MenuItem>
            </Menu>
        </StudioContainer>
    );
};

const StudioContainer = styled.div`
  padding: 24px;
  margin-top: 64px;
  max-width: 1200px;
  margin-right: auto;
  
  /* Đảm bảo không đè lên sidebar */
  @media (max-width: ${SHOW_MINI_SIDEBAR_BREAKPOINT - 1}px) {
    /* Khi không có sidebar */
    margin-left: auto;
  }
  
  @media (min-width: ${SHOW_MINI_SIDEBAR_BREAKPOINT}px) and (max-width: ${SHOW_FULL_SIDEBAR_BREAKPOINT - 1}px) {
    /* Khi có mini sidebar */
    margin-left: ${MINI_SIDEBAR_WIDTH}px;
  }
  
  @media (min-width: ${SHOW_FULL_SIDEBAR_BREAKPOINT}px) {
    /* Khi có full sidebar */
    margin-left: ${props => props.showFullSidebar ? FULL_SIDEBAR_WIDTH : MINI_SIDEBAR_WIDTH}px;
  }
`;

const StatsContainer = styled.div`
  padding: 24px;
  margin-top: 64px;
  max-width: 1200px;
  margin-right: auto;
  
  /* Đảm bảo không đè lên sidebar */
  @media (max-width: ${SHOW_MINI_SIDEBAR_BREAKPOINT - 1}px) {
    /* Khi không có sidebar */
    margin-left: auto;
  }
  
  @media (min-width: ${SHOW_MINI_SIDEBAR_BREAKPOINT}px) and (max-width: ${SHOW_FULL_SIDEBAR_BREAKPOINT - 1}px) {
    /* Khi có mini sidebar */
    margin-left: ${MINI_SIDEBAR_WIDTH}px;
  }
  
  @media (min-width: ${SHOW_FULL_SIDEBAR_BREAKPOINT}px) {
    /* Khi có full sidebar */
    margin-left: ${props => props.showFullSidebar ? FULL_SIDEBAR_WIDTH : MINI_SIDEBAR_WIDTH}px;
  }
`;

const StatCard = ({ title, value, icon }) => (
    <Paper style={{ padding: 20, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
            {title}
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
            {icon}
        </Box>
        <Typography variant="h5" component="span">
            {value}
        </Typography>
    </Paper>
);

export default StudioPage; 