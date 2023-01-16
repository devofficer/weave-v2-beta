// eslint-disable-next-line
import '../styles/loader.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createContext, useContext, useEffect, useState } from 'react'
import Router from 'next/router';
import { ChakraProvider } from '@chakra-ui/react'
import CSSReset from "@chakra-ui/css-reset";
import 'reactflow/dist/style.css';
import { theme } from '../theme'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, useStore } from 'state'
import useSWRImmutable from 'swr/immutable'
import { Web3Provider } from '@ethersproject/providers'
import { useAccount, WagmiConfig, useNetwork } from 'wagmi';
import { client } from 'utils/wagmi';
import { useLPFarms } from 'hooks/useLPFarms';
import useEagerConnect from 'hooks/useEagerConnect';
import Loader from 'components/common/Loader';
import { withTRPC } from '@trpc/next'
import { loggerLink } from '@trpc/client/links/loggerLink';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import superjson from 'superjson';
import { AppRouter } from 'server/route/app.router';
import { useAllTokens } from 'hooks/useTokens';
import { useTokensPrice } from 'hooks/useTokensPrice';


const Web3LibraryContext = createContext<Web3Provider | undefined>(undefined)

export const useWeb3LibraryContext = () => {
  return useContext(Web3LibraryContext)
}

const Web3LibraryProvider: React.FC<React.PropsWithChildren> = (props) => {
  const { connector } = useAccount()
  const { chain } = useNetwork()
  const { data: library } = useSWRImmutable(connector && ['web3-library', connector, chain], async () => {
    const provider = await connector?.getProvider()
    return new Web3Provider(provider)
  })

  return <Web3LibraryContext.Provider value={library}>{props.children}</Web3LibraryContext.Provider>
}

function GlobalHooks() {
  useEagerConnect()
  useLPFarms()
  useAllTokens()
  // useTokensPrice()
  return null
}

function MyApp({ Component, pageProps }: AppProps<{ initialReduxState: any }>) {
  const [loading, setLoading] = useState(false)
  const store = useStore(pageProps.initialReduxState)

  useEffect(() => {
    Router.events.on('routeChangeStart', () => setLoading(true));
    Router.events.on('routeChangeComplete', () => setLoading(false));
    Router.events.on('routeChangeError', () => setLoading(false));
    return () => {
      Router.events.off('routeChangeStart', () => setLoading(true));
      Router.events.off('routeChangeComplete', () => setLoading(false));
      Router.events.off('routeChangeError', () => setLoading(false));
    };
  }, [])

  return (
    <>

      <WagmiConfig client={client}>
        <Web3LibraryProvider>
          <Provider store={store}>
            <GlobalHooks />
            <ChakraProvider theme={theme}>
              <CSSReset />
              <PersistGate loading={null} persistor={persistor}>
                {loading ? (
                  <Loader />
                ) : (
                  <Component {...pageProps} />
                )}
              </PersistGate>
            </ChakraProvider>
          </Provider>
        </Web3LibraryProvider >
      </WagmiConfig >
    </>
  )
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = '/api/trpc'

    const links = [
      loggerLink(),
      httpBatchLink({
        maxBatchSize: 10,
        url
      })
    ]
    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 60,
            refetchOnWindowFocus: false
          }
        }
      },
      headers() {
        if (ctx?.req) {
          return {
            ...ctx.req.headers,
            'x-ssr': '1'
          }
        }
        return {}
      },
      links,
      transformer: superjson
    }
  },
  ssr: false
})(MyApp)
