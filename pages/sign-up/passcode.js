import { useSignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import common from '/styles/Common.module.css';
import styles from '/styles/Form.module.css';

const PasscodeSignUp = () => {
  const { signUp, setSession } = useSignUp();
  const router = useRouter();
  const [status, setStatus] = useState('');

  const handleError = (err) => console.error(err);

  const handleSubmit = async (event) => {
    const formData = new FormData(event.target);
    const emailAddress = formData.get('email');
    const code = formData.get('code');
    const strategy = 'email_code';

    event.preventDefault();

    if (status === 'unverified') {
      try {
        const response = await signUp.attemptEmailAddressVerification({
          code
        });

        if (response.status === 'complete') {
          setSession(response.createdSessionId, () =>
            router.push(`/?strategy=${strategy}`)
          );
        }
        return;
      } catch (err) {
        handleError(err);
      }
    }

    try {
      await signUp.create({
        strategy,
        emailAddress
      });

      setStatus('unverified');

      await signUp.prepareEmailAddressVerification();
    } catch (err) {
      if (err?.errors?.[0]?.code === 'form_identifier_exists') {
        setStatus('error');
      } else {
        handleError(err);
      }
    }
  };

  return (
    <div className={common.container}>
      <h1 className={common.title}>Sign up with One-Time Passcode</h1>
      <p>
        Clerk supports passwordless authentication, which enables users to sign
        in without needing to set a password. Two ways of enabling passwordless
        authentication is using either email or SMS verification codes. Users
        receive a one-time code that will be used to complete the authentication
        process.
      </p>
      <p>
        In this instance, email address is required. Sign up by entering your
        email address below.
      </p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" required />
        </div>
        {status === 'unverified' ? (
          <>
            <div className={styles.field}>
              <label htmlFor="code">Verification code</label>
              <input id="code" name="code" type="text" required />
            </div>
            <div className={styles.message}>
              Check your email inbox for one-time verification code
            </div>
          </>
        ) : null}
        {status === 'error' ? (
          <div className={styles.warning}>
            You've already signed up.{' '}
            <Link href="/sign-in">
              <a className={common.link}>Sign in</a>
            </Link>{' '}
            instead.
          </div>
        ) : null}
        {status !== 'verified' ? (
          <button className={common.button} type="submit">
            {status === 'unverified' ? 'Verify' : 'Send'} email code
          </button>
        ) : null}
      </form>
    </div>
  );
};

export default PasscodeSignUp;
