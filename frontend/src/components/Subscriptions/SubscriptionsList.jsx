import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        margin: theme.spacing(2, 0, 1, 2),
        fontWeight: 500,
    },
    inline: {
        display: 'inline',
    },
    avatar: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    listItem: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        padding: theme.spacing(2),
    },
    noSubscriptions: {
        padding: theme.spacing(2),
        textAlign: 'center',
    }
}));

const SubscriptionsList = () => {
    const classes = useStyles();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const { currentUser, isLoggedIn } = useAuth();

    useEffect(() => {
        const fetchSubscriptions = async () => {
            if (!isLoggedIn || !currentUser) {
                setLoading(false);
                return;
            }

            try {
                // Debug: kiểm tra thông tin user
                console.log('Current user from context:', currentUser);

                // Debug: kiểm tra trực tiếp từ localStorage
                const userFromStorage = JSON.parse(localStorage.getItem('user'));
                console.log('User from localStorage:', userFromStorage);

                // Sử dụng token từ nhiều nguồn có thể
                const token = currentUser?.token || userFromStorage?.token || currentUser?.accessToken;

                if (!token) {
                    console.error('No authentication token available');
                    console.error('User object structure:', JSON.stringify(currentUser));
                    setLoading(false);
                    return;
                }

                console.log('Using token:', token);

                const response = await axios.get('http://localhost:8080/api/subscriptions/my-subscriptions', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSubscriptions(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching subscriptions:', error);
                console.error('Error details:', error.response ? error.response.data : 'No response data');
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, [currentUser, isLoggedIn]);

    const handleChannelClick = (channelId) => {
        // Chuyển đến trang channel
        history.push(`/channel/${channelId}`);
    };

    if (loading) {
        return (
            <div className={classes.loading}>
                <CircularProgress size={24} />
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className={classes.noSubscriptions}>
                <Typography variant="body2">Sign in to see your subscriptions</Typography>
            </div>
        );
    }

    if (subscriptions.length === 0) {
        return (
            <div className={classes.noSubscriptions}>
                <Typography variant="body2">No subscriptions yet</Typography>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <Typography variant="subtitle1" className={classes.title}>
                Subscriptions
            </Typography>
            <List>
                {subscriptions.map((subscription) => (
                    <ListItem
                        key={subscription.id}
                        alignItems="center"
                        className={classes.listItem}
                        onClick={() => handleChannelClick(subscription.channelId)}
                    >
                        <ListItemAvatar>
                            <Avatar
                                alt={subscription.channelTitle}
                                src={subscription.channelThumbnailUrl}
                                className={classes.avatar}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={subscription.channelTitle}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default SubscriptionsList; 