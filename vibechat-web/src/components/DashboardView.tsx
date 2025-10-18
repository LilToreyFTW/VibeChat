'use client';

import React from 'react';
import { useDashboard } from './DashboardProvider';
import { DashboardOverview } from './DashboardOverview';
import { ChatRoomsView } from './ChatRoomsView';
import { AdminPanelView } from './AdminPanelView';
import { DesktopAppView } from './DesktopAppView';
import { SettingsView } from './SettingsView';

export const DashboardView: React.FC = () => {
  const { currentView } = useDashboard();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'chat':
        return <ChatRoomsView />;
      case 'admin':
        return <AdminPanelView />;
      case 'desktop':
        return <DesktopAppView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex-1">
      {renderView()}
    </div>
  );
};
