import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

function NoteList() {
  return (
    <List>
      <ListItem button>
        <ListItemText primary="Note 1" secondary="This is a sample note." />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Note 2" secondary="This is another sample note." />
      </ListItem>
    </List>
  );
}

export default NoteList;
