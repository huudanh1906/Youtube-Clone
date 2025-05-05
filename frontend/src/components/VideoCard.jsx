import React from 'react';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Avatar,
    makeStyles
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: '100%',
        boxShadow: 'none',
        backgroundColor: 'transparent',
        '&:hover': {
            '& $media': {
                transform: 'scale(1.05)',
                transition: 'transform 0.3s ease-in-out'
            }
        }
    },
    mediaBox: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden'
    },
    media: {
        height: 180,
        transition: 'transform 0.3s ease-in-out',
        objectFit: 'cover',
        backgroundColor: '#000'
    },
    durationBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '2px 4px',
        borderRadius: 4,
        fontSize: '0.75rem',
        fontWeight: 'bold'
    },
    contentWrapper: {
        display: 'flex',
        marginTop: theme.spacing(2)
    },
    avatarContainer: {
        marginRight: theme.spacing(2)
    },
    avatar: {
        width: 36,
        height: 36,
        textDecoration: 'none',
        '&.MuiAvatar-root': {
            width: 36,
            height: 36
        }
    },
    content: {
        padding: 0
    },
    title: {
        marginBottom: 4,
        lineHeight: 1.2,
        fontWeight: 500,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        height: '2.4em'
    },
    channelName: {
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        '&:hover': {
            color: theme.palette.text.primary
        }
    }
}));

const VideoCard = ({ video }) => {
    const classes = useStyles();

    // Xác định xem video có phải là short không (dưới 1 phút)
    const isShort = video.duration && video.duration < 60;

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

    // Format video duration
    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    };

    // Xử lý nhiều dạng đường dẫn thumbnail khác nhau
    const getThumbnailUrl = (video) => {
        // Nếu không có thumbnail, sử dụng placeholder
        if (!video.thumbnailUrl) {
            return 'https://via.placeholder.com/480x360?text=Video';
        }

        // Nếu thumbnail là một URL đầy đủ, sử dụng nó trực tiếp
        if (video.thumbnailUrl.startsWith('http')) {
            return video.thumbnailUrl;
        }

        // Nếu là tên file thì xây dựng đường dẫn
        if (video.thumbnailUrl.includes('.')) {
            return `http://localhost:8080/api/media/thumbnail/${video.thumbnailUrl}`;
        }

        // Trường hợp khác
        return video.thumbnailUrl;
    };

    // Calculate time ago
    const timeAgo = video.createdAt ?
        formatDistanceToNow(new Date(video.createdAt), { addSuffix: true }) :
        '';

    return (
        <Card className={classes.card}>
            <CardActionArea
                component={Link}
                to={`/custom-watch/${video.videoId}`}
                style={{ display: 'block' }}
            >
                <div className={classes.mediaBox}>
                    <CardMedia
                        component="img"
                        className={classes.media}
                        image={getThumbnailUrl(video)}
                        title={video.title}
                    />
                    <div className={classes.durationBadge}>
                        {isShort ? (
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ color: 'red', marginRight: '3px' }}>●</span>
                                SHORT
                            </span>
                        ) : (
                            video.duration && formatDuration(video.duration)
                        )}
                    </div>
                </div>
            </CardActionArea>

            <div className={classes.contentWrapper}>
                <div className={classes.avatarContainer}>
                    <Avatar
                        alt={video.user?.name}
                        src={video.user?.profileImageUrl ?
                            `http://localhost:8080${video.user.profileImageUrl}` :
                            "https://via.placeholder.com/36x36?text=U"}
                        component={Link}
                        to={`/channel/${video.user?.username || video.user?.id || ''}`}
                        className={classes.avatar}
                    />
                </div>
                <div>
                    <CardContent className={classes.content}>
                        <Typography
                            gutterBottom
                            variant="subtitle1"
                            component="div"
                            className={classes.title}
                        >
                            {video.title}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component={Link}
                            to={`/channel/${video.user?.username || video.user?.id || ''}`}
                            className={classes.channelName}
                        >
                            {video.user?.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {formatViewCount(video.viewCount)} views • {timeAgo}
                        </Typography>
                    </CardContent>
                </div>
            </div>
        </Card>
    );
};

export default VideoCard; 