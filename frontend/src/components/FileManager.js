import React, { useState } from 'react';
import { List, ListItem, ListItemText, Button, TextField } from '@mui/material';

const FileManager = () => {
    const [files, setFiles] = useState(['index.html', 'style.css', 'script.js']);
    const [newFileName, setNewFileName] = useState('');

    const handleCreateFile = () => {
        if (newFileName.trim() !== '') {
            setFiles([...files, newFileName.trim()]);
            setNewFileName('');
        }
    };

    return (
        <div>
            <List>
                {files.map((file, index) => (
                    <ListItem button key={index}>
                        <ListItemText primary={file} />
                    </ListItem>
                ))}
            </List>
            <div style={{ padding: '16px' }}>
                <TextField
                    label="New File Name"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    size="small"
                    variant="outlined"
                />
                <Button onClick={handleCreateFile} variant="contained" style={{ marginTop: '8px' }}>
                    Create File
                </Button>
            </div>
        </div>
    );
};

export default FileManager;
