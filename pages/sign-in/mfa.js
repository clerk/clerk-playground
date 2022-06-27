import { SignIn, useSignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import common from '/styles/Common.module.css';
import styles from '/styles/SignIn.module.css';

const SignInMultifactorPage = () => {
  const { signIn, setSession } = useSignIn();
  const router = useRouter();

  const handleSubmit = async (event) => {
    const formData = new FormData(event.target);
    const identifier = formData.get('email');
    const code = formData.get('mobileCode');
    const strategy = formData.get('strategy');

    event.preventDefault();

    const response = await signIn.attemptSecondFactor({
      strategy: 'phone_code',
      code
    });

    if (response.status === 'complete') {
      setSession(response.createdSessionId, () =>
        router.push(`/?strategy=${strategy}&mfa=true`)
      );
    }
  };

  useEffect(() => {
    if (signIn && signIn.status === 'needs_second_factor') {
      const prepare = async () => {
        await signIn.prepareSecondFactor({
          strategy: 'phone_code'
        });
      };

      prepare();
    }
  }, []);

  return (
    <div className={common.container}>
      <h1>Welcome back to Clerk Playground!</h1>
      <p>It appears your account has multifactor authentication enabled.</p>
      <p>Enter the verification code sent to your mobile device below.</p>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="emailAddress">Email address</label>
          <input
            id="emailAddress"
            name="email"
            type="email"
            placeholder="you@company.com"
            defaultValue={signIn?.identifier}
            required
          />
        </div>
        <div className={styles.field}>
          <label>Verfication code</label>
          <input
            type="text"
            name="mobileCode"
            placeholder="Code from mobile"
            required
          />
        </div>
        <input type="hidden" name="strategy" value="email_link" />
        <button className={common.button} type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
};

export default SignInMultifactorPage;
