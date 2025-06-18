
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { getDisplayName } from '@/utils/userHelpers';
import { useUserPlan } from '@/hooks/useUserPlan';
import { useTranslation } from 'react-i18next';

interface SidebarUserSectionProps {
  collapsed: boolean;
}

const SidebarUserSection: React.FC<SidebarUserSectionProps> = ({ collapsed }) => {
  const { currentUser, signOut } = useAuth();
  const { isPaidUser } = useUserPlan(currentUser);
  const { t } = useTranslation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div className={cn(
      "border-t border-sidebar-border p-4",
      collapsed ? "text-center" : ""
    )}>
      {!collapsed && currentUser && (
        <div className="mb-2 flex items-center">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-white">
            {getDisplayName(currentUser).charAt(0)}
          </div>
          <div className="ml-2 overflow-hidden">
            <p className="text-sm font-medium truncate">{getDisplayName(currentUser)}</p>
            <p className="text-xs text-sidebar-foreground/80 capitalize">
              {isPaidUser ? t('dashboard.unlimitedFormsPaid') : t('dashboard.formLimitFree')}
            </p>
          </div>
        </div>
      )}

      <Button
        variant="ghost"
        size={collapsed ? "icon" : "default"}
        onClick={handleSignOut}
        className={cn(
          "text-sidebar-foreground hover:bg-sidebar-accent w-full justify-start",
          collapsed ? "justify-center" : ""
        )}
      >
        <LogOut size={18} />
        {!collapsed && <span className="ml-2">{t('common.signOut')}</span>}
      </Button>
    </div>
  );
};

export default SidebarUserSection;
