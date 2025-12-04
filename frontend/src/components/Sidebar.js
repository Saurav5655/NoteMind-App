import React from 'react';

function Sidebar() {
  const menuItems = [
    { label: 'All Notes', icon: '📝' },
    { label: 'Favorites', icon: '⭐' },
    { label: 'Trash', icon: '🗑️' },
  ];

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full transition-all duration-300 ease-in-out">
      <div className="p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          NoteMind
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center space-x-3 px-4 py-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-accent/50 rounded-lg p-4">
          <p className="text-xs text-muted-foreground text-center">
            Pro Plan Active
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
