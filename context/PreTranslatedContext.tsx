"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Pre-translated content (you can add more languages)
const TRANSLATIONS = {
  en: {
    // Navigation
    'AYUSH Healthcare System': 'AYUSH Healthcare System',
    'Demo': 'Demo',
    'Documentation': 'Documentation',
    'Login': 'Login',
    'Export Data': 'Export Data',
    
    // Form Labels
    'Patient Information': 'Patient Information',
    'Basic Details': 'Basic Details',
    'Additional Details': 'Additional Details',
    'Full Name': 'Full Name',
    'Date of Birth': 'Date of Birth',
    'Gender': 'Gender',
    'Phone Number': 'Phone Number',
    'Email Address': 'Email Address',
    'Address': 'Address',
    'Emergency Contact': 'Emergency Contact',
    'Medical History': 'Medical History',
    'Known Allergies': 'Known Allergies',
    'Current Medications': 'Current Medications',
    'AYUSH Disease Information': 'AYUSH Disease Information',
    'Search Disease': 'Search Disease',
    'Selected Disease': 'Selected Disease',
    'Generate FHIR Bundle': 'Generate FHIR Bundle',
    'Previous': 'Previous',
    'Next': 'Next',
    
    // Placeholders
    'Enter patient\'s full name': 'Enter patient\'s full name',
    'Enter phone number': 'Enter phone number',
    'Enter email address': 'Enter email address',
    'Street address': 'Street address',
    'City': 'City',
    'State': 'State',
    'Type to search AYUSH diseases...': 'Type to search AYUSH diseases...',
    
    // Messages
    'Bridging Traditional Medicine with Modern Standards': 'Bridging Traditional Medicine with Modern Standards',
    'Comprehensive Database of Traditional Medicine Conditions': 'Comprehensive Database of Traditional Medicine Conditions',
  },
  
  hi: {
    // Navigation (Hindi)
    'NavaSetu': 'नवसेतु',
    'AYUSH Healthcare System': 'आयुष स्वास्थ्य सेवा प्रणाली',
    'Demo': 'डेमो',
    'Documentation': 'दस्तावेजीकरण',
    'Login': 'लॉगिन',
    'Export Data': 'डेटा निर्यात करें',
    'Translate': 'अनुवाद',
    
    // Form Labels (Hindi)
    'Patient Information': 'रोगी की जानकारी',
    'Basic Details': 'बुनियादी विवरण',
    'Additional Details': 'अतिरिक्त विवरण',
    'Full Name': 'पूरा नाम',
    'Date of Birth': 'जन्म तिथि',
    'Gender': 'लिंग',
    'Phone Number': 'फोन नंबर',
    'Email Address': 'ईमेल पता',
    'Address': 'पता',
    'Emergency Contact': 'आपातकालीन संपर्क',
    'Medical History': 'चिकित्सा इतिहास',
    'Known Allergies': 'ज्ञात एलर्जी',
    'Current Medications': 'वर्तमान दवाएं',
    'AYUSH Disease Information': 'आयुष रोग की जानकारी',
    'Search Disease': 'रोग खोजें',
    'Selected Disease': 'चयनित रोग',
    'Generate FHIR Bundle': 'FHIR बंडल जेनरेट करें',
    'Previous': 'पिछला',
    'Next': 'अगला',
    // {t('')}
    // Placeholders (Hindi)
    'Enter patient\'s full name': 'रोगी का पूरा नाम दर्ज करें',
    'Enter phone number': 'फोन नंबर दर्ज करें',
    'Enter email address': 'ईमेल पता दर्ज करें',
    'Street address': 'सड़क का पता',
    'City': 'शहर',
    'State': 'राज्य',
    'Type to search AYUSH diseases...': 'आयुष रोगों की खोज के लिए टाइप करें...',
    
    // Messages (Hindi)
    'Bridging Traditional Medicine with Modern Standards': 'पारंपरिक चिकित्सा को आधुनिक मानकों से जोड़ना',
    'Comprehensive Database of Traditional Medicine Conditions': 'पारंपरिक चिकित्सा स्थितियों का व्यापक डेटाबेस',
  },
  
  mr: {
    // Navigation (Marathi)
    'NavaSetu': 'नवसेतू',
    'AYUSH Healthcare System': 'आयुष आरोग्य सेवा प्रणाली',
    'Demo': 'डेमो',
    'Documentation': 'दस्तऐवजीकरण',
    'Login': 'लॉगिन',
    'Export Data': 'डेटा निर्यात करा',
    'Translate': 'भाषांतर करा',
    
    // Form Labels (Marathi)
    'Patient Information': 'रुग्णाची माहिती',
    'Basic Details': 'मूलभूत तपशील',
    'Additional Details': 'अतिरिक्त तपशील',
    'Full Name': 'पूर्ण नाव',
    'Date of Birth': 'जन्म तारीख',
    'Gender': 'लिंग',
    'Phone Number': 'फोन नंबर',
    'Email Address': 'ईमेल पत्ता',
    'Address': 'पत्ता',
    'Emergency Contact': 'आपत्कालीन संपर्क',
    'Medical History': 'वैद्यकीय इतिहास',
    'Known Allergies': 'ज्ञात ऍलर्जी',
    'Current Medications': 'सध्याची औषधे',
    'AYUSH Disease Information': 'आयुष रोग माहिती',
    'Search Disease': 'रोग शोधा',
    'Selected Disease': 'निवडलेला रोग',
    'Generate FHIR Bundle': 'FHIR बंडल तयार करा',
    'Previous': 'मागील',
    'Next': 'पुढील',
    
    // Placeholders (Marathi)
    'Enter patient\'s full name': 'रुग्णाचे पूर्ण नाव प्रविष्ट करा',
    'Enter phone number': 'फोन नंबर प्रविष्ट करा',
    'Enter email address': 'ईमेल पत्ता प्रविष्ट करा',
    'Street address': 'रस्त्याचा पत्ता',
    'City': 'शहर',
    'State': 'राज्य',
    'Type to search AYUSH diseases...': 'आयुष रोग शोधण्यासाठी टाइप करा...',
    
    // Messages (Marathi)
    'Bridging Traditional Medicine with Modern Standards': 'पारंपरिक औषधोपचार आधुनिक मानकांशी जोडणे',
    'Comprehensive Database of Traditional Medicine Conditions': 'पारंपरिक औषधोपचार परिस्थितींचा व्यापक डेटाबेस',
  }
};

// Supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
];

interface PreTranslatedContextType {
  currentLanguage: string;
  setLanguage: (langCode: string) => void;
  t: (key: string) => string;
  getSupportedLanguages: () => typeof SUPPORTED_LANGUAGES;
}

const PreTranslatedContext = createContext<PreTranslatedContextType | undefined>(undefined);

interface PreTranslatedProviderProps {
  children: ReactNode;
}

export function PreTranslatedProvider({ children }: PreTranslatedProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && SUPPORTED_LANGUAGES.some(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('preferred-language', currentLanguage);
  }, [currentLanguage]);

  const setLanguage = (langCode: string) => {
    if (SUPPORTED_LANGUAGES.some(lang => lang.code === langCode)) {
      setCurrentLanguage(langCode);
    }
  };

  const t = (key: string): string => {
    const translations = TRANSLATIONS[currentLanguage as keyof typeof TRANSLATIONS];
    return translations?.[key as keyof typeof translations] || key;
  };

  const getSupportedLanguages = () => SUPPORTED_LANGUAGES;

  const value: PreTranslatedContextType = {
    currentLanguage,
    setLanguage,
    t,
    getSupportedLanguages,
  };

  return (
    <PreTranslatedContext.Provider value={value}>
      {children}
    </PreTranslatedContext.Provider>
  );
}

export function usePreTranslation() {
  const context = useContext(PreTranslatedContext);
  if (context === undefined) {
    throw new Error('usePreTranslation must be used within a PreTranslatedProvider');
  }
  return context;
}