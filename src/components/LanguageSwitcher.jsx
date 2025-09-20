import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    
    // Update document direction based on language
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-400" />
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-32 h-8 bg-background/50 border-primary/30 text-foreground text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-background border-primary/30">
          <SelectItem value="ar" className="text-foreground hover:bg-primary/10">
            🇸🇦 العربية
          </SelectItem>
          <SelectItem value="en" className="text-foreground hover:bg-primary/10">
            🇺🇸 English
          </SelectItem>
          <SelectItem value="fr" className="text-foreground hover:bg-primary/10">
            🇫🇷 Français
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
