import '@styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import Menu from '@components/Menu'
import { useUpdateAuthCookie } from '@lib/hooks'

function MyApp({ Component, pageProps }: AppProps) {
    useUpdateAuthCookie()

    return (
        <Menu>
            <Head>
                <title>Acacio</title>
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

export default appWithTranslation(MyApp)
