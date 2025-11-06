import React from 'react';
import { ListItem, ListItemText } from '@mui/material';

function Note({ note }) {
  return (
    <ListItem button>
      <ListItemText primary={note.title} secondary={note.content} />
    </ListItem>
  );
}

export default Note;
