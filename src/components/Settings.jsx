import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Settings as SettingsIcon, Globe, Palette, Bell, Save } from 'lucide-react';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedNotifications = localStorage.getItem('notifications') !== 'false';
    
    setDarkMode(savedDarkMode);
    setNotifications(savedNotifications);
  }, []);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    
    // Update document direction based on language
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  const handleDarkModeChange = (checked) => {
    setDarkMode(checked);
    localStorage.setItem('darkMode', checked.toString());
    // Here you would typically apply dark mode styles
  };

  const handleNotificationsChange = (checked) => {
    setNotifications(checked);
    localStorage.setItem('notifications', checked.toString());
  };

  const handleSaveChanges = () => {
    // Show success message or toast
    alert(t('save_changes') + ' ✓');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-cyan-400 rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-cyan-500/20 rounded-xl backdrop-blur-sm border border-cyan-400/30">
              <SettingsIcon className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{t('settings_title')}</h1>
              <p className="text-cyan-200 mt-1">{t('customize_platform')}</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Language Settings */}
          <Card className="glass-card border-primary/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground">
                <Globe className="w-6 h-6 text-primary" />
                {t('language_settings')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language" className="text-muted-foreground">
                  {t('select_language')}
                </Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="bg-background/50 border-primary/30 text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-primary/30">
                    <SelectItem value="ar" className="text-foreground hover:bg-primary/10">
                      🇸🇦 {t('arabic')}
                    </SelectItem>
                    <SelectItem value="en" className="text-foreground hover:bg-primary/10">
                      🇺🇸 {t('english')}
                    </SelectItem>
                    <SelectItem value="fr" className="text-foreground hover:bg-primary/10">
                      🇫🇷 {t('french')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card className="glass-card border-primary/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground">
                <Palette className="w-6 h-6 text-primary" />
                {t('theme_settings')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="dark-mode" className="text-muted-foreground">
                    {t('dark_mode')}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={handleDarkModeChange}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="glass-card border-primary/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground">
                <Bell className="w-6 h-6 text-primary" />
                {t('notifications')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="notifications" className="text-muted-foreground">
                    {t('enable_notifications')}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about shipments and updates
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={handleNotificationsChange}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleSaveChanges}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Save className="w-5 h-5 mr-2" />
              {t('save_changes')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

