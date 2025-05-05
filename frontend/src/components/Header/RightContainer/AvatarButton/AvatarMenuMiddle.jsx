import { menuArray } from './avatarMenuData'
import { MenuRow } from './MenuRow'
import { useHistory } from 'react-router-dom'

export const AvatarMenuMiddle = ({ onClick }) => {
  const history = useHistory();

  const handleNavigation = (route) => {
    if (onClick) onClick();
    history.push(route);
  };

  return menuArray.slice(5).map(({ Icon, text, arrow, route }) => {
    let handleClick = onClick;

    // Ưu tiên navigation nếu có route
    if (route) {
      handleClick = () => handleNavigation(route);
    }

    return <MenuRow key={text} {...{ Icon, text, arrow, onClick: handleClick }} />
  })
}
