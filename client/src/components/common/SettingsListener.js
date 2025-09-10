import { useEffect } from 'react';
import { useSettingsStore } from '../../stores';

// Component to listen for settings changes and refresh automatically
const SettingsListener = () => {
  const { refreshSettings } = useSettingsStore();

  useEffect(() => {
    // Listen for settings update events
    const handleSettingsUpdate = () => {
      console.log('Settings updated, refreshing...');
      refreshSettings();
    };

    // Listen for custom event when settings are updated
    window.addEventListener('settingsUpdated', handleSettingsUpdate);

    // Also refresh on page focus (in case settings were updated in another tab)
    const handlePageFocus = () => {
      console.log('Page focused, refreshing settings...');
      refreshSettings();
    };

    window.addEventListener('focus', handlePageFocus);

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
      window.removeEventListener('focus', handlePageFocus);
    };
  }, [refreshSettings]);

  return null; // This component doesn't render anything
};

export default SettingsListener;
