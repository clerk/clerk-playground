import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

import styles from '/styles/Header.module.css';

const Header = () => {
  const { asPath } = useRouter();

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link href="/">
          <a className={styles.logo}>Clerk Playground</a>
        </Link>
        <a
          className={styles.repo}
          href="https://github.com/clerkinc/clerk-playground/"
          target="_blank"
          title="View source on GitHub"
        >
          <Image
            alt="GitHub logo"
            src="/logos/github.svg"
            width={25}
            height={25}
          />
        </a>
      </div>
      <div className={styles.actions}>
        <SignedIn>
          <Link href="/sdk-explorer">
            <a className={styles.button}>Explore the SDK</a>
          </Link>
          <Link href="/components">
            <a className={styles.secondaryButton}>View Components</a>
          </Link>
        </SignedIn>

        <SignedOut>
          {asPath !== '/sign-in' ? (
            <p className={styles.p}>
              Been here before?{' '}
              <Link href="/sign-in">
                <a className={styles.link}>Sign in</a>
              </Link>
            </p>
          ) : (
            <p className={styles.p}>
              New user?{' '}
              <Link href="/sign-up">
                <a className={styles.link}>Sign up</a>
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
      </div>
    </header>
  );
};

export default Header;
