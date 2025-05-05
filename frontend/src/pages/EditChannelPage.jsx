import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Box,
    Avatar,
    CircularProgress,
    Divider,
    Snackbar,
    IconButton
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import axios from 'axios';
import styled from 'styled-components/macro';
import { useAuth } from '../context/AuthContext';

const EditChannelPage = () => {
    const { currentUser } = useAuth();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [bannerPreview, setBannerPreview] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        website: ''
    });

    useEffect(() => {
        if (!currentUser) {
            history.push('/login');
            return;
        }

        const fetchUserDetails = async () => {
            try {
                setLoading(true);
                const authToken = `Bearer ${currentUser.token}`;

                // Gọi API để lấy thông tin đầy đủ của người dùng
                const response = await axios.get(`/api/users/${currentUser.id}`, {
                    headers: {
                        'Authorization': authToken
                    }
                });

                const userData = response.data;
                console.log('Fetched user data:', userData);

                // Khởi tạo form data từ thông tin user được lấy từ API
                setFormData({
                    name: userData.name || userData.username || currentUser.username || '',
                    description: userData.channelDescription || currentUser.description || '',
                    location: userData.location || currentUser.location || '',
                    website: userData.website || currentUser.website || ''
                });

                // Set avatar và banner preview nếu có
                if (userData.profileImageUrl) {
                    setAvatarPreview(`http://localhost:8080${userData.profileImageUrl}`);
                } else if (currentUser.profileImage) {
                    setAvatarPreview(
                        currentUser.profileImage.startsWith('http')
                            ? currentUser.profileImage
                            : `http://localhost:8080/api/users/${currentUser.id}/avatar`
                    );
                }

                if (userData.bannerImageUrl) {
                    setBannerPreview(`http://localhost:8080${userData.bannerImageUrl}`);
                } else if (currentUser.bannerImage) {
                    setBannerPreview(
                        currentUser.bannerImage.startsWith('http')
                            ? currentUser.bannerImage
                            : `http://localhost:8080/api/users/${currentUser.id}/banner`
                    );
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching user details:', error);
                // Sử dụng thông tin từ localStorage nếu API lỗi
                setFormData({
                    name: currentUser.name || currentUser.username || '',
                    description: currentUser.description || '',
                    location: currentUser.location || '',
                    website: currentUser.website || ''
                });

                // Set avatar và banner preview nếu có từ localStorage
                if (currentUser.profileImage) {
                    setAvatarPreview(
                        currentUser.profileImage.startsWith('http')
                            ? currentUser.profileImage
                            : `http://localhost:8080/api/users/${currentUser.id}/avatar`
                    );
                }

                if (currentUser.bannerImage) {
                    setBannerPreview(
                        currentUser.bannerImage.startsWith('http')
                            ? currentUser.bannerImage
                            : `http://localhost:8080/api/users/${currentUser.id}/banner`
                    );
                }

                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [currentUser, history]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setBannerPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser || !currentUser.token) {
            setError('You need to be logged in to update your channel');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            console.log('Current user object:', currentUser);
            console.log('Starting profile update with form data:', formData);
            const authToken = `Bearer ${currentUser.token}`;
            console.log('Using auth token:', authToken);

            // Chuẩn bị dữ liệu đúng định dạng cho API
            const apiFormData = {
                username: currentUser.username, // giữ nguyên username, không thay đổi
                name: formData.name,
                channelDescription: formData.description,
                location: formData.location,
                website: formData.website
            };

            // Cập nhật thông tin cơ bản
            try {
                console.log('Sending profile update request to API with data:', apiFormData);
                const response = await axios.put(`/api/users/${currentUser.id}/profile`, apiFormData, {
                    headers: {
                        'Authorization': authToken,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Profile update response:', response.data);
            } catch (profileError) {
                console.error('Error updating profile:', profileError);
                if (profileError.response) {
                    console.error('Profile error response:', profileError.response.data);
                    console.error('Profile error status:', profileError.response.status);
                    console.error('Profile error headers:', profileError.response.headers);
                }
                throw profileError; // Rethrow to be caught by outer catch
            }

            // Upload avatar nếu có
            if (avatarFile) {
                try {
                    console.log('Uploading avatar file');
                    const avatarFormData = new FormData();
                    avatarFormData.append('file', avatarFile);
                    await axios.post(`/api/users/${currentUser.id}/avatar`, avatarFormData, {
                        headers: {
                            'Authorization': authToken,
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    console.log('Avatar upload successful');
                } catch (avatarError) {
                    console.error('Error uploading avatar:', avatarError);
                    // Continue with the process even if avatar upload fails
                }
            }

            // Upload banner nếu có
            if (bannerFile) {
                try {
                    console.log('Uploading banner file');
                    const bannerFormData = new FormData();
                    bannerFormData.append('file', bannerFile);
                    await axios.post(`/api/users/${currentUser.id}/banner`, bannerFormData, {
                        headers: {
                            'Authorization': authToken,
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    console.log('Banner upload successful');
                } catch (bannerError) {
                    console.error('Error uploading banner:', bannerError);
                    // Continue with the process even if banner upload fails
                }
            }

            setSuccess(true);

            // Cập nhật thông tin hiện tại trong localStorage
            try {
                // Lấy user hiện tại từ localStorage
                const currentUserData = JSON.parse(localStorage.getItem('user'));
                if (currentUserData) {
                    // Cập nhật thông tin mới
                    const updatedUserData = {
                        ...currentUserData,
                        name: formData.name,
                        description: formData.description,
                        location: formData.location,
                        website: formData.website,
                        // Không cần cập nhật avatar và banner vì khi load lại trang, sẽ lấy từ API
                    };

                    // Lưu lại vào localStorage
                    localStorage.setItem('user', JSON.stringify(updatedUserData));
                    console.log('Updated user data in localStorage:', updatedUserData);
                }
            } catch (localStorageError) {
                console.error('Error updating localStorage:', localStorageError);
                // Không ảnh hưởng đến luồng chính
            }

            setTimeout(() => {
                history.push('/channel/me');
            }, 2000);
        } catch (err) {
            console.error('Error updating channel:', err);
            let errorMessage = 'Failed to update channel. Please try again.';

            if (err.response) {
                console.error('Error response data:', err.response.data);
                console.error('Error response status:', err.response.status);

                // Try to extract the error message from the response
                if (err.response.data) {
                    if (typeof err.response.data === 'string') {
                        errorMessage = err.response.data;
                    } else if (err.response.data.message) {
                        errorMessage = err.response.data.message;
                    } else if (err.response.data.error) {
                        errorMessage = err.response.data.error;
                    }
                }
            }

            setError(errorMessage);

            if (err.response && err.response.status === 401) {
                localStorage.removeItem('user');
                history.push('/login');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        history.push('/channel/me');
    };

    if (loading) {
        return (
            <Container maxWidth="md" style={{ marginTop: 24, marginBottom: 24 }}>
                <Paper style={{ padding: 24 }}>
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" my={4}>
                        <CircularProgress size={60} />
                        <Typography variant="h6" style={{ marginTop: 16 }}>
                            Loading channel information...
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" style={{ marginTop: 24, marginBottom: 24 }}>
            <Paper style={{ padding: 24 }}>
                <Typography variant="h5" gutterBottom>
                    Edit Channel
                </Typography>
                <Divider style={{ marginBottom: 24 }} />

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Banner */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Channel Banner
                            </Typography>
                            <BannerContainer>
                                {bannerPreview ? (
                                    <BannerPreview src={bannerPreview} alt="Channel banner" />
                                ) : (
                                    <BannerPlaceholder>
                                        <Typography variant="body2" color="textSecondary">
                                            Add a banner to personalize your channel
                                        </Typography>
                                    </BannerPlaceholder>
                                )}
                                <BannerUploadButton>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="banner-upload"
                                        type="file"
                                        onChange={handleBannerChange}
                                    />
                                    <label htmlFor="banner-upload">
                                        <Button
                                            variant="contained"
                                            color="default"
                                            component="span"
                                            startIcon={<PhotoCamera />}
                                        >
                                            Change Banner
                                        </Button>
                                    </label>
                                </BannerUploadButton>
                            </BannerContainer>
                        </Grid>

                        {/* Avatar */}
                        <Grid item xs={12} sm={3}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="subtitle1" gutterBottom align="center">
                                    Profile Picture
                                </Typography>
                                <AvatarContainer>
                                    <StyledAvatar src={avatarPreview || "https://via.placeholder.com/150x150?text=Avatar"} />
                                    <AvatarUploadButton>
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="avatar-upload"
                                            type="file"
                                            onChange={handleAvatarChange}
                                        />
                                        <label htmlFor="avatar-upload">
                                            <IconButton color="primary" component="span">
                                                <PhotoCamera />
                                            </IconButton>
                                        </label>
                                    </AvatarUploadButton>
                                </AvatarContainer>
                            </Box>
                        </Grid>

                        {/* Channel Details Form */}
                        <Grid item xs={12} sm={9}>
                            <TextField
                                fullWidth
                                label="Channel Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                margin="normal"
                                variant="outlined"
                                required
                            />
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
                                placeholder="Tell viewers about your channel"
                            />
                            <TextField
                                fullWidth
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                margin="normal"
                                variant="outlined"
                                placeholder="e.g. New York, USA"
                            />
                            <TextField
                                fullWidth
                                label="Website"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                margin="normal"
                                variant="outlined"
                                placeholder="e.g. https://example.com"
                            />
                        </Grid>

                        {/* Form Actions */}
                        <Grid item xs={12}>
                            <Divider style={{ marginTop: 16, marginBottom: 16 }} />
                            <Box display="flex" justifyContent="flex-end">
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
                    Channel updated successfully!
                </Alert>
            </Snackbar>
        </Container>
    );
};

// Styled Components
const BannerContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
  border-radius: 4px;
  overflow: hidden;
`;

const BannerPreview = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`;

const BannerPlaceholder = styled.div`
  width: 100%;
  height: 160px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BannerUploadButton = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-top: 16px;
`;

const StyledAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
`;

const AvatarUploadButton = styled.div`
  position: absolute;
  bottom: 8px;
  right: 0;
`;

export default EditChannelPage; 