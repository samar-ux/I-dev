import React from 'react';
import { FaYoutube, FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';

const SocialMediaLinks = ({ 
  className = "", 
  size = "default", 
  variant = "default", 
  showLabels = false,
  useDirectLinks = false 
}) => {
  const socialLinks = [
    {
      name: 'YouTube',
      url: 'https://youtube.com/@idev-t8c',
      icon: FaYoutube,
      color: 'text-red-500 hover:text-red-600',
      bgColor: 'hover:bg-red-50 dark:hover:bg-red-900/20'
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/ion_vis32747?t=3xOCEmmSiGkvqIxi5A_FFw&s=09',
      icon: FaTwitter,
      color: 'text-blue-400 hover:text-blue-500',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/idev2325?igsh=MTVpMGpvb2EwazQ2bQ==',
      icon: FaInstagram,
      color: 'text-pink-500 hover:text-pink-600',
      bgColor: 'hover:bg-pink-50 dark:hover:bg-pink-900/20'
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/2023IDEV',
      icon: FaFacebook,
      color: 'text-blue-600 hover:text-blue-700',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/i-dev-agency-4806b8294',
      icon: FaLinkedin,
      color: 'text-blue-700 hover:text-blue-800',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
    }
  ];

  const sizeClasses = {
    sm: 'w-8 h-8',
    default: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const variantClasses = {
    default: 'bg-white/10 hover:bg-white/20 border border-white/20',
    minimal: 'bg-transparent hover:bg-white/10',
    outlined: 'bg-transparent border border-primary/30 hover:border-primary/50',
    filled: 'bg-primary/10 hover:bg-primary/20 border border-primary/20'
  };

  const handleSocialClick = (socialName, url) => {
    console.log(`تم النقر على ${socialName}: ${url}`);
    
    // تأثير بصري عند النقر
    const element = document.activeElement;
    if (element) {
      element.style.transform = 'scale(0.95)';
      setTimeout(() => {
        element.style.transform = '';
      }, 150);
    }
    
    // فتح الرابط في نافذة جديدة
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {socialLinks.map((social) => {
        const Icon = social.icon;
        const commonClasses = `
          ${sizeClasses[size]} 
          ${variantClasses[variant]}
          ${social.color}
          ${social.bgColor}
          rounded-lg 
          flex items-center justify-center 
          transition-all duration-200 
          focus:outline-none focus:ring-2 focus:ring-primary/50
          cursor-pointer
          group
        `;

        if (useDirectLinks) {
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`تابعنا على ${social.name}`}
              className={commonClasses}
              title={`تابعنا على ${social.name} - ${social.url}`}
            >
              <Icon className="w-1/2 h-1/2" />
              {showLabels && (
                <span className="ml-2 text-xs font-medium hidden sm:inline">
                  {social.name}
                </span>
              )}
            </a>
          );
        }

        return (
          <button
            key={social.name}
            onClick={() => handleSocialClick(social.name, social.url)}
            aria-label={`تابعنا على ${social.name}`}
            className={commonClasses}
            title={`تابعنا على ${social.name} - ${social.url}`}
          >
            <Icon className="w-1/2 h-1/2" />
            {showLabels && (
              <span className="ml-2 text-xs font-medium hidden sm:inline">
                {social.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SocialMediaLinks;
