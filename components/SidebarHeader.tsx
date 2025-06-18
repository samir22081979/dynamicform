
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarHeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ 
  collapsed, 
  setCollapsed, 
  isMobile 
}) => {
  return (
    <div className={cn(
      "flex items-center h-16 px-4 border-b border-sidebar-border",
      collapsed ? "justify-center" : "justify-between"
    )}>
      {!collapsed && (
        <Link to="/dashboard" className="font-bold text-xl text-white flex items-center">
          <FileText className="mr-2" size={24} />
          FormCraft
        </Link>
      )}
      {collapsed && (
        <Link to="/dashboard" className="text-white">
          <FileText size={24} />
        </Link>
      )}
      
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </Button>
      )}
    </div>
  );
};

export default SidebarHeader;
