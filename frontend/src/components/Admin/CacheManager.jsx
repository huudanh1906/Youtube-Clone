import React, { useState, useEffect } from 'react';
import {
    Button,
    Typography,
    Box,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { clearAllCache, clearCacheForEndpoint } from '../../utils/api';
import cacheService from '../../services/cache.service';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 800,
        margin: '0 auto',
        padding: theme.spacing(3),
    },
    card: {
        marginBottom: theme.spacing(3),
    },
    title: {
        marginBottom: theme.spacing(2),
    },
    button: {
        margin: theme.spacing(1),
    },
    divider: {
        margin: theme.spacing(2, 0),
    },
    cacheItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cacheKeyText: {
        maxWidth: '70%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    statsCard: {
        marginBottom: theme.spacing(3),
        backgroundColor: theme.palette.grey[50],
    },
    statsContent: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    statItem: {
        textAlign: 'center',
        padding: theme.spacing(1),
    },
}));

// Thông tin quota cost
const QUOTA_COSTS = {
    '/videos': 1,
    '/channels': 1,
    '/search': 100,
    '/playlists': 1,
    '/playlistItems': 1,
    '/commentThreads': 1
};

// Thời gian cache từ api.js
const CACHE_DURATIONS = {
    '/videos': '2 giờ',
    '/channels': '24 giờ',
    '/search': '1 giờ',
    '/playlists': '6 giờ',
    '/playlistItems': '1 giờ',
    '/commentThreads': '30 phút',
    'default': '1 giờ'
};

const CacheManager = () => {
    const classes = useStyles();
    const [cacheKeys, setCacheKeys] = useState([]);
    const [cacheStats, setCacheStats] = useState({
        total: 0,
        videos: 0,
        channels: 0,
        search: 0,
        other: 0,
    });
    const [loading, setLoading] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    useEffect(() => {
        refreshCacheInfo();
    }, [lastRefresh]);

    const refreshCacheInfo = () => {
        setLoading(true);

        // Lấy thông tin từ cache
        const cache = cacheService.cache;
        const keys = Object.keys(cache);

        // Tính toán thống kê
        const stats = {
            total: keys.length,
            videos: keys.filter(key => key.startsWith('/videos')).length,
            channels: keys.filter(key => key.startsWith('/channels')).length,
            search: keys.filter(key => key.startsWith('/search')).length,
            other: keys.filter(key =>
                !key.startsWith('/videos') &&
                !key.startsWith('/channels') &&
                !key.startsWith('/search')
            ).length,
        };

        setCacheKeys(keys);
        setCacheStats(stats);
        setLoading(false);
    };

    const handleClearAll = () => {
        clearAllCache();
        setLastRefresh(new Date());
    };

    const handleClearEndpoint = (endpoint) => {
        clearCacheForEndpoint(endpoint);
        setLastRefresh(new Date());
    };

    const handleDeleteCacheItem = (key) => {
        cacheService.delete(key);
        setLastRefresh(new Date());
    };

    return (
        <div className={classes.root}>
            <Typography variant="h4" className={classes.title}>
                YouTube API Cache Manager
            </Typography>

            <Card className={classes.statsCard}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Cache Statistics
                    </Typography>
                    {loading ? (
                        <Box display="flex" justifyContent="center" p={2}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : (
                        <div className={classes.statsContent}>
                            <div className={classes.statItem}>
                                <Typography variant="h5">{cacheStats.total}</Typography>
                                <Typography variant="body2">Total Items</Typography>
                            </div>
                            <div className={classes.statItem}>
                                <Typography variant="h5">{cacheStats.videos}</Typography>
                                <Typography variant="body2">Videos</Typography>
                            </div>
                            <div className={classes.statItem}>
                                <Typography variant="h5">{cacheStats.channels}</Typography>
                                <Typography variant="body2">Channels</Typography>
                            </div>
                            <div className={classes.statItem}>
                                <Typography variant="h5">{cacheStats.search}</Typography>
                                <Typography variant="body2">Search</Typography>
                            </div>
                            <div className={classes.statItem}>
                                <Typography variant="h5">{cacheStats.other}</Typography>
                                <Typography variant="body2">Other</Typography>
                            </div>
                        </div>
                    )}
                </CardContent>
                <Divider />
                <Box p={2} bgcolor="#f5f5f5">
                    <Typography variant="subtitle2" color="textSecondary">
                        <strong>Cache Optimizations:</strong> Cache items are automatically extended
                        when accessed if they are near expiration. This extends their lifetime by up to
                        50% of the original time, reducing API calls even further.
                    </Typography>
                </Box>
            </Card>

            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Cache Actions
                    </Typography>
                    <Box display="flex" flexWrap="wrap">
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={refreshCacheInfo}
                            disabled={loading}
                        >
                            Refresh Cache Info
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick={handleClearAll}
                            disabled={loading}
                        >
                            Clear All Cache
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            className={classes.button}
                            onClick={() => handleClearEndpoint('/videos')}
                            disabled={loading}
                        >
                            Clear Videos Cache
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            className={classes.button}
                            onClick={() => handleClearEndpoint('/channels')}
                            disabled={loading}
                        >
                            Clear Channels Cache
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            className={classes.button}
                            onClick={() => handleClearEndpoint('/search')}
                            disabled={loading}
                        >
                            Clear Search Cache
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Cấu hình Cache và Quota
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Endpoint</TableCell>
                                    <TableCell>Thời gian lưu</TableCell>
                                    <TableCell>Quota Cost</TableCell>
                                    <TableCell>Số lượng items</TableCell>
                                    <TableCell>Tiết kiệm (units)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.keys(QUOTA_COSTS).map(endpoint => {
                                    const count = cacheKeys.filter(key => key.startsWith(endpoint)).length;
                                    const saved = count * QUOTA_COSTS[endpoint];
                                    return (
                                        <TableRow key={endpoint}>
                                            <TableCell>{endpoint}</TableCell>
                                            <TableCell>{CACHE_DURATIONS[endpoint]}</TableCell>
                                            <TableCell>{QUOTA_COSTS[endpoint]} units</TableCell>
                                            <TableCell>{count}</TableCell>
                                            <TableCell>{saved} units</TableCell>
                                        </TableRow>
                                    );
                                })}
                                <TableRow>
                                    <TableCell colSpan={3} align="right"><strong>Tổng tiết kiệm:</strong></TableCell>
                                    <TableCell colSpan={2}>
                                        <strong>
                                            {Object.keys(QUOTA_COSTS).reduce((total, endpoint) => {
                                                const count = cacheKeys.filter(key => key.startsWith(endpoint)).length;
                                                return total + (count * QUOTA_COSTS[endpoint]);
                                            }, 0)} units
                                        </strong>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Cached Items ({cacheKeys.length})
                    </Typography>
                    {loading ? (
                        <Box display="flex" justifyContent="center" p={2}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : cacheKeys.length === 0 ? (
                        <Typography variant="body2" align="center" color="textSecondary">
                            No cache items found
                        </Typography>
                    ) : (
                        <List>
                            {cacheKeys.slice(0, 10).map((key) => (
                                <React.Fragment key={key}>
                                    <ListItem className={classes.cacheItem}>
                                        <ListItemText
                                            primary={key}
                                            className={classes.cacheKeyText}
                                            secondary={`Expires: ${new Date(cacheService.cache[key].expiry).toLocaleString()}`}
                                        />
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleDeleteCacheItem(key)}
                                        >
                                            Delete
                                        </Button>
                                    </ListItem>
                                    <Divider component="li" />
                                </React.Fragment>
                            ))}
                            {cacheKeys.length > 10 && (
                                <ListItem>
                                    <ListItemText
                                        primary={`${cacheKeys.length - 10} more items...`}
                                        secondary="Showing only first 10 items"
                                    />
                                </ListItem>
                            )}
                        </List>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CacheManager; 