import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography
} from '@material-ui/core';
import PlaylistService from '../../services/playlist.service';

const PlaylistDialog = ({ open, onClose, onSuccess, playlist = null }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [privacy, setPrivacy] = useState('private');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (playlist) {
            setName(playlist.name || '');
            setDescription(playlist.description || '');
            setPrivacy(playlist.privacy || 'private');
        } else {
            setName('');
            setDescription('');
            setPrivacy('private');
        }
        setError(null);
    }, [playlist, open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!name.trim()) {
                throw new Error('Tên playlist không được để trống');
            }

            let result;
            if (playlist) {
                // TODO: Update existing playlist (to be implemented)
                result = playlist;
            } else {
                // Create new playlist
                result = await PlaylistService.createPlaylist(name, description, privacy);
            }

            onSuccess(result);
            onClose();
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{playlist ? 'Chỉnh sửa playlist' : 'Tạo playlist mới'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Tên playlist *"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        required
                        error={error && !name.trim()}
                        helperText={error && !name.trim() ? 'Tên playlist không được để trống' : ''}
                    />
                    <TextField
                        margin="dense"
                        label="Mô tả"
                        fullWidth
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="privacy-label">Chế độ riêng tư</InputLabel>
                        <Select
                            labelId="privacy-label"
                            value={privacy}
                            onChange={(e) => setPrivacy(e.target.value)}
                            disabled={loading}
                        >
                            <MenuItem value="private">Riêng tư</MenuItem>
                            <MenuItem value="unlisted">Không công khai</MenuItem>
                            <MenuItem value="public">Công khai</MenuItem>
                        </Select>
                    </FormControl>
                    {error && <Typography color="error" style={{ marginTop: 16 }}>{error}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="default" disabled={loading}>
                        Hủy
                    </Button>
                    <Button type="submit" color="primary" disabled={loading}>
                        {loading ? 'Đang lưu...' : (playlist ? 'Cập nhật' : 'Tạo playlist')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default PlaylistDialog; 