import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
    Typography,
    CircularProgress,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Divider,
    Box,
    Snackbar
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import {
    PlayArrow as PlayIcon,
    Delete as DeleteIcon,
    QueryBuilder as QueryBuilderIcon
} from '@material-ui/icons';
import WatchLaterService from '../services/watchlater.service';
import { useAuth } from '../context/AuthContext';
import {
    FULL_SIDEBAR_WIDTH,
    MINI_SIDEBAR_WIDTH,
    SHOW_FULL_SIDEBAR_BREAKPOINT,
    SHOW_MINI_SIDEBAR_BREAKPOINT,
    useMinWidthToShowFullSidebar,
    useShouldShowMiniSidebar,
    getFormattedDurationString
} from '../utils/utils';
import moment from 'moment';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const WatchLaterPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const history = useHistory();
    const { isLoggedIn } = useAuth();
    const showFullSidebar = useMinWidthToShowFullSidebar();
    const showMiniSidebar = useShouldShowMiniSidebar();

    useEffect(() => {
        fetchWatchLaterItems();
    }, [isLoggedIn]);

    const fetchWatchLaterItems = async () => {
        if (!isLoggedIn) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await WatchLaterService.getWatchLaterItems();
            setItems(data);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách xem sau. Vui lòng thử lại sau.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayVideo = (videoId) => {
        history.push(`/watch/${videoId}`);
    };

    const handleRemoveFromWatchLater = async (videoId) => {
        try {
            await WatchLaterService.removeFromWatchLater(videoId);
            setItems(items.filter(item => item.videoId !== videoId));
            setNotification({
                open: true,
                message: 'Đã xóa video khỏi danh sách xem sau',
                severity: 'success'
            });
        } catch (err) {
            console.error('Error removing from watch later:', err);
            setNotification({
                open: true,
                message: 'Không thể xóa video. Vui lòng thử lại sau.',
                severity: 'error'
            });
        }
    };

    const handleCloseNotification = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotification({ ...notification, open: false });
    };

    if (!isLoggedIn) {
        return (
            <WatchLaterContainer showFullSidebar={showFullSidebar} showMiniSidebar={showMiniSidebar}>
                <NotLoggedInContainer>
                    <QueryBuilderIcon style={{ fontSize: 64, color: '#aaa', marginBottom: 16 }} />
                    <Typography variant="h5" gutterBottom>
                        Đăng nhập để xem danh sách Xem sau
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Lưu video để xem sau khi đã đăng nhập vào tài khoản
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => history.push('/login')}
                    >
                        Đăng nhập
                    </Button>
                </NotLoggedInContainer>
            </WatchLaterContainer>
        );
    }

    return (
        <WatchLaterContainer showFullSidebar={showFullSidebar} showMiniSidebar={showMiniSidebar}>
            <HeaderContainer>
                <Typography variant="h5" component="h1">
                    Xem sau
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {items.length} video
                </Typography>
            </HeaderContainer>

            {loading ? (
                <LoadingContainer>
                    <CircularProgress />
                </LoadingContainer>
            ) : error ? (
                <ErrorContainer>
                    <Typography color="error">{error}</Typography>
                    <Button onClick={fetchWatchLaterItems} style={{ marginTop: 16 }}>
                        Thử lại
                    </Button>
                </ErrorContainer>
            ) : items.length === 0 ? (
                <EmptyContainer>
                    <QueryBuilderIcon style={{ fontSize: 64, color: '#aaa', marginBottom: 16 }} />
                    <Typography variant="h6" gutterBottom>
                        Danh sách Xem sau của bạn trống
                    </Typography>
                    <Typography variant="body1">
                        Thêm video vào danh sách này khi bạn xem video mà muốn lưu lại để xem sau
                    </Typography>
                </EmptyContainer>
            ) : (
                <List>
                    {items.map((item, index) => (
                        <React.Fragment key={item.id}>
                            {index > 0 && <Divider component="li" />}
                            <ListItem button onClick={() => handlePlayVideo(item.videoId)}>
                                <ListItemAvatar>
                                    <ThumbnailContainer>
                                        <img src={item.thumbnailUrl} alt={item.title} />
                                        {item.duration && (
                                            <Duration>
                                                {getFormattedDurationString(item.duration * 1000)}
                                            </Duration>
                                        )}
                                    </ThumbnailContainer>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.title}
                                    secondary={
                                        <>
                                            {item.channelTitle}<br />
                                            Thêm vào {moment(item.addedAt).fromNow()}
                                        </>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <ActionButtons>
                                        <IconButton edge="end" onClick={(e) => {
                                            e.stopPropagation();
                                            handlePlayVideo(item.videoId);
                                        }}>
                                            <PlayIcon />
                                        </IconButton>
                                        <IconButton edge="end" onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveFromWatchLater(item.videoId);
                                        }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ActionButtons>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </React.Fragment>
                    ))}
                </List>
            )}

            <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
                <Alert onClose={handleCloseNotification} severity={notification.severity}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </WatchLaterContainer>
    );
};

// Styled components
const WatchLaterContainer = styled.div`
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

const HeaderContainer = styled.div`
  margin-bottom: 24px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 24px;
`;

const EmptyContainer = styled.div`
  text-align: center;
  padding: 64px;
  background-color: #f9f9f9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NotLoggedInContainer = styled.div`
  text-align: center;
  padding: 64px;
  background-color: #f9f9f9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ThumbnailContainer = styled.div`
  position: relative;
  width: 160px;
  height: 90px;
  margin-right: 16px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 600px) {
    width: 120px;
    height: 68px;
  }
`;

const Duration = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 12px;
  padding: 1px 4px;
  border-radius: 2px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export default WatchLaterPage; 