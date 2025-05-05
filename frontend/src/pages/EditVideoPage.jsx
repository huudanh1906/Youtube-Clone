import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Box,
    CircularProgress,
    Divider,
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import styled from 'styled-components/macro';
import axios from 'axios';

const EditVideoPage = () => {
    const { videoId } = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [video, setVideo] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        privacy: 'public',
        category: 'entertainment',
        tags: ''
    });

    useEffect(() => {
        const fetchVideoDetails = async () => {
            try {
                setLoading(true);
                // Lấy token từ localStorage
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.token) {
                    setError('You need to be logged in to edit videos');
                    history.push('/login');
                    return;
                }

                const authToken = `Bearer ${user.token}`;

                // Lấy thông tin video
                const response = await axios.get(`/api/videos/${videoId}`, {
                    headers: {
                        'Authorization': authToken
                    }
                });

                const videoData = response.data;
                console.log('Fetched video data:', videoData);

                setVideo(videoData);

                // Khởi tạo form với thông tin video
                setFormData({
                    title: videoData.title || '',
                    description: videoData.description || '',
                    privacy: videoData.privacy || 'public',
                    category: videoData.category || 'entertainment',
                    tags: videoData.tags ? videoData.tags.join(', ') : ''
                });

                // Hiển thị thumbnail nếu có
                if (videoData.thumbnailUrl) {
                    if (videoData.thumbnailUrl.startsWith('http')) {
                        setThumbnailPreview(videoData.thumbnailUrl);
                    } else {
                        setThumbnailPreview(`http://localhost:8080/api/media/thumbnail/${videoData.thumbnailUrl}`);
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching video:', err);
                setError('Failed to load video. Please try again later.');
                setLoading(false);

                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('user');
                    history.push('/login');
                }
            }
        };

        fetchVideoDetails();
    }, [videoId, history]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.token) {
            setError('You need to be logged in to edit videos');
            history.push('/login');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const authToken = `Bearer ${user.token}`;
            console.log('Starting video update with form data:', formData);

            // Chuẩn bị dữ liệu để gửi lên API
            const apiFormData = {
                title: formData.title,
                description: formData.description,
                privacy: formData.privacy,
                category: formData.category,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
            };

            // Cập nhật thông tin video
            await axios.put(`/api/videos/${videoId}`, apiFormData, {
                headers: {
                    'Authorization': authToken,
                    'Content-Type': 'application/json'
                }
            });

            // Upload thumbnail mới nếu có
            if (thumbnailFile) {
                const thumbnailFormData = new FormData();
                thumbnailFormData.append('file', thumbnailFile);

                await axios.post(`/api/videos/${videoId}/thumbnail`, thumbnailFormData, {
                    headers: {
                        'Authorization': authToken,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            setSuccess(true);
            setTimeout(() => {
                history.push('/studio');
            }, 2000);
        } catch (err) {
            console.error('Error updating video:', err);
            let errorMessage = 'Failed to update video. Please try again.';

            if (err.response) {
                console.error('Error response data:', err.response.data);

                if (err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                }

                if (err.response.status === 401) {
                    localStorage.removeItem('user');
                    history.push('/login');
                }
            }

            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        history.push('/studio');
    };

    const handlePreview = () => {
        window.open(`/custom-watch/${videoId}`, '_blank');
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.token) {
                setError('You need to be logged in to delete videos');
                history.push('/login');
                return;
            }

            const authToken = `Bearer ${user.token}`;

            await axios.delete(`/api/videos/${videoId}`, {
                headers: {
                    'Authorization': authToken
                }
            });

            // Chuyển về trang studio sau khi xóa
            history.push('/studio');
        } catch (error) {
            console.error('Error deleting video:', error);
            setError('Failed to delete video. Please try again.');

            if (error.response && error.response.status === 401) {
                localStorage.removeItem('user');
                history.push('/login');
            }
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md" style={{ marginTop: 24, marginBottom: 24 }}>
                <Paper style={{ padding: 24 }}>
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" my={4}>
                        <CircularProgress size={60} />
                        <Typography variant="h6" style={{ marginTop: 16 }}>
                            Loading video information...
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" style={{ marginTop: 24, marginBottom: 24 }}>
            <Paper style={{ padding: 24 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" gutterBottom>
                        Edit Video
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<VisibilityIcon />}
                        onClick={handlePreview}
                    >
                        Preview
                    </Button>
                </Box>
                <Divider style={{ marginBottom: 24 }} />

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Thumbnail */}
                        <Grid item xs={12} sm={4}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="subtitle1" gutterBottom align="center">
                                    Thumbnail
                                </Typography>
                                <ThumbnailContainer>
                                    <ThumbnailPreview
                                        src={thumbnailPreview || "https://via.placeholder.com/480x360?text=Video+Thumbnail"}
                                        alt="Video thumbnail"
                                    />
                                    <ThumbnailUploadButton>
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="thumbnail-upload"
                                            type="file"
                                            onChange={handleThumbnailChange}
                                        />
                                        <label htmlFor="thumbnail-upload">
                                            <IconButton color="primary" component="span">
                                                <PhotoCamera />
                                            </IconButton>
                                        </label>
                                    </ThumbnailUploadButton>
                                </ThumbnailContainer>

                                {video && (
                                    <Box mt={2} textAlign="center">
                                        <Typography variant="body2" color="textSecondary">
                                            Video duration: {formatDuration(video.duration || 0)}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {video.viewCount || 0} views
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        {/* Video Details Form */}
                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                margin="normal"
                                variant="outlined"
                                required
                                inputProps={{ maxLength: 100 }}
                            />

                            <FormHelperText>
                                {formData.title.length}/100 characters
                            </FormHelperText>

                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                margin="normal"
                                variant="outlined"
                                multiline
                                rows={4}
                                placeholder="Tell viewers about your video"
                            />

                            <TextField
                                fullWidth
                                label="Tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                margin="normal"
                                variant="outlined"
                                placeholder="Add tags separated by commas (e.g. music, gaming, tutorial)"
                            />

                            <Box mt={2}>
                                <FormControl variant="outlined" fullWidth margin="normal">
                                    <InputLabel id="privacy-label">Privacy</InputLabel>
                                    <Select
                                        labelId="privacy-label"
                                        name="privacy"
                                        value={formData.privacy}
                                        onChange={handleInputChange}
                                        label="Privacy"
                                    >
                                        <MenuItem value="public">Public</MenuItem>
                                        <MenuItem value="unlisted">Unlisted</MenuItem>
                                        <MenuItem value="private">Private</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box mt={2}>
                                <FormControl variant="outlined" fullWidth margin="normal">
                                    <InputLabel id="category-label">Category</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        label="Category"
                                    >
                                        <MenuItem value="entertainment">Entertainment</MenuItem>
                                        <MenuItem value="music">Music</MenuItem>
                                        <MenuItem value="gaming">Gaming</MenuItem>
                                        <MenuItem value="sports">Sports</MenuItem>
                                        <MenuItem value="education">Education</MenuItem>
                                        <MenuItem value="news">News & Politics</MenuItem>
                                        <MenuItem value="tech">Science & Technology</MenuItem>
                                        <MenuItem value="travel">Travel & Events</MenuItem>
                                        <MenuItem value="howto">Howto & Style</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>

                        {/* Form Actions */}
                        <Grid item xs={12}>
                            <Divider style={{ marginTop: 16, marginBottom: 16 }} />
                            <Box display="flex" justifyContent="space-between">
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    startIcon={<DeleteIcon />}
                                    onClick={handleDelete}
                                >
                                    Delete Video
                                </Button>

                                <Box>
                                    <Button
                                        variant="outlined"
                                        color="default"
                                        onClick={handleCancel}
                                        startIcon={<CancelIcon />}
                                        style={{ marginRight: 16 }}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SaveIcon />}
                                        disabled={saving}
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {/* Success/Error messages */}
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error">
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
                <Alert onClose={() => setSuccess(false)} severity="success">
                    Video updated successfully!
                </Alert>
            </Snackbar>
        </Container>
    );
};

// Utility function to format duration in seconds to MM:SS format
const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Styled Components
const ThumbnailContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 16px;
`;

const ThumbnailPreview = styled.img`
  width: 100%;
  height: auto;
  max-width: 320px;
  object-fit: cover;
  border-radius: 4px;
`;

const ThumbnailUploadButton = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
`;

const FormHelperText = styled.div`
  margin-top: -8px;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.75rem;
  text-align: right;
`;

export default EditVideoPage; 