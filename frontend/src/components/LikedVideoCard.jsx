import React from 'react';
import styled from 'styled-components/macro';
import { Typography, Card, CardMedia, CardContent, IconButton, Badge } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import moment from 'moment';

const LikedVideoCard = ({ video, onUnlike }) => {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/watch/${video.videoId}`);
  };

  const handleUnlike = (e) => {
    e.stopPropagation(); // Prevent card click
    if (onUnlike) {
      onUnlike(video.videoId);
    }
  };

  return (
    <StyledCard onClick={handleClick}>
      <ThumbnailContainer>
        <CardMedia
          component="img"
          image={video.thumbnailUrl || 'https://via.placeholder.com/480x360'}
          alt={video.title}
        />
        <UnlikeButtonContainer>
          <UnlikeButton onClick={handleUnlike} aria-label="Unlike video">
            <ThumbUpIcon />
          </UnlikeButton>
          <UnlikeText>Unlike</UnlikeText>
        </UnlikeButtonContainer>
        <LikeIndicator>
          <ThumbUpIcon fontSize="small" />
        </LikeIndicator>
      </ThumbnailContainer>
      <StyledCardContent>
        <VideoTitle variant="subtitle1">
          {video.title}
        </VideoTitle>
        <ChannelName variant="body2">
          {video.channelTitle}
        </ChannelName>
        <Typography variant="caption" color="textSecondary">
          Liked on {moment(video.likedAt).format('MMM D, YYYY')}
        </Typography>
      </StyledCardContent>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ThumbnailContainer = styled.div`
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  
  .MuiCardMedia-root {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UnlikeButtonContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;

  ${StyledCard}:hover & {
    opacity: 1;
  }
`;

const UnlikeButton = styled(IconButton)`
  background-color: rgba(0, 0, 0, 0.7);
  color: #f44336;
  padding: 12px;
  margin-bottom: 8px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
  }

  .MuiSvgIcon-root {
    font-size: 28px;
  }
`;

const UnlikeText = styled.span`
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
`;

const LikeIndicator = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #f44336;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const StyledCardContent = styled(CardContent)`
  flex-grow: 1;
  padding: 12px;
`;

const VideoTitle = styled(Typography)`
  font-weight: 500;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ChannelName = styled(Typography)`
  color: #606060;
  margin-bottom: 4px;
`;

export default LikedVideoCard; 