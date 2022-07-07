import '/styles/globals.css';
import {
  ClerkProvider,
  RedirectToSignUp,
  SignedIn,
  SignedOut
} from '@clerk/nextjs';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '/components/Layout';

/**
 * List pages you want to be publicly accessible, or leave empty if
 * every page requires authentication. Use this naming strategy:
 *  "/"              for pages/index.js
 *  "/foo"           for pages/foo/index.js
 *  "/foo/bar"       for pages/foo/bar.js
 *  "/foo/[...bar]"  for pages/foo/[...bar].js
 */
const publicPages = [
  '/sign-in/[[...index]]',
  '/sign-in/mfa',
  '/sign-up/[[...index]]',
  '/verify'
];

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();

  /**
   * If the current route is listed as public, render it directly.
   * Otherwise, use Clerk to require authentication.
   */
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Clerk SDK Playground</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Layout>
        {publicPages.includes(router.pathname) ||
        router.pathname.startsWith('/sign') ? (
          <Component {...pageProps} />
        ) : (
          <>
            <SignedIn>
              <Component {...pageProps} />
            </SignedIn>
            <SignedOut>
              <RedirectToSignUp />
            </SignedOut>
          </>
        )}
      </Layout>
    </ClerkProvider>
  );
};

export default MyApp;
