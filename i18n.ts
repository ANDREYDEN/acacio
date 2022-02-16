import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import translation_en from './translations/en/translation.json'
import translation_ru from './translations/ru/translation.json'

i18n
    // loads translations from your server
    // .use(Backend)
    // detect user language
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    .init({
        debug: true,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                translation: translation_en
            },
            ru: {
                translation: translation_ru
            }
        }
    })

export default i18n