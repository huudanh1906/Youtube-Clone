import { getAuthenticatedMenuArray, getUnauthenticatedMenuArray } from './avatarMenuData';
import { MenuRow } from './MenuRow'
import { useAuth } from '../../../../context/AuthContext';
import { useHistory } from 'react-router-dom';

export const AvatarMenuTop = ({ onClick, isUnauthenticated }) => {
  const { logout } = useAuth();
  const history = useHistory();

  const handleLogout = () => {
    logout();
    if (onClick) onClick();
    history.push('/');
  };

  const handleNavigation = (route) => {
    console.log(`Navigating to: ${route}`);
    if (onClick) onClick();
    history.push(route);
  };

  if (isUnauthenticated) {
    const menuItems = getUnauthenticatedMenuArray();
    return menuItems.slice(0, 2).map(({ Icon, text, route }) => {
      return (
        <MenuRow
          key={text}
          Icon={Icon}
          text={text}
          onClick={() => handleNavigation(route)}
        />
      );
    });
  }

  const menuItems = getAuthenticatedMenuArray(handleLogout);
  return menuItems.slice(0, 5).map(({ Icon, text, arrow, route, onClick: itemOnClick }) => {
    let handleClick;

    // Xử lý các trường hợp khác nhau
    if (route) {
      console.log(`Menu item ${text} has route: ${route}`);
      handleClick = () => handleNavigation(route);
    } else if (itemOnClick) {
      handleClick = itemOnClick;
    } else {
      handleClick = onClick;
    }

    return <MenuRow key={text} {...{ Icon, text, arrow, onClick: handleClick }} />;
  });
};
