import AccountBoxOutlinedIcon from '@material-ui/icons/AccountBoxOutlined'
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined'
import SupervisorAccountOutlinedIcon from '@material-ui/icons/SupervisorAccountOutlined'
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined'
import Brightness2OutlinedIcon from '@material-ui/icons/Brightness2Outlined'
import TranslateOutlinedIcon from '@material-ui/icons/TranslateOutlined'
import LanguageOutlinedIcon from '@material-ui/icons/LanguageOutlined'
import SecurityOutlinedIcon from '@material-ui/icons/SecurityOutlined'
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined'
import FeedbackOutlinedIcon from '@material-ui/icons/FeedbackOutlined'
import KeyboardOutlinedIcon from '@material-ui/icons/KeyboardOutlined'
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined'
import PersonOutlineIcon from '@material-ui/icons/PersonOutline'

// Define menu items for authenticated users
export const getAuthenticatedMenuArray = (logoutHandler) => [
  { Icon: AccountBoxOutlinedIcon, text: 'Your Channel', route: '/channel/me' },
  { Icon: MonetizationOnOutlinedIcon, text: 'Purchase and memberships' },
  { Icon: SettingsOutlinedIcon, text: 'YouTube Studio', route: '/studio' },
  { Icon: SupervisorAccountOutlinedIcon, text: 'Switch account', arrow: true },
  {
    Icon: ExitToAppOutlinedIcon,
    text: 'Sign out',
    onClick: logoutHandler
  },
  {
    Icon: Brightness2OutlinedIcon,
    text: 'Appearance: Device theme',
    arrow: true,
  },
  { Icon: TranslateOutlinedIcon, text: 'Language: English', arrow: true },
  { Icon: LanguageOutlinedIcon, text: 'Location: United Kingdom', arrow: true },
  { Icon: SettingsOutlinedIcon, text: 'Settings' },
  { Icon: SecurityOutlinedIcon, text: 'Your data in YouTube' },
  { Icon: HelpOutlineOutlinedIcon, text: 'Help' },
  { Icon: FeedbackOutlinedIcon, text: 'Send feedback' },
  { Icon: KeyboardOutlinedIcon, text: 'Keyboard shortcuts' },
];

// Define menu items for unauthenticated users
export const getUnauthenticatedMenuArray = () => [
  {
    Icon: PersonOutlineIcon,
    text: 'Sign in',
    route: '/login'
  },
  {
    Icon: PersonAddOutlinedIcon,
    text: 'Register',
    route: '/register'
  },
  {
    Icon: Brightness2OutlinedIcon,
    text: 'Appearance: Device theme',
    arrow: true,
  },
  { Icon: TranslateOutlinedIcon, text: 'Language: English', arrow: true },
  { Icon: LanguageOutlinedIcon, text: 'Location: United Kingdom', arrow: true },
  { Icon: SettingsOutlinedIcon, text: 'Settings' },
  { Icon: HelpOutlineOutlinedIcon, text: 'Help' },
  { Icon: FeedbackOutlinedIcon, text: 'Send feedback' },
  { Icon: KeyboardOutlinedIcon, text: 'Keyboard shortcuts' },
];

// For backward compatibility
export const menuArray = getAuthenticatedMenuArray();
