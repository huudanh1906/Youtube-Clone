import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'
import {
    Typography,
    CircularProgress,
    Divider,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core'
import HistoryService from '../services/history.service'
import moment from 'moment'
import {
    TWO_COL_MIN_WIDTH,
    useIsMobileView,
    FULL_SIDEBAR_WIDTH,
    MINI_SIDEBAR_WIDTH,
    SHOW_FULL_SIDEBAR_BREAKPOINT,
    SHOW_MINI_SIDEBAR_BREAKPOINT,
    useMinWidthToShowFullSidebar,
    useShouldShowMiniSidebar
} from '../utils/utils'
import { useAuth } from '../context/AuthContext'
import DeleteIcon from '@material-ui/icons/Delete'
import CloseIcon from '@material-ui/icons/Close'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'

const HistoryPage = () => {
    const [historyItems, setHistoryItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [showClearDialog, setShowClearDialog] = useState(false)
    const history = useHistory()
    const isMobileView = useIsMobileView()
    const { isLoggedIn, user } = useAuth()
    const showFullSidebar = useMinWidthToShowFullSidebar()
    const showMiniSidebar = useShouldShowMiniSidebar()

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true)
                if (isLoggedIn) {
                    const data = await HistoryService.getHistory()
                    setHistoryItems(data)
                } else {
                    // Người dùng chưa đăng nhập
                    setHistoryItems([])
                }
                setLoading(false)
            } catch (error) {
                console.error('Error fetching history:', error)
                setLoading(false)
            }
        }

        fetchHistory()
    }, [isLoggedIn])

    const handleWatchVideo = (videoId) => {
        history.push(`/watch/${videoId}`)
    }

    const handleRemoveItem = async (e, videoId) => {
        e.stopPropagation()
        try {
            await HistoryService.removeFromHistory(videoId)
            // Refresh list after removal
            setHistoryItems(historyItems.filter(item => item.videoId !== videoId))
        } catch (error) {
            console.error('Error removing history item:', error)
        }
    }

    const handleClearHistory = async () => {
        try {
            await HistoryService.clearHistory()
            setHistoryItems([])
            setShowClearDialog(false)
        } catch (error) {
            console.error('Error clearing history:', error)
        }
    }

    if (!isLoggedIn) {
        return (
            <HistoryPageContainer>
                <ContentContainer>
                    <EmptyStateContainer>
                        <Typography variant="h5">
                            Đăng nhập để xem lịch sử xem
                        </Typography>
                        <Typography variant="body1" style={{ marginTop: '16px' }}>
                            Lịch sử xem chỉ khả dụng khi bạn đã đăng nhập vào tài khoản.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginTop: '24px' }}
                            onClick={() => history.push('/login')}
                        >
                            Đăng nhập
                        </Button>
                    </EmptyStateContainer>
                </ContentContainer>
            </HistoryPageContainer>
        )
    }

    if (loading) {
        return (
            <HistoryPageContainer>
                <LoadingContainer>
                    <CircularProgress />
                </LoadingContainer>
            </HistoryPageContainer>
        )
    }

    return (
        <HistoryPageContainer showFullSidebar={showFullSidebar} showMiniSidebar={showMiniSidebar}>
            <ContentContainer>
                <HeaderContainer>
                    <Typography variant="h5">Lịch sử xem</Typography>
                    {historyItems.length > 0 && (
                        <ClearHistoryButton
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            onClick={() => setShowClearDialog(true)}
                        >
                            Xóa toàn bộ lịch sử xem
                        </ClearHistoryButton>
                    )}
                </HeaderContainer>

                <Divider style={{ margin: '16px 0' }} />

                {historyItems.length === 0 ? (
                    <EmptyStateContainer>
                        <Typography variant="h6">
                            Chưa có video nào trong lịch sử xem
                        </Typography>
                        <Typography variant="body1" style={{ marginTop: '8px' }}>
                            Các video bạn xem sẽ xuất hiện ở đây.
                        </Typography>
                    </EmptyStateContainer>
                ) : (
                    <HistoryList>
                        {historyItems.map((item) => (
                            <HistoryItem key={item.id} onClick={() => handleWatchVideo(item.videoId)}>
                                <ThumbnailContainer>
                                    <img src={item.thumbnailUrl} alt={item.title} />
                                    <PlayOverlay>
                                        <PlayArrowIcon />
                                    </PlayOverlay>
                                </ThumbnailContainer>
                                <HistoryItemContent>
                                    <ItemTitle>{item.title}</ItemTitle>
                                    <ItemChannel>{item.channelTitle}</ItemChannel>
                                    <ItemMeta>
                                        Đã xem: {moment(item.lastViewedAt).format('DD/MM/YYYY HH:mm')}
                                    </ItemMeta>
                                </HistoryItemContent>
                                <RemoveButton onClick={(e) => handleRemoveItem(e, item.videoId)}>
                                    <CloseIcon />
                                </RemoveButton>
                            </HistoryItem>
                        ))}
                    </HistoryList>
                )}
            </ContentContainer>

            {/* Dialog xác nhận xóa toàn bộ lịch sử */}
            <Dialog
                open={showClearDialog}
                onClose={() => setShowClearDialog(false)}
            >
                <DialogTitle>Xóa toàn bộ lịch sử xem?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Hành động này sẽ xóa toàn bộ lịch sử xem video của bạn và không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowClearDialog(false)} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleClearHistory} color="secondary">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </HistoryPageContainer>
    )
}

// Styled components
const HistoryPageContainer = styled.div`
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
`

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
`

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`

const ClearHistoryButton = styled(Button)`
  && {
    color: #ff0000;
    border-color: #ff0000;
    
    &:hover {
      background-color: rgba(255, 0, 0, 0.04);
    }
  }
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
`

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 50vh;
  padding: 16px;
`

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
`

const HistoryItem = styled.div`
  display: flex;
  padding: 12px;
  cursor: pointer;
  border-radius: 4px;
  position: relative;
  
  &:hover {
    background-color: #f5f5f5;
  }
`

const ThumbnailContainer = styled.div`
  position: relative;
  width: 168px;
  min-width: 168px;
  height: 94px;
  margin-right: 12px;
  border-radius: 4px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media screen and (max-width: ${TWO_COL_MIN_WIDTH}px) {
    width: 120px;
    min-width: 120px;
    height: 68px;
  }
`

const PlayOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s;
  
  ${HistoryItem}:hover & {
    opacity: 1;
  }
  
  svg {
    color: white;
    font-size: 48px;
  }
`

const HistoryItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const ItemTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const ItemChannel = styled.p`
  font-size: 14px;
  color: #606060;
  margin: 0 0 4px 0;
`

const ItemMeta = styled.p`
  font-size: 14px;
  color: #606060;
  margin: 0;
`

const RemoveButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #606060;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;
  
  &:hover {
    color: #ff0000;
  }
  
  ${HistoryItem}:hover & {
    opacity: 1;
  }
`

export default HistoryPage 