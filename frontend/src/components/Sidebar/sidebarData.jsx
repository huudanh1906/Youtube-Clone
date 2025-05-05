import HomeIcon from '@material-ui/icons/Home'
import ExploreOutlinedIcon from '@material-ui/icons/ExploreOutlined'
import SubscriptionsOutlinedIcon from '@material-ui/icons/SubscriptionsOutlined'
import VideoLibraryOutlinedIcon from '@material-ui/icons/VideoLibraryOutlined'
import HistoryOutlinedIcon from '@material-ui/icons/HistoryOutlined'
import ShopOutlinedIcon from '@material-ui/icons/ShopOutlined'
import QueryBuilderOutlinedIcon from '@material-ui/icons/QueryBuilderOutlined'
import PlaylistPlayOutlinedIcon from '@material-ui/icons/PlaylistPlayOutlined'
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined'
import YouTubeIcon from '@material-ui/icons/YouTube'
import VideogameAssetOutlinedIcon from '@material-ui/icons/VideogameAssetOutlined'
import SettingsInputAntennaIcon from '@material-ui/icons/SettingsInputAntenna'
import SportsHandballOutlinedIcon from '@material-ui/icons/SportsHandballOutlined'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined'
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined'
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined'
import FeedbackOutlinedIcon from '@material-ui/icons/FeedbackOutlined'
import ExpandLessOutlinedIcon from '@material-ui/icons/ExpandLessOutlined'
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined'
import VideoCallOutlinedIcon from '@material-ui/icons/VideoCallOutlined'
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined'

export const sideBarShowMore = [
  { Icon: ExpandMoreOutlinedIcon, text: 'Show more' },
]

export const sideBarShowLess = [
  { Icon: ExpandLessOutlinedIcon, text: 'Show less' },
]

export const sideBarMenuRows = [
  { Icon: HomeIcon, text: 'Home' },
  { Icon: ExploreOutlinedIcon, text: 'Explore' },
  { Icon: SubscriptionsOutlinedIcon, text: 'Subscriptions', path: '/subscriptions' },
  { Icon: VideoLibraryOutlinedIcon, text: 'Library', path: '/playlists' },
  { Icon: HistoryOutlinedIcon, text: 'History', path: '/history' },
  { Icon: ThumbUpOutlinedIcon, text: 'Liked Videos', path: '/liked-videos' },
  { Icon: QueryBuilderOutlinedIcon, text: 'Watch later', path: '/watch-later' },
  { Icon: VideoCallOutlinedIcon, text: 'Upload video', path: '/upload' },
  { Icon: ShopOutlinedIcon, text: 'Your videos', path: '/studio' },
  { Icon: PlaylistPlayOutlinedIcon, text: 'Music' },
]

export const moreFromYouTubeRows = [
  { Icon: YouTubeIcon, text: 'YouTube Premium' },
  { Icon: VideogameAssetOutlinedIcon, text: 'Gaming' },
  { Icon: SettingsInputAntennaIcon, text: 'Live' },
  { Icon: SportsHandballOutlinedIcon, text: 'Sport' },
  { Icon: SettingsOutlinedIcon, text: 'Settings' },
  { Icon: FlagOutlinedIcon, text: 'Report history' },
  { Icon: HelpOutlineOutlinedIcon, text: 'Help' },
  { Icon: FeedbackOutlinedIcon, text: 'Send feedback' },
]

// mobile footer uses the same array
export const miniSidebarRows = [
  { Icon: HomeIcon, text: 'Home' },
  { Icon: ExploreOutlinedIcon, text: 'Explore' },
  { Icon: SubscriptionsOutlinedIcon, text: 'Subscriptions', path: '/subscriptions' },
  { Icon: VideoCallOutlinedIcon, text: 'Upload', path: '/upload' },
  { Icon: HistoryOutlinedIcon, text: 'History', path: '/history' },
  { Icon: ThumbUpOutlinedIcon, text: 'Liked Videos', path: '/liked-videos' },
  { Icon: QueryBuilderOutlinedIcon, text: 'Watch later', path: '/watch-later' },
  { Icon: VideoLibraryOutlinedIcon, text: 'Library', path: '/playlists' },
]
