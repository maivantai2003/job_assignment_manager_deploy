import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "time": "Time"
        }
      },
      vi: {
        translation: {
          "time": "Thời gian"
        }
      }
    },
    lng: "en", // ngôn ngữ mặc định
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // không cần cho React
    }
  });

export default i18n;
