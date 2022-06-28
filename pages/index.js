import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import Link from 'next/link';
import React from 'react';

import { FEATURE_LINKS } from '/utils/constants';
import common from '/styles/Common.module.css';

const Home = () => {
  const { user } = useUser();
  const { query } = useRouter();
  const strategy = query?.strategy || 'email_link';
  const mfa = Boolean(query?.mfa);
  const link = FEATURE_LINKS.find((f) => f.strategy === strategy);

  return (
    <div className={common.container}>
      <h1 className={common.title}>
        Welcome, {user.firstName || user.primaryEmailAddress.emailAddress}!
      </h1>
      <p>
        You've just signed into the Clerk Playground with{' '}
        <Link href={link.path}>
          <a className={common.link}>{link.label}</a>
        </Link>
        {mfa ? (
          <span>
            {' '}
            and{' '}
            <Link href="/mfa">
              <a className={common.link}>Multifactor Auth</a>
            </Link>
          </span>
        ) : null}
        .
      </p>
      <p>← Choose another feature of Clerk to explore.</p>
    </div>
  );
};

export default Home;
