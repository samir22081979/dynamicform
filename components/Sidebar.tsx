
import React from 'react';
import { cn } from '@/lib/utils';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SidebarHeader from '@/components/SidebarHeader';
import SidebarNavigation from '@/components/SidebarNavigation';
import SidebarUserSection from '@/components/SidebarUserSection';
import SidebarMobileMenu from '@/components/SidebarMobileMenu';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
  showMobileSidebar: boolean;
  setShowMobileSidebar: (show: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed, 
  setCollapsed, 
  isMobile, 
  showMobileSidebar, 
  setShowMobileSidebar 
}) => {
  // Handle visibility based on mobile vs desktop
  const sidebarVisibility = isMobile
    ? showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
    : 'translate-x-0';
  
  return (
    <>
      <SidebarMobileMenu 
        isMobile={isMobile}
        showMobileSidebar={showMobileSidebar}
        setShowMobileSidebar={setShowMobileSidebar}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full z-50 bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64",
          sidebarVisibility
        )}
      >
        <SidebarHeader 
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isMobile={isMobile}
        />

        <SidebarNavigation collapsed={collapsed} />

        {/* Language Switcher */}
        <div className={cn(
          "border-t border-sidebar-border p-4",
          collapsed ? "flex justify-center" : ""
        )}>
          <LanguageSwitcher />
        </div>

        <SidebarUserSection collapsed={collapsed} />
      </aside>
    </>
  );
};

export default Sidebar;
