import Link from 'next/link';
import { useRouter } from 'next/router';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

import common from '/styles/Common.module.css';
import styles from '/styles/Header.module.css';

const Header = () => {
  const { asPath } = useRouter();

  return (
    <header className={styles.header}>
      <SignedOut>
        {asPath !== '/sign-in' ? (
          <p>
            Been here before?{' '}
            <Link href="/sign-in">
              <a className={common.link}>Sign in</a>
            </Link>
          </p>
        ) : (
          <p>
            New user?{' '}
            <Link href="/sign-up">
              <a className={common.link}>Sign up</a>
            </Link>
          </p>
        )}
      </SignedOut>
      <SignedIn>
        <UserButton
          userProfileURL="/user"
          afterSignOutAll="/"
          afterSignOutOneUrl="/"
        />
      </SignedIn>
    </header>
  );
};

export default Header;
