// Danh sách quốc gia phổ biến với mã quốc gia và mã điện thoại
export const countries = [
  { code: 'VN', name: 'Vietnam', phoneCode: '+84', flag: '🇻🇳' },
  { code: 'US', name: 'United States', phoneCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', phoneCode: '+44', flag: '🇬🇧' },
  { code: 'AU', name: 'Australia', phoneCode: '+61', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', phoneCode: '+1', flag: '🇨🇦' },
  { code: 'DE', name: 'Germany', phoneCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', phoneCode: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', phoneCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', phoneCode: '+34', flag: '🇪🇸' },
  { code: 'JP', name: 'Japan', phoneCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', phoneCode: '+82', flag: '🇰🇷' },
  { code: 'CN', name: 'China', phoneCode: '+86', flag: '🇨🇳' },
  { code: 'TH', name: 'Thailand', phoneCode: '+66', flag: '🇹🇭' },
  { code: 'SG', name: 'Singapore', phoneCode: '+65', flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', phoneCode: '+60', flag: '🇲🇾' },
  { code: 'ID', name: 'Indonesia', phoneCode: '+62', flag: '🇮🇩' },
  { code: 'PH', name: 'Philippines', phoneCode: '+63', flag: '🇵🇭' },
  { code: 'IN', name: 'India', phoneCode: '+91', flag: '🇮🇳' },
  { code: 'NL', name: 'Netherlands', phoneCode: '+31', flag: '🇳🇱' },
  { code: 'CH', name: 'Switzerland', phoneCode: '+41', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', phoneCode: '+43', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', phoneCode: '+32', flag: '🇧🇪' },
  { code: 'SE', name: 'Sweden', phoneCode: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', phoneCode: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', phoneCode: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', phoneCode: '+358', flag: '🇫🇮' },
  { code: 'NZ', name: 'New Zealand', phoneCode: '+64', flag: '🇳🇿' },
  { code: 'BR', name: 'Brazil', phoneCode: '+55', flag: '🇧🇷' },
  { code: 'AR', name: 'Argentina', phoneCode: '+54', flag: '🇦🇷' },
  { code: 'MX', name: 'Mexico', phoneCode: '+52', flag: '🇲🇽' },
  { code: 'RU', name: 'Russia', phoneCode: '+7', flag: '🇷🇺' },
  { code: 'ZA', name: 'South Africa', phoneCode: '+27', flag: '🇿🇦' },
  { code: 'EG', name: 'Egypt', phoneCode: '+20', flag: '🇪🇬' },
  { code: 'AE', name: 'United Arab Emirates', phoneCode: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', phoneCode: '+966', flag: '🇸🇦' },
  { code: 'TR', name: 'Turkey', phoneCode: '+90', flag: '🇹🇷' },
  { code: 'IL', name: 'Israel', phoneCode: '+972', flag: '🇮🇱' },
  { code: 'HK', name: 'Hong Kong', phoneCode: '+852', flag: '🇭🇰' },
  { code: 'TW', name: 'Taiwan', phoneCode: '+886', flag: '🇹🇼' },
  { code: 'MO', name: 'Macau', phoneCode: '+853', flag: '🇲🇴' }
];

// Tìm quốc gia theo mã
export const getCountryByCode = (code) => {
  return countries.find(country => country.code === code);
};

// Tìm quốc gia theo mã điện thoại
export const getCountryByPhoneCode = (phoneCode) => {
  return countries.find(country => country.phoneCode === phoneCode);
};
