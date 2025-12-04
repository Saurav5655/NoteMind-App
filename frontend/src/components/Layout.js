import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, user }) => {
    return (
        <div className="flex h-screen bg-background overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header user={user} />
                <main className="flex-1 overflow-hidden relative">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
