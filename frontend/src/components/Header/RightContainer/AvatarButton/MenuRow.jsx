import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import styled from 'styled-components/macro'
import ListItemText from '@material-ui/core/ListItemText'
import { StyledMenuItem, StyledListItemIcon } from '../../../../utils/utils'

export const MenuRow = ({ Icon, text, arrow, onClick }) => {
  const handleClick = () => {
    console.log(`Clicked menu item: ${text}`);
    if (onClick) onClick();
  };

  return (
    <MenuItem onClick={handleClick}>
      <StyledListItemIcon>
        <Icon fontSize="small" />
      </StyledListItemIcon>
      <ListItemText primary={text} />
      {arrow && <ChevronRightIcon style={{ fontSize: '20px' }} />}
    </MenuItem>
  )
}
const MenuItem = styled(StyledMenuItem)`
  && {
    padding-top: 0;
    padding-bottom: 0;
  }
`
