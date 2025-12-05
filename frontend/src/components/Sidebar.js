import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, user }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'LayoutDashboard', label: 'Dashboard' },
    { id: 'notes', icon: 'StickyNote', label: 'My Notes' },
    { id: 'chat', icon: 'MessageSquare', label: 'AI Chat' },
    { id: 'files', icon: 'FileText', label: 'Documents' },
    { id: 'settings', icon: 'Settings', label: 'Settings' },
  ];

  return (
    <div className="w-64 h-full bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col p-4 animate-fade-in z-50">
      {/* Logo area */}
      <div className="flex items-center gap-3 px-4 py-6 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-lovable-purple to-lovable-blue flex items-center justify-center shadow-lg shadow-lovable-purple/20">
          <span className="text-white font-bold text-lg">N</span>
        </div>
        <h1 className="text-xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          NoteMind
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${activeTab === item.id
                ? 'bg-white/10 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            {/* Icons using simple text for now, should replace with Lucide later if available */}
            <div className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
              {item.icon === 'LayoutDashboard' && '📊'}
              {item.icon === 'StickyNote' && '📝'}
              {item.icon === 'MessageSquare' && '✨'}
              {item.icon === 'FileText' && '📂'}
              {item.icon === 'Settings' && '⚙️'}
            </div>
            <span className="font-medium relative z-10">{item.label}</span>
            {activeTab === item.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-lovable-purple/10 to-transparent opacity-50" />
            )}
          </button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-white font-medium shadow-md group-hover:shadow-lovable-purple/20 transition-all">
            {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.displayName || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
