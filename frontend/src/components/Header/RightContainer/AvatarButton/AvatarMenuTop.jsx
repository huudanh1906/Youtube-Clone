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
  return menuItems.slice(0, 5).map(({ Icon, text, arrow, onClick: itemOnClick }) => {
    const handleClick = itemOnClick || onClick;
    return <MenuRow key={text} {...{ Icon, text, arrow, onClick: handleClick }} />;
  });
};
