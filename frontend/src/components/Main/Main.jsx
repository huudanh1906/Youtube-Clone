import React, { useState } from 'react'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'
import ChipsBar from '../ChipsBar/ChipsBar'
import LandingPageVideos from '../../pages/LandingPage'
import {
  MOBILE_VIEW_HEADER_HEIGHT,
  DESKTOP_VIEW_HEADER_HEIGHT,
  TWO_COL_MIN_WIDTH,
} from '../../utils/utils'
import SidebarToShow from '../Sidebar/SidebarToShow'
import SearchPage from '../../pages/SearchPage'
import VideoPage from '../../pages/VideoPage'
import CustomVideoPage from '../../pages/CustomVideoPage'
import LikedVideosPage from '../../pages/LikedVideosPage'
import SubscriptionsPage from '../../pages/SubscriptionsPage'
import ChannelPage from '../../pages/ChannelPage'
import MyChannelPage from '../../pages/MyChannelPage'
import EditChannelPage from '../../pages/EditChannelPage'
import EditVideoPage from '../../pages/EditVideoPage'
import HistoryPage from '../../pages/HistoryPage'
import PlaylistsPage from '../../pages/PlaylistsPage'
import PlaylistDetailPage from '../../pages/PlaylistDetailPage'
import WatchLaterPage from '../../pages/WatchLaterPage'
import VideoUpload from '../VideoUpload'
import StudioPage from '../../pages/StudioPage'
import CacheManager from '../Admin/CacheManager'
import ScrollToTop from '../ScrollToTop'
import PrivateRoute from '../Auth/PrivateRoute'
import { useAuth } from '../../context/AuthContext'

const Main = () => {
  const [selectedChipIndex, setSelectedChipIndex] = useState(0)
  const [landingPageVideos, setLandingPageVideos] = useState([])
  const [popularVideosNextPageToken, setPopularVideosNextPageToken] =
    useState(null)
  const location = useLocation();
  const isInSearchResultsPage = location.pathname === '/results'
  const isInVideoPage = location.pathname.includes('/watch')
  const isInChannelPage = location.pathname.includes('/channel')
  const auth = useAuth();

  // Redirect to the current user's channel
  const MyChannelRedirect = () => {
    const { currentUser } = useAuth();

    if (!currentUser) {
      console.log("No current user, redirecting to login");
      return <Redirect to="/login" />;
    }

    console.log("Current user:", currentUser);

    // Xác định ID người dùng - có thể là id hoặc userId tùy vào cấu trúc dữ liệu
    const userId = currentUser.id || currentUser.userId || '';
    console.log("User ID for redirect:", userId);

    return <Redirect to={`/channel/${userId}`} />;
  };

  return (
    <StyledMain
      isInSearchResultsPage={isInSearchResultsPage}
      isInVideoPage={isInVideoPage}
      isInChannelPage={isInChannelPage}
    >
      <ScrollToTop />
      {!isInVideoPage && !isInChannelPage && <SidebarToShow />}
      <Switch>
        <Route path='/' exact>
          <ChipsBar
            {...{
              selectedChipIndex,
              setSelectedChipIndex,
              setLandingPageVideos,
              setPopularVideosNextPageToken,
            }}
          />
          <LandingPageVideos
            {...{
              selectedChipIndex,
              setSelectedChipIndex,
              landingPageVideos,
              setLandingPageVideos,
              popularVideosNextPageToken,
              setPopularVideosNextPageToken,
            }}
          />
        </Route>
        <Route path='/results'>
          <SearchPage />
        </Route>
        <Route path='/watch/:videoId'>
          <VideoPage />
        </Route>
        <Route path='/custom-watch/:videoId'>
          <CustomVideoPage />
        </Route>
        <PrivateRoute path='/channel/me' component={MyChannelPage} />
        <PrivateRoute path='/edit-channel' component={EditChannelPage} />
        <Route path='/channel/:channelId'>
          <ChannelPage />
        </Route>
        <Route path='/liked-videos'>
          <LikedVideosPage />
        </Route>
        <Route path='/subscriptions'>
          <SubscriptionsPage />
        </Route>
        <Route path='/history'>
          <HistoryPage />
        </Route>
        <Route path='/playlists' exact>
          <PlaylistsPage />
        </Route>
        <Route path='/playlist/:playlistId'>
          <PlaylistDetailPage />
        </Route>
        <Route path='/watch-later'>
          <WatchLaterPage />
        </Route>
        <PrivateRoute path='/upload' component={VideoUpload} />
        <PrivateRoute path='/studio/edit/:videoId' component={EditVideoPage} />
        <PrivateRoute path='/studio' component={StudioPage} />
        <Route path='/admin/cache'>
          <CacheManager />
        </Route>
        {/* original YouTube has a 'something went wrong' page instead of redirecting back to the homepage */}
        <Route path='*'>
          <Redirect to='/' />
        </Route>
      </Switch>
    </StyledMain>
  )
}

export default Main

const StyledMain = styled.div`
  padding-top: ${({ isInSearchResultsPage, isInVideoPage, isInChannelPage }) =>
    isInSearchResultsPage || isInVideoPage || isInChannelPage ? 0 : MOBILE_VIEW_HEADER_HEIGHT}px;
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    padding-top: ${({ isInSearchResultsPage, isInVideoPage, isInChannelPage }) =>
    isInSearchResultsPage || isInVideoPage || isInChannelPage ? 0 : DESKTOP_VIEW_HEADER_HEIGHT}px;
  }
`
