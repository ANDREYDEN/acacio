const path = require('path')

module.exports = {
    i18n: {
        locales: ['ru-UA', 'en-CA'],
        defaultLocale: 'en-CA',
        localePath: path.resolve('./public/locales')
    }
}