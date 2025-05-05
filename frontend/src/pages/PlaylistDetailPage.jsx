import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
    Typography,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Avatar,
    IconButton,
    CircularProgress,
    Divider
} from '@material-ui/core';
import {
    PlayArrow as PlayIcon,
    Delete as DeleteIcon,
    ArrowBack as ArrowBackIcon,
    VideoLibrary as VideoLibraryIcon
} from '@material-ui/icons';
import PlaylistService from '../services/playlist.service';
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

const PlaylistDetailPage = () => {
    const { playlistId } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const history = useHistory();
    const { isLoggedIn } = useAuth();
    const showFullSidebar = useMinWidthToShowFullSidebar();
    const showMiniSidebar = useShouldShowMiniSidebar();

    useEffect(() => {
        if (playlistId) {
            fetchPlaylistDetails();
        }
    }, [playlistId]);

    const fetchPlaylistDetails = async () => {
        try {
            setLoading(true);

            // Fetch playlist details
            const playlistData = await PlaylistService.getPlaylistById(playlistId);
            console.log("Playlist data:", playlistData);

            // Fetch playlist items
            const itemsData = await PlaylistService.getPlaylistItems(playlistId);
            console.log("Playlist items:", itemsData);
            setItems(itemsData);

            // Cập nhật lại videoCount dựa trên số lượng items thực tế
            setPlaylist({
                ...playlistData,
                videoCount: itemsData.length
            });

            setError(null);
        } catch (err) {
            console.error('Error fetching playlist details:', err);
            setError('Không thể tải playlist. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToPlaylists = () => {
        history.push('/playlists');
    };

    const handlePlayVideo = (videoId) => {
        history.push(`/watch/${videoId}`);
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await PlaylistService.removeFromPlaylist(playlistId, itemId);
            // Cập nhật danh sách video
            const updatedItems = items.filter(item => item.id !== itemId);
            setItems(updatedItems);

            // Cập nhật số lượng video dựa trên số lượng thực tế còn lại
            if (playlist) {
                setPlaylist({
                    ...playlist,
                    videoCount: updatedItems.length
                });
            }
        } catch (err) {
            console.error('Error removing item from playlist:', err);
        }
    };

    if (loading) {
        return (
            <PlaylistContainer showFullSidebar={showFullSidebar} showMiniSidebar={showMiniSidebar}>
                <LoadingContainer>
                    <CircularProgress />
                </LoadingContainer>
            </PlaylistContainer>
        );
    }

    if (error) {
        return (
            <PlaylistContainer showFullSidebar={showFullSidebar} showMiniSidebar={showMiniSidebar}>
                <ErrorContainer>
                    <Typography color="error">{error}</Typography>
                    <Button onClick={fetchPlaylistDetails} style={{ marginTop: 16 }}>
                        Thử lại
                    </Button>
                </ErrorContainer>
            </PlaylistContainer>
        );
    }

    if (!playlist) {
        return (
            <PlaylistContainer showFullSidebar={showFullSidebar} showMiniSidebar={showMiniSidebar}>
                <ErrorContainer>
                    <Typography>Playlist không tồn tại hoặc bạn không có quyền truy cập.</Typography>
                    <Button onClick={handleBackToPlaylists} style={{ marginTop: 16 }}>
                        Quay lại
                    </Button>
                </ErrorContainer>
            </PlaylistContainer>
        );
    }

    return (
        <PlaylistContainer showFullSidebar={showFullSidebar} showMiniSidebar={showMiniSidebar}>
            <BackButton onClick={handleBackToPlaylists}>
                <ArrowBackIcon style={{ marginRight: 8 }} />
                Quay lại danh sách playlist
            </BackButton>

            <PlaylistHeader>
                <PlaylistThumbnail>
                    {playlist.thumbnailUrl ? (
                        <img src={playlist.thumbnailUrl} alt={playlist.name} />
                    ) : (
                        <NoThumbnail>
                            <VideoLibraryIcon style={{ fontSize: 48 }} />
                        </NoThumbnail>
                    )}
                </PlaylistThumbnail>
                <PlaylistInfo>
                    <Typography variant="h4" component="h1">
                        {playlist.name}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        {playlist.videoCount} video
                    </Typography>
                    <Typography variant="body2">
                        Chế độ: {playlist.privacy === 'private' ? 'Riêng tư' :
                            playlist.privacy === 'unlisted' ? 'Không công khai' : 'Công khai'}
                    </Typography>
                    {playlist.description && (
                        <Typography variant="body1" style={{ marginTop: 16 }}>
                            {playlist.description}
                        </Typography>
                    )}
                </PlaylistInfo>
            </PlaylistHeader>

            <Divider style={{ margin: '24px 0' }} />

            {items.length === 0 ? (
                <EmptyContainer>
                    <VideoLibraryIcon style={{ fontSize: 64, color: '#aaa', marginBottom: 16 }} />
                    <Typography variant="h6" gutterBottom>
                        Playlist này chưa có video nào
                    </Typography>
                    <Typography variant="body1">
                        Thêm video vào playlist này khi bạn xem video
                    </Typography>
                </EmptyContainer>
            ) : (
                <List>
                    {items.map((item, index) => (
                        <React.Fragment key={item.id}>
                            {index > 0 && <Divider variant="inset" component="li" />}
                            <ListItem button onClick={() => handlePlayVideo(item.videoId)}>
                                <ListItemAvatar>
                                    <ThumbnailAvatar>
                                        <img src={item.thumbnailUrl} alt={item.title} />
                                        <VideoPosition>{index + 1}</VideoPosition>
                                    </ThumbnailAvatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.title}
                                    secondary={
                                        <>
                                            {item.channelTitle}<br />
                                            {item.duration && `${getFormattedDurationString(item.duration * 1000)} • `}
                                            Thêm {moment(item.addedAt).fromNow()}
                                        </>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <PlayButton
                                        edge="end"
                                        aria-label="play"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePlayVideo(item.videoId);
                                        }}
                                    >
                                        <PlayIcon />
                                    </PlayButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveItem(item.id);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </React.Fragment>
                    ))}
                </List>
            )}
        </PlaylistContainer>
    );
};

// Styled components
const PlaylistContainer = styled.div`
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

const BackButton = styled(Button)`
  && {
    margin-bottom: 24px;
  }
`;

const PlaylistHeader = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: 600px) {
    flex-direction: row;
  }
`;

const PlaylistThumbnail = styled.div`
  width: 100%;
  max-width: 240px;
  height: 135px;
  margin-bottom: 16px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (min-width: 600px) {
    margin-bottom: 0;
    margin-right: 24px;
  }
`;

const NoThumbnail = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
`;

const PlaylistInfo = styled.div`
  flex: 1;
`;

const ThumbnailAvatar = styled.div`
  position: relative;
  width: 120px;
  height: 68px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 16px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const VideoPosition = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 12px;
  padding: 1px 4px;
  border-radius: 2px;
`;

const PlayButton = styled(IconButton)`
  && {
    color: #f44336;
    margin-right: 8px;
  }
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

export default PlaylistDetailPage; 