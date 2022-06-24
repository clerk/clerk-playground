import { SignedIn } from '@clerk/nextjs';
import Header from './Header';
import Navigation from './Navigation';

import styles from '/styles/Layout.module.css';

const Layout = ({ children }) => (
  <>
    <Header />
    <div className={styles.container}>
      <SignedIn>
        <Navigation />
      </SignedIn>
      <main className={styles.main}>{children}</main>
    </div>
  </>
);

export default Layout;
