import { useUser } from '@clerk/nextjs';
import Header from './Header';
import Navigation from './Navigation';

import { FEATURE_LINKS, FLOW_LINKS } from '/utils/constants';
import styles from '/styles/Layout.module.css';

const Layout = ({ children }) => {
  const { isSignedIn } = useUser();

  return (
    <>
      <Header />
      <div className={styles.container}>
        <Navigation links={isSignedIn ? FEATURE_LINKS : FLOW_LINKS} />
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
};

export default Layout;
