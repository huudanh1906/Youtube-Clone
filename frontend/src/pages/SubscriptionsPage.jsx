import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components/macro';
import { Typography, Box } from '@material-ui/core';
import SubscriptionOutlinedIcon from '@material-ui/icons/SubscriptionsOutlined';
import SubscriptionsList from '../components/Subscriptions/SubscriptionsList';
import {
    FULL_SIDEBAR_WIDTH,
    MINI_SIDEBAR_WIDTH,
    SHOW_FULL_SIDEBAR_BREAKPOINT,
    SHOW_MINI_SIDEBAR_BREAKPOINT,
    useMinWidthToShowFullSidebar,
    useShouldShowMiniSidebar
} from '../utils/utils';

const SubscriptionsPage = () => {
    const showFullSidebar = useMinWidthToShowFullSidebar();
    const showMiniSidebar = useShouldShowMiniSidebar();

    return (
        <>
            <Helmet>
                <title>Subscriptions - YouTube Clone</title>
            </Helmet>
            <SubscriptionsContainer showFullSidebar={showFullSidebar} showMiniSidebar={showMiniSidebar}>
                <HeaderContainer>
                    <StyledIcon />
                    <Typography variant="h4" component="h1">
                        Subscriptions
                    </Typography>
                </HeaderContainer>
                <Box>
                    <SubscriptionsList />
                </Box>
            </SubscriptionsContainer>
        </>
    );
};

const SubscriptionsContainer = styled.div`
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
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
`;

const StyledIcon = styled(SubscriptionOutlinedIcon)`
  && {
    font-size: 2rem;
    margin-right: 16px;
    color: #FF0000;
  }
`;

export default SubscriptionsPage; 