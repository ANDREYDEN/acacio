import '@styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Menu from '@components/Menu'

function MyApp({ Component, pageProps }: AppProps) {
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
