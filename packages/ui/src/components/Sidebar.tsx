import React from 'react';

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, className = '', ...props }) => {
  return (
    <aside
      className={`w-64 bg-gray-50 border-r border-gray-200 p-4 ${className}`}
      {...props}
    >
      {children}
    </aside>
  );
};

