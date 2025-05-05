import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { CircularProgress, IconButton, Slider, Typography, Tooltip } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import Forward10Icon from '@material-ui/icons/Forward10';
import Replay10Icon from '@material-ui/icons/Replay10';

const CustomVideoPlayer = ({ videoId, title, autoPlay = false, onValidView = () => { } }) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const [error, setError] = useState(null);
    const controlsTimerRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hasCountedView, setHasCountedView] = useState(false);
    const [playTimeForView, setPlayTimeForView] = useState(0);
    const [showCenterControls, setShowCenterControls] = useState(false);
    const centerControlsTimerRef = useRef(null);
    const MIN_VIEW_TIME_SECONDS = 30; // Thời gian tối thiểu để tính là một lượt xem (30 giây)
    const MIN_PERCENT_FOR_VIEW = 30; // Hoặc coi là xem khi đã xem ít nhất 30% video

    // Create a proper video URL based on the input
    const getVideoUrl = () => {
        if (!videoId) return '';

        // If it's already a full URL, use it directly
        if (videoId.startsWith('http')) {
            return videoId;
        }

        // Otherwise, construct the URL to our media endpoint
        return `http://localhost:8080/api/media/video/${videoId}`;
    };

    useEffect(() => {
        const videoElement = videoRef.current;

        if (videoElement) {
            console.log("Setting up video with source:", getVideoUrl());

            // Set up event listeners
            const handleLoadedMetadata = () => {
                setDuration(videoElement.duration);
                setIsLoading(false);
                if (autoPlay) {
                    videoElement.play().catch(e => {
                        console.error("Autoplay failed:", e);
                        setIsPlaying(false);
                    });
                }
            };

            const handleTimeUpdate = () => {
                setCurrentTime(videoElement.currentTime);
            };

            const handleEnded = () => {
                setIsPlaying(false);
                setCurrentTime(0);
            };

            const handleError = (e) => {
                console.error("Video error:", e);
                console.error("Failed to load video with source:", videoElement.src);
                setError("Failed to load video. Please try again later.");
                setIsLoading(false);
            };

            videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
            videoElement.addEventListener('timeupdate', handleTimeUpdate);
            videoElement.addEventListener('ended', handleEnded);
            videoElement.addEventListener('error', handleError);

            return () => {
                videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
                videoElement.removeEventListener('timeupdate', handleTimeUpdate);
                videoElement.removeEventListener('ended', handleEnded);
                videoElement.removeEventListener('error', handleError);
            };
        }
    }, [autoPlay, videoId]);

    useEffect(() => {
        // Hide controls after 3 seconds of inactivity
        const hideControls = () => {
            controlsTimerRef.current = setTimeout(() => {
                if (isPlaying) {
                    setShowControls(false);
                }
            }, 3000);
        };

        hideControls();

        return () => {
            if (controlsTimerRef.current) {
                clearTimeout(controlsTimerRef.current);
            }
        };
    }, [isPlaying, currentTime]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        let viewTrackingInterval = null;

        // Chỉ theo dõi khi video đang phát và chưa tính view
        if (isPlaying && !hasCountedView) {
            viewTrackingInterval = setInterval(() => {
                setPlayTimeForView(prev => prev + 1);

                // Kiểm tra điều kiện để tính view: đã xem ít nhất 30 giây HOẶC đã xem 30% video
                const minTimeReached = playTimeForView >= MIN_VIEW_TIME_SECONDS;
                const minPercentReached = duration > 0 && (playTimeForView / duration) * 100 >= MIN_PERCENT_FOR_VIEW;

                if ((minTimeReached || minPercentReached) && !hasCountedView) {
                    console.log(`Valid view counted after ${playTimeForView} seconds (${(playTimeForView / duration * 100).toFixed(1)}% of video)`);
                    setHasCountedView(true);
                    onValidView(); // Gọi callback cho parent component
                    clearInterval(viewTrackingInterval);
                }
            }, 1000); // Cập nhật mỗi giây
        }

        return () => {
            if (viewTrackingInterval) {
                clearInterval(viewTrackingInterval);
            }
        };
    }, [isPlaying, hasCountedView, playTimeForView, duration, onValidView]);

    // Reset the view tracking if videoId changes
    useEffect(() => {
        setHasCountedView(false);
        setPlayTimeForView(0);
    }, [videoId]);

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch(e => {
                    console.error("Play failed:", e);
                });
            }
            setIsPlaying(!isPlaying);

            // Show center controls briefly when play/pause is triggered
            showCenterControlsTemporarily();
        }
    };

    const showCenterControlsTemporarily = () => {
        setShowCenterControls(true);

        // Clear any existing timeout
        if (centerControlsTimerRef.current) {
            clearTimeout(centerControlsTimerRef.current);
        }

        // Set a new timeout to hide the controls after 1.5 seconds
        centerControlsTimerRef.current = setTimeout(() => {
            setShowCenterControls(false);
        }, 1500);
    };

    const handleVolumeChange = (event, newValue) => {
        if (videoRef.current) {
            videoRef.current.volume = newValue;
            setVolume(newValue);
            setIsMuted(newValue === 0);
        }
    };

    const handleToggleMute = () => {
        if (videoRef.current) {
            const newMuteState = !isMuted;
            videoRef.current.muted = newMuteState;
            setIsMuted(newMuteState);
        }
    };

    const handleSeek = (event, newValue) => {
        if (videoRef.current) {
            videoRef.current.currentTime = newValue;
            setCurrentTime(newValue);
        }
    };

    const handleFullscreen = () => {
        const container = containerRef.current;
        if (!document.fullscreenElement) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.mozRequestFullScreen) { /* Firefox */
                container.mozRequestFullScreen();
            } else if (container.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) { /* IE/Edge */
                container.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);

        if (controlsTimerRef.current) {
            clearTimeout(controlsTimerRef.current);
        }

        controlsTimerRef.current = setTimeout(() => {
            if (isPlaying) {
                setShowControls(false);
            }
        }, 3000);
    };

    const handleDoubleClick = () => {
        handleFullscreen();
    };

    const formatTime = (timeInSeconds) => {
        if (isNaN(timeInSeconds) || timeInSeconds === Infinity) return "0:00";

        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.floor(timeInSeconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleForward10 = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
        }
    };

    const handleReplay10 = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
        }
    };

    return (
        <VideoPlayerContainer
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onDoubleClick={handleDoubleClick}
            onClick={() => {
                if (!showControls) {
                    setShowControls(true);
                }
                showCenterControlsTemporarily();
            }}
        >
            {isLoading && (
                <LoadingOverlay>
                    <CircularProgress color="inherit" />
                </LoadingOverlay>
            )}

            {error && (
                <ErrorOverlay>
                    <Typography variant="body1">{error}</Typography>
                </ErrorOverlay>
            )}

            <CenterControlsOverlay visible={showCenterControls}>
                <IconButton
                    onClick={handlePlayPause}
                    className="center-control-button"
                >
                    {isPlaying ?
                        <PauseIconLarge /> :
                        <PlayArrowIconLarge />
                    }
                </IconButton>
            </CenterControlsOverlay>

            <StyledVideo
                ref={videoRef}
                src={getVideoUrl()}
                onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPause();
                }}
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleDoubleClick();
                }}
                controlsList="nodownload"
            />

            <Controls visible={showControls}>
                <ProgressBarContainer>
                    <BufferedProgress style={{ width: videoRef.current ? `${(videoRef.current.buffered.length > 0 ? videoRef.current.buffered.end(videoRef.current.buffered.length - 1) / videoRef.current.duration : 0) * 100}%` : '0%' }} />
                    <Slider
                        value={currentTime}
                        onChange={handleSeek}
                        min={0}
                        max={duration || 100}
                        step={0.1}
                        valueLabelDisplay="auto"
                        valueLabelFormat={formatTime}
                    />
                    <TimeDisplay>
                        <span>{formatTime(currentTime)}</span>
                        <span> / </span>
                        <span>{formatTime(duration)}</span>
                    </TimeDisplay>
                </ProgressBarContainer>

                <ControlsRow>
                    <LeftControls>
                        <Tooltip title="Phát/Tạm dừng">
                            <StyledIconButton onClick={handlePlayPause} size="small">
                                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                            </StyledIconButton>
                        </Tooltip>

                        <Tooltip title="Quay lại 10 giây">
                            <StyledIconButton onClick={handleReplay10} size="small">
                                <Replay10Icon />
                            </StyledIconButton>
                        </Tooltip>

                        <Tooltip title="Tiến 10 giây">
                            <StyledIconButton onClick={handleForward10} size="small">
                                <Forward10Icon />
                            </StyledIconButton>
                        </Tooltip>

                        <VolumeControl>
                            <Tooltip title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}>
                                <StyledIconButton onClick={handleToggleMute} size="small">
                                    {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                                </StyledIconButton>
                            </Tooltip>
                            <VolumeSlider>
                                <Slider
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                />
                            </VolumeSlider>
                        </VolumeControl>
                    </LeftControls>

                    <RightControls>
                        <Tooltip title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}>
                            <StyledIconButton onClick={handleFullscreen} size="small">
                                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                            </StyledIconButton>
                        </Tooltip>
                    </RightControls>
                </ControlsRow>
            </Controls>

            <VideoOverlay>
                <BigPlayButton
                    onClick={handlePlayPause}
                    visible={!isPlaying && !showCenterControls}
                >
                    <PlayArrowIconLarge />
                </BigPlayButton>
            </VideoOverlay>
        </VideoPlayerContainer>
    );
};

const VideoPlayerContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  background-color: #000;
  overflow: hidden;
  
  &:hover .center-control-button {
    opacity: 1;
  }
`;

const StyledVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
  color: white;
  transition: opacity 0.3s;
  opacity: ${props => props.visible ? 1 : 0};
  pointer-events: ${props => props.visible ? 'auto' : 'none'};
`;

const CenterControlsOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  opacity: ${props => props.visible ? 1 : 0};
  pointer-events: none;
  transition: opacity 0.3s ease;
  
  .center-control-button {
    pointer-events: auto;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    opacity: 0.8;
    transition: opacity 0.3s, transform 0.2s;
    
    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }
  }
`;

const PlayArrowIconLarge = styled(PlayArrowIcon)`
  && {
    font-size: 3rem;
  }
`;

const PauseIconLarge = styled(PauseIcon)`
  && {
    font-size: 3rem;
  }
`;

const StyledIconButton = styled(IconButton)`
  && {
    color: white;
    margin: 0 4px;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
`;

const ProgressBarContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  
  .MuiSlider-root {
    color: #f00;
    margin: 0 8px;
    z-index: 2;
  }
`;

const BufferedProgress = styled.div`
  position: absolute;
  left: 8px;
  right: 8px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  z-index: 1;
  border-radius: 4px;
`;

const TimeDisplay = styled.div`
  font-size: 12px;
  min-width: 80px;
  text-align: center;
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftControls = styled.div`
  display: flex;
  align-items: center;
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
`;

const VolumeSlider = styled.div`
  width: 60px;
  margin-left: 8px;
  
  .MuiSlider-root {
    color: white;
  }
`;

const VideoTitle = styled.div`
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 40%;
  margin: 0 8px;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
  color: white;
`;

const ErrorOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1;
  color: white;
  padding: 20px;
  text-align: center;
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BigPlayButton = styled.div`
  pointer-events: auto;
  width: 68px;
  height: 48px;
  border-radius: 24px;
  background-color: rgba(33, 33, 33, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s, background-color 0.2s, transform 0.2s;
  
  &:hover {
    background-color: #f00;
    transform: scale(1.05);
  }
`;

export default CustomVideoPlayer; 