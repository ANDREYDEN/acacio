const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['ru-UA', 'en-CA'],
    defaultLocale: 'en-CA'
  }
}

module.exports = nextConfig
