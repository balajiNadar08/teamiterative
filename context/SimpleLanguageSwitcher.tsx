"use client";

import { useState } from 'react';
import { usePreTranslation } from './PreTranslatedContext';

export default function SimpleLanguageSwitcher() {
  const { currentLanguage, setLanguage, getSupportedLanguages } = usePreTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const supportedLanguages = getSupportedLanguages();

  const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      {/* Language Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-all duration-200 cursor-pointer"
      >
        {/* Globe Icon */}
        <svg 
          className="w-4 h-4 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9" 
          />
        </svg>
        
        {/* Current Language */}
        <span className="text-sm font-medium">
          {currentLang?.nativeName || 'English'}
        </span>
        
        {/* Dropdown Arrow */}
        <svg 
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
            <div className="py-2">
              {supportedLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    setLanguage(language.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-150 cursor-pointer ${
                    currentLanguage === language.code 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{language.nativeName}</span>
                    {language.code !== 'en' && (
                      <span className="text-xs text-gray-500">{language.name}</span>
                    )}
                  </div>
                  {currentLanguage === language.code && (
                    <svg 
                      className="w-4 h-4 text-blue-600 float-right mt-0.5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}