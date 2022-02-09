import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
        <Head>
            <title>Acacio</title>
            <link rel='icon' href='/favicon.ico'/>
            <meta
                name='description'
                content='BARACACIA admin management tool'
            />
        </Head>
        <Component {...pageProps} />
    </>
  )
}

export default MyApp
