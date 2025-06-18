
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Brain,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface SidebarNavigationProps {
  collapsed: boolean;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ collapsed }) => {
  const location = useLocation();
  const { t } = useTranslation();
  
  const navigationItems = [
    { name: t('navigation.dashboard'), icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: t('navigation.forms'), icon: <FileText size={20} />, path: '/forms' },
    { name: t('navigation.quizzes'), icon: <Brain size={20} />, path: '/quizzes' },
    { name: t('navigation.settings'), icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <nav className="flex-1 pt-4">
      <ul className="space-y-2 px-2">
        {navigationItems.map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-md transition-colors",
                location.pathname === item.path
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
                collapsed ? "justify-center" : ""
              )}
            >
              {item.icon}
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNavigation;
