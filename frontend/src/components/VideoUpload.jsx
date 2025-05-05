import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
    makeStyles
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import MovieIcon from '@material-ui/icons/Movie';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import authHeader from '../services/auth-header';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(8)
    },
    paper: {
        padding: theme.spacing(3)
    },
    stepper: {
        marginBottom: theme.spacing(4),
        marginTop: theme.spacing(2)
    },
    uploadBox: {
        textAlign: 'center',
        padding: theme.spacing(5),
        border: '2px dashed #cccccc',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: 'rgba(0, 0, 0, 0.02)'
    },
    selectButton: {
        marginBottom: theme.spacing(2)
    },
    supportText: {
        marginTop: theme.spacing(1)
    },
    thumbnailBox: {
        width: '100%',
        height: 140,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing(2),
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    },
    thumbnailIcon: {
        fontSize: 40
    },
    uploadProgress: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: `${theme.spacing(4)}px 0`
    },
    progressText: {
        marginTop: theme.spacing(2)
    },
    actionBox: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: theme.spacing(4)
    },
    successBox: {
        textAlign: 'center',
        padding: `${theme.spacing(3)}px 0`
    },
    successButtons: {
        marginTop: theme.spacing(2)
    },
    draftButton: {
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2)
    }
}));

const steps = ['Select video', 'Video details', 'Publish'];

const VideoUpload = () => {
    const classes = useStyles();
    const history = useHistory();
    const [activeStep, setActiveStep] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedThumbnail, setSelectedThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedVideo, setUploadedVideo] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        privacy: 'private',
        tags: '',
        category: '',
        duration: 0
    });
    const [errors, setErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const videoRef = useRef(null);

    // Add this to check token on component mount
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log('Current user from localStorage:', user);

        // Test token directly with backend
        if (user && user.token) {
            axios.get('/api/videos/me', {
                headers: {
                    Authorization: 'Bearer ' + user.token
                }
            })
                .then(response => {
                    console.log('Authentication test successful:', response.data);
                })
                .catch(error => {
                    console.error('Authentication test failed:', error);
                    if (error.response && error.response.status === 401) {
                        alert('Your login session has expired. Please login again.');
                        localStorage.removeItem('user');
                        history.push('/login');
                    }
                });
        }
    }, [history]);

    const handleNext = () => {
        if (activeStep === 0 && !selectedFile) {
            return;
        }

        if (activeStep === 1) {
            // Validate form
            const newErrors = {};
            if (!formData.title.trim()) newErrors.title = 'Title is required';
            if (formData.title.length < 3) newErrors.title = 'Title must be at least 3 characters';

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
        }

        if (activeStep === 1) {
            uploadVideo();
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);

            console.log("Video file selected:", file.name);

            // Extract video duration
            const videoElement = document.createElement('video');
            videoElement.preload = 'metadata';

            videoElement.onloadedmetadata = function () {
                const durationInSeconds = Math.round(videoElement.duration);
                console.log(`Video duration extracted: ${durationInSeconds} seconds (${formatDuration(durationInSeconds)})`);

                // Set duration in the form data
                setFormData(prevData => ({
                    ...prevData,
                    duration: durationInSeconds
                }));
                window.URL.revokeObjectURL(videoElement.src);
            };

            videoElement.onerror = function () {
                console.error("Error loading video metadata");
            };

            videoElement.src = URL.createObjectURL(file);
            setActiveStep(1);
        }
    };

    // Format duration as mm:ss or hh:mm:ss
    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
    };

    const handleThumbnailSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedThumbnail(file);
            const reader = new FileReader();
            reader.onload = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error when field is edited
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const uploadVideo = async () => {
        if (!selectedFile) return;

        // Get user directly from localStorage for most fresh token
        const user = JSON.parse(localStorage.getItem('user'));
        console.log('User from localStorage:', user);

        if (!user || !user.token) {
            alert('You are not logged in. Please log in to upload videos.');
            history.push('/login');
            return;
        }

        // Use token directly from localStorage
        const authToken = 'Bearer ' + user.token;
        console.log('Using auth token:', authToken);

        setIsUploading(true);
        const videoData = new FormData();
        const videoRequest = {
            title: formData.title,
            description: formData.description,
            privacy: formData.privacy,
            tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
            category: formData.category,
            duration: formData.duration
        };

        console.log('Video request:', videoRequest);
        console.log('Sending video duration:', formData.duration, 'seconds');

        videoData.append('file', selectedFile);
        videoData.append('videoData', new Blob([JSON.stringify(videoRequest)], { type: 'application/json' }));

        try {
            console.log('Sending upload request...');
            const response = await axios.post('/api/videos', videoData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': authToken
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            console.log('Upload successful:', response.data);
            setUploadedVideo(response.data);
            setActiveStep(2);

            // Upload thumbnail if selected
            if (selectedThumbnail) {
                const thumbnailData = new FormData();
                thumbnailData.append('file', selectedThumbnail);

                await axios.post(`/api/videos/${response.data.videoId}/thumbnail`, thumbnailData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': authToken
                    }
                });
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            let errorMessage = 'Failed to upload video. Please try again.';

            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);

                if (error.response.status === 401) {
                    errorMessage = 'Your session has expired. Please log in again.';
                    localStorage.removeItem('user');
                    history.push('/login');
                    return;
                } else if (error.response.status === 500) {
                    errorMessage = 'Server error. Please check if the server has write permissions to the upload directories.';
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = `Upload failed: ${error.response.data.message}`;
                }
            }

            alert(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const handlePublish = async () => {
        if (!uploadedVideo) return;

        // Get user directly from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.token) {
            alert('You are not logged in. Please log in to publish videos.');
            history.push('/login');
            return;
        }

        // Use token directly
        const authToken = 'Bearer ' + user.token;

        try {
            await axios.post(`/api/videos/${uploadedVideo.videoId}/publish`, {}, {
                headers: {
                    'Authorization': authToken
                }
            });
            history.push(`/custom-watch/${uploadedVideo.videoId}`);
        } catch (error) {
            console.error('Error publishing video:', error);

            if (error.response && error.response.status === 401) {
                alert('Your session has expired. Please log in again.');
                localStorage.removeItem('user');
                history.push('/login');
                return;
            }

            alert('Failed to publish video. Please try again.');
        }
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <div className={classes.uploadBox}>
                        <input
                            type="file"
                            accept="video/*"
                            id="video-upload"
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                        />
                        <label htmlFor="video-upload">
                            <Button
                                variant="contained"
                                color="primary"
                                component="span"
                                startIcon={<CloudUploadIcon />}
                                className={classes.selectButton}
                            >
                                Select Video
                            </Button>
                        </label>
                        <Typography variant="body1">
                            {selectedFile ? `Selected file: ${selectedFile.name}` : 'Upload a video file'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" className={classes.supportText}>
                            Supported formats: MP4, WebM, MKV
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Maximum file size: 1GB
                        </Typography>
                    </div>
                );
            case 1:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                error={!!errors.title}
                                helperText={errors.title}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Tags (comma separated)"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                margin="normal"
                                placeholder="music, rock, concert"
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Privacy</InputLabel>
                                <Select
                                    name="privacy"
                                    value={formData.privacy}
                                    onChange={handleInputChange}
                                    label="Privacy"
                                >
                                    <MenuItem value="private">Private</MenuItem>
                                    <MenuItem value="unlisted">Unlisted</MenuItem>
                                    <MenuItem value="public">Public</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    label="Category"
                                >
                                    <MenuItem value="music">Music</MenuItem>
                                    <MenuItem value="gaming">Gaming</MenuItem>
                                    <MenuItem value="education">Education</MenuItem>
                                    <MenuItem value="entertainment">Entertainment</MenuItem>
                                    <MenuItem value="sports">Sports</MenuItem>
                                    <MenuItem value="tech">Technology</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper style={{ padding: 16, marginBottom: 16 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Thumbnail
                                </Typography>
                                <div
                                    className={classes.thumbnailBox}
                                    style={{
                                        backgroundImage: thumbnailPreview ? `url(${thumbnailPreview})` : 'none'
                                    }}
                                >
                                    {!thumbnailPreview && <MovieIcon color="disabled" className={classes.thumbnailIcon} />}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="thumbnail-upload"
                                    style={{ display: 'none' }}
                                    onChange={handleThumbnailSelect}
                                />
                                <label htmlFor="thumbnail-upload">
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        size="small"
                                        fullWidth
                                    >
                                        Upload Thumbnail
                                    </Button>
                                </label>
                            </Paper>
                            <Paper style={{ padding: 16 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Video Information
                                </Typography>
                                <Typography variant="body2">
                                    Filename: {selectedFile?.name}
                                </Typography>
                                <Typography variant="body2">
                                    Size: {Math.round(selectedFile?.size / 1024 / 1024 * 10) / 10} MB
                                </Typography>
                                <Typography variant="body2">
                                    Duration: {formData.duration > 0 ? formatDuration(formData.duration) : 'Calculating...'}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                );
            case 2:
                return (
                    <div className={classes.successBox}>
                        <Typography variant="h6" gutterBottom>
                            Your video has been uploaded!
                        </Typography>
                        <Typography variant="body1" paragraph>
                            You can now publish your video to make it available according to your privacy settings.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handlePublish}
                            className={classes.successButtons}
                        >
                            Publish Now
                        </Button>
                        <Button
                            variant="outlined"
                            className={classes.draftButton}
                            onClick={() => history.push('/studio')}
                        >
                            Save as Draft
                        </Button>
                    </div>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <Container maxWidth="md" className={classes.root}>
            <Paper className={classes.paper}>
                <Typography variant="h5" gutterBottom align="center">
                    Upload a Video
                </Typography>

                <Stepper activeStep={activeStep} className={classes.stepper}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {isUploading ? (
                    <div className={classes.uploadProgress}>
                        <CircularProgress variant="determinate" value={uploadProgress} size={60} thickness={4} />
                        <Typography variant="h6" className={classes.progressText}>
                            {uploadProgress}% Uploaded
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Please wait while your video is being uploaded...
                        </Typography>
                    </div>
                ) : (
                    <>
                        {getStepContent(activeStep)}

                        <div className={classes.actionBox}>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                            >
                                Back
                            </Button>

                            {activeStep < steps.length - 1 && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    disabled={activeStep === 0 && !selectedFile}
                                >
                                    {activeStep === steps.length - 2 ? 'Upload' : 'Next'}
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default VideoUpload; 