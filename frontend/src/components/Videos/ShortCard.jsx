import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Typography } from '@material-ui/core';
import he from 'he';

const ShortCard = ({ video }) => {
    const history = useHistory();
    const {
        id: videoId,
        snippet: { title, thumbnails, channelTitle },
        statistics: { viewCount },
    } = video;

    // Lấy thumbnail với tỷ lệ cao hơn phù hợp cho shorts 
    const thumbnailImage = thumbnails.maxres
        ? thumbnails.maxres.url
        : thumbnails.high
            ? thumbnails.high.url
            : thumbnails.medium.url;

    const handleVideoClick = () => {
        history.push(`/watch/${videoId}`);
    };

    const formatViewCount = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M views`;
        }
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K views`;
        }
        return `${count} views`;
    };

    return (
        <ShortCardContainer onClick={handleVideoClick}>
            <ThumbnailWrapper>
                <Thumbnail src={thumbnailImage} alt={title} />
                <ShortIndicator>Short</ShortIndicator>
            </ThumbnailWrapper>
            <ShortDetails>
                <ShortTitle>{he.decode(title)}</ShortTitle>
                <ViewCount>{formatViewCount(viewCount)}</ViewCount>
            </ShortDetails>
        </ShortCardContainer>
    );
};

const ShortCardContainer = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const ThumbnailWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 16;
  overflow: hidden;
  border-radius: 12px;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ShortIndicator = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: #ff0000;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
`;

const ShortDetails = styled.div`
  padding: 8px;
`;

const ShortTitle = styled(Typography)`
  && {
    font-size: 14px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-bottom: 4px;
    line-height: 1.3;
  }
`;

const ViewCount = styled(Typography)`
  && {
    font-size: 12px;
    color: #606060;
  }
`;

export default ShortCard; 