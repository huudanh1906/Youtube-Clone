import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import styled from 'styled-components/macro';
import { useHistory } from 'react-router-dom';
import subscriptionService from '../../services/subscription.service';
import AuthService from '../../services/auth.service';

const SubscribeButton = ({ channelId, channelTitle, channelThumbnailUrl }) => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const isLoggedIn = AuthService.isLoggedIn();
    const history = useHistory();

    useEffect(() => {
        const fetchSubscriptionStatus = async () => {
            if (channelId && isLoggedIn) {
                const subscribed = await subscriptionService.isSubscribed(channelId);
                setIsSubscribed(subscribed);
            }
        };

        fetchSubscriptionStatus();
    }, [channelId, isLoggedIn]);

    const handleSubscribe = async () => {
        if (!isLoggedIn) {
            setShowLoginDialog(true);
            return;
        }

        setLoading(true);
        try {
            if (isSubscribed) {
                await subscriptionService.unsubscribe(channelId);
                setIsSubscribed(false);
            } else {
                await subscriptionService.subscribe(
                    channelId,
                    channelTitle || 'Unknown Channel',
                    channelThumbnailUrl || ''
                );
                setIsSubscribed(true);
            }
        } catch (error) {
            console.error('Subscription error:', error);
            alert(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        history.push('/login');
        setShowLoginDialog(false);
    };

    const handleClose = () => {
        setShowLoginDialog(false);
    };

    return (
        <>
            <SubscribeContainer>
                <StyledButton
                    variant="contained"
                    color={isSubscribed ? "default" : "primary"}
                    onClick={handleSubscribe}
                    disabled={loading}
                >
                    {isSubscribed ? 'SUBSCRIBED' : 'SUBSCRIBE'}
                </StyledButton>
            </SubscribeContainer>

            {showLoginDialog && (
                <LoginDialogBackdrop onClick={handleClose}>
                    <LoginDialogContainer onClick={(e) => e.stopPropagation()}>
                        <CustomDialogTitle>Sign in to subscribe to this channel</CustomDialogTitle>
                        <CustomDialogContent>
                            Signed-in users can subscribe to channels to stay updated on new content. Sign in to continue.
                        </CustomDialogContent>
                        <DialogActions>
                            <DialogButton onClick={handleClose}>Cancel</DialogButton>
                            <DialogButton primary onClick={handleLogin}>Sign In</DialogButton>
                        </DialogActions>
                    </LoginDialogContainer>
                </LoginDialogBackdrop>
            )}
        </>
    );
};

const SubscribeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 16px;
`;

const StyledButton = styled(Button)`
  && {
    background-color: ${props => props.color === 'primary' ? 'red' : '#eee'};
    color: ${props => props.color === 'primary' ? 'white' : '#606060'};
    font-size: 14px;
    font-weight: 500;
    border-radius: 2px;
    padding: 10px 16px;
    
    &:hover {
      background-color: ${props => props.color === 'primary' ? '#cc0000' : '#ddd'};
    }
  }
`;

const LoginDialogBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoginDialogContainer = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 4px;
  width: 300px;
`;

const CustomDialogTitle = styled.h2`
  margin-bottom: 16px;
`;

const CustomDialogContent = styled.p`
  margin-bottom: 24px;
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const DialogButton = styled.button`
  background-color: ${props => props.primary ? '#3ea6ff' : 'inherit'};
  color: ${props => props.primary ? 'white' : 'inherit'};
  border: none;
  padding: 10px 16px;
  border-radius: 2px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-left: ${props => props.primary ? '16px' : '0'};
`;

export default SubscribeButton; 