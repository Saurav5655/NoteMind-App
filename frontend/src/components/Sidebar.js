import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';

function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#252526',
          color: '#ececf1',
        },
      }}
    >
      <List>
        <ListItem button>
          <ListItemText primary="All Notes" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Favorites" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Trash" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar;
