import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';

import Explorer from './Explorer';
import Header from './Header';
import Navigation from './Navigation';

import { FEATURE_LINKS, FLOW_LINKS } from '/utils/constants';
import styles from '/styles/Layout.module.css';

const Layout = ({ children }) => {
  const { isSignedIn } = useUser();
  const { asPath } = useRouter();
  const isSDK = asPath.startsWith('/sdk');
  const hideNav = isSDK || asPath.startsWith('/components');

  return (
    <>
      <Header />
      <div className={styles.container}>
        {hideNav ? null : (
          <Navigation links={isSignedIn ? FEATURE_LINKS : FLOW_LINKS} />
        )}
        <main className={isSDK ? styles.explorer : styles.main}>
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
