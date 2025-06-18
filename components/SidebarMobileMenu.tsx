
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface SidebarMobileMenuProps {
  isMobile: boolean;
  showMobileSidebar: boolean;
  setShowMobileSidebar: (show: boolean) => void;
}

const SidebarMobileMenu: React.FC<SidebarMobileMenuProps> = ({ 
  isMobile, 
  showMobileSidebar, 
  setShowMobileSidebar 
}) => {
  const { t } = useTranslation();

  if (!isMobile) return null;

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-40">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background shadow-md"
          onClick={() => setShowMobileSidebar(true)}
        >
          <Menu size={20} />
        </Button>
      </div>

      {/* Overlay for mobile sidebar */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Close button for mobile */}
      {showMobileSidebar && (
        <div className="p-4">
          <Button 
            variant="outline"
            onClick={() => setShowMobileSidebar(false)}
            className="w-full"
          >
            {t('common.close')}
          </Button>
        </div>
      )}
    </>
  );
};

export default SidebarMobileMenu;
