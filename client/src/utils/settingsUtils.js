// Utility functions for settings management

// Trigger settings update event
export const triggerSettingsUpdate = () => {
  const event = new CustomEvent('settingsUpdated');
  window.dispatchEvent(event);
};

// Force refresh settings in all components
export const refreshAllSettings = () => {
  triggerSettingsUpdate();
};
