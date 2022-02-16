import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Menu from '../components/Menu'
import '../i18n'
import { useTranslation } from 'react-i18next'

function MyApp({ Component, pageProps }: AppProps) {
    const { t } = useTranslation()

  return (
    <Menu>
        <Head>
            <title>{t('main.title')}</title>
            <link rel='icon' href={'/favicon.ico'}/>
            <meta
                name='description'
                content='BARACACIA admin management tool'
            />
        </Head>
        <Component {...pageProps} />
        <ToastContainer
            position='top-right'
            autoClose={8000}
            hideProgressBar={false}
            newestOnTop={false}
            draggable={false}
            closeOnClick
            pauseOnHover
            bodyStyle={{ fontFamily: 'Manrope' }}
        />
    </Menu>
  )
}

export default MyApp
