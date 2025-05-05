import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActionArea,
    CircularProgress,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar
} from '@material-ui/core';
import {
    Add as AddIcon,
    PlaylistPlay as PlaylistIcon,
    MoreVert as MoreVertIcon,
    Delete as DeleteIcon
} from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';
import PlaylistDialog from '../components/Playlists/PlaylistDialog';
import PlaylistService from '../services/playlist.service';
import { useAuth } from '../context/AuthContext';
import {
    FULL_SIDEBAR_WIDTH,
    MINI_SIDEBAR_WIDTH,
    SHOW_FULL_SIDEBAR_BREAKPOINT,
    SHOW_MINI_SIDEBAR_BREAKPOINT,
    useMinWidthToShowFullSidebar,
    useShouldShowMiniSidebar
} from '../utils/utils';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const PlaylistsPage = () => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const history = useHistory();
    const { isLoggedIn, user } = useAuth();
    const showFullSidebar = useMinWidthToShowFullSidebar();
    const showMiniSidebar = useShouldShowMiniSidebar();

    useEffect(() => {
        fetchPlaylists();
    }, [isLoggedIn]);

    const fetchPlaylists = async () => {
        if (!isLoggedIn) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            let data = await PlaylistService.getPlaylists();

            // Cập nhật số lượng video thực tế cho mỗi playlist
            const updatedPlaylists = await Promise.all(data.map(async (playlist) => {
                try {
                    const actualCount = await PlaylistService.getPlaylistItemCount(playlist.id);
                    return { ...playlist, videoCount: actualCount };
                } catch (err) {
                    console.error(`Error getting item count for playlist ${playlist.id}:`, err);
                    return playlist;
                }
            }));

            setPlaylists(updatedPlaylists);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách playlist. Vui lòng thử lại sau.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePlaylist = (playlist) => {
        setPlaylists([playlist, ...playlists]);
        setNotification({
            open: true,
            message: 'Đã tạo playlist mới thành công',
            severity: 'success'
        });
    };

    const handleOpenMenu = (event, playlistId) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedPlaylistId(playlistId);
        console.log("Selected playlist ID for menu:", playlistId);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedPlaylistId(null);
    };

    const handleOpenPlaylist = (playlistId) => {
        history.push(`/playlist/${playlistId}`);
    };

    const handleConfirmDeleteOpen = () => {
        const playlistId = selectedPlaylistId;
        console.log("Opening delete confirmation for playlist ID:", playlistId);
        handleCloseMenu();
        setSelectedPlaylistId(playlistId);
        setConfirmDeleteOpen(true);
    };

    const handleConfirmDeleteClose = () => {
        setConfirmDeleteOpen(false);
    };

    const handleDeletePlaylist = async () => {
        if (!selectedPlaylistId) {
            console.error("Attempted to delete a playlist with no ID");
            setNotification({
                open: true,
                message: 'Không thể xóa playlist: ID không hợp lệ',
                severity: 'error'
            });
            setConfirmDeleteOpen(false);
            return;
        }

        try {
            console.log("Deleting playlist with ID:", selectedPlaylistId);
            await PlaylistService.deletePlaylist(selectedPlaylistId);
            setPlaylists(playlists.filter(p => p.id !== selectedPlaylistId));
            setNotification({
                open: true,
                message: 'Playlist đã được xóa thành công',
                severity: 'success'
            });
        } catch (err) {
            console.error('Error deleting playlist:', err);
            setNotification({
                open: true,
                message: 'Không thể xóa playlist. Vui lòng thử lại sau.',
                severity: 'error'
            });
        } finally {
            setConfirmDeleteOpen(false);
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
            <PlaylistsContainer showFullSidebar={showFullSidebar} showMiniSidebar={showMiniSidebar}>
                <NotLoggedInContainer>
                    <PlaylistIcon style={{ fontSize: 64, color: '#aaa', marginBottom: 16 }} />
                    <Typography variant="h5" gutterBottom>
                        Đăng nhập để xem playlist của bạn
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Tạo playlist để lưu và tổ chức các video bạn thích
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => history.push('/login')}
                    >
                        Đăng nhập
                    </Button>
                </NotLoggedInContainer>
            </PlaylistsContainer>
        );
    }

    return (
        <PlaylistsContainer showFullSidebar={showFullSidebar} showMiniSidebar={showMiniSidebar}>
            <div style={{ marginBottom: 24 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Playlist của bạn
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setDialogOpen(true)}
                >
                    Tạo playlist mới
                </Button>
            </div>

            {loading ? (
                <LoadingContainer>
                    <CircularProgress />
                </LoadingContainer>
            ) : error ? (
                <ErrorContainer>
                    <Typography color="error">{error}</Typography>
                    <Button onClick={fetchPlaylists} style={{ marginTop: 16 }}>
                        Thử lại
                    </Button>
                </ErrorContainer>
            ) : playlists.length === 0 ? (
                <EmptyContainer>
                    <PlaylistIcon style={{ fontSize: 64, color: '#aaa', marginBottom: 16 }} />
                    <Typography variant="h6" gutterBottom>
                        Bạn chưa có playlist nào
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Tạo playlist để lưu và tổ chức các video bạn thích
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setDialogOpen(true)}
                    >
                        Tạo playlist mới
                    </Button>
                </EmptyContainer>
            ) : (
                <Grid container spacing={3}>
                    {playlists.map(playlist => (
                        <Grid item key={playlist.id} xs={12} sm={6} md={4} lg={3}>
                            <PlaylistCard>
                                <CardActionArea onClick={() => handleOpenPlaylist(playlist.id)}>
                                    <PlaylistCardMedia
                                        image={playlist.thumbnailUrl || 'https://via.placeholder.com/480x360?text=No+Thumbnail'}
                                    >
                                        <PlaylistVideoCount>
                                            <Typography variant="body2">{playlist.videoCount} video</Typography>
                                        </PlaylistVideoCount>
                                    </PlaylistCardMedia>
                                    <CardContent>
                                        <Typography variant="h6" component="h2" noWrap>
                                            {playlist.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {playlist.privacy === 'private' ? 'Riêng tư' :
                                                playlist.privacy === 'unlisted' ? 'Không công khai' : 'Công khai'}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions onClick={(e) => e.stopPropagation()}>
                                    <IconButton
                                        aria-label="options"
                                        onClick={(e) => handleOpenMenu(e, playlist.id)}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </CardActions>
                            </PlaylistCard>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Dialog tạo playlist mới */}
            <PlaylistDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSuccess={handleCreatePlaylist}
            />

            {/* Menu ngữ cảnh cho playlist */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={() => {
                    handleOpenPlaylist(selectedPlaylistId);
                    handleCloseMenu();
                }}>
                    Mở playlist
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleConfirmDeleteOpen} style={{ color: 'red' }}>
                    <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
                    Xóa playlist
                </MenuItem>
            </Menu>

            {/* Dialog xác nhận xóa playlist */}
            <Dialog
                open={confirmDeleteOpen}
                onClose={handleConfirmDeleteClose}
            >
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa playlist này? Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDeleteClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleDeletePlaylist} color="secondary">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Thông báo */}
            <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
                <Alert onClose={handleCloseNotification} severity={notification.severity}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </PlaylistsContainer>
    );
};

// Styled components
const PlaylistsContainer = styled.div`
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

const PlaylistCard = styled(Card)`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const PlaylistCardMedia = styled.div`
  position: relative;
  height: 0;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
`;

const PlaylistVideoCount = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
`;

const CardActions = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
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

export default PlaylistsPage; 