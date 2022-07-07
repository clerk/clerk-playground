import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { OAUTH_PROVIDERS } from '../../utils/constants';

import common from '/styles/Common.module.css';
import styles from '/styles/Form.module.css';

const SocialSignUp = () => {
  const { signUp } = useSignUp();

  const signUpWith = async (strategy) => {
    signUp.authenticateWithRedirect({
      strategy,
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/?strategy=oauth'
    });
  };

  return (
    <div className={common.container}>
      <h1 className={common.title}>Sign up with Social Provider</h1>
      <p>
        Clerk allows users to sign up using OAuth (Open Authentication) social
        providers. A user can use their account from another website (such as
        Google or Twitter) to sign in to another website without having to
        re-enter common credentials.
      </p>
      <p>Sign up using one of your existing social accounts.</p>
      <section className={styles.actions}>
        {OAUTH_PROVIDERS.map((provider) => (
          <button
            className={common.button}
            onClick={() => signUpWith(provider.strategy)}
          >
            Sign up with your {provider.name} account
          </button>
        ))}
      </section>
    </div>
  );
};

export default SocialSignUp;
