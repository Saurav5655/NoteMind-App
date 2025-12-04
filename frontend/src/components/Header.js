import React from 'react';

function Header({ user }) {
  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3 pl-4 border-l border-border">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-none">{user.displayName}</p>
              <p className="text-xs text-muted-foreground mt-1">Free Plan</p>
            </div>

            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-background overflow-hidden">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-primary">
                  {user.displayName ? user.displayName[0] : 'U'}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
