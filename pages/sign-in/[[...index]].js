import { SignIn, useSignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import common from '/styles/Common.module.css';
import styles from '/styles/SignIn.module.css';

const SignInPage = () => {
  const { signIn, setSession } = useSignIn();
  const router = useRouter();
  const [strategy, setStrategy] = useState('');
  const [status, setStatus] = useState('');
  const getButtonText = () => {
    if (!status && strategy !== 'password') {
      return 'Continue';
    }

    if (strategy === 'email_link' && status) {
      return 'Resend link';
    }

    return 'Sign in';
  };

  const signInWithLink = async (strategy, status, formData) => {
    const firstFactor = signIn.supportedFirstFactors.find(
      (f) => f.strategy === strategy
    );
    const { emailAddressId } = firstFactor;
    const { startMagicLinkFlow, cancelMagicLinkFlow } =
      signIn.createMagicLinkFlow();

    const response = await startMagicLinkFlow({
      emailAddressId,
      redirectUrl: `${window.location.origin}/?strategy=${strategy}`
    });

    const verification = response.firstFactorVerification;

    if (verification.status === 'expired') {
      // TODO: Handle expired links
    }

    await cancelMagicLinkFlow();
    if (response.status === 'complete') {
      setSession(response.createdSessionId, () =>
        router.push(`/?strategy=${strategy}`)
      );
      return;
    }
  };

  const signInWithCode = async (strategy, status, formData) => {
    const code = formData.get('code');

    if (status !== 'needs_first_factor') {
      return;
    }

    try {
      const response = await signIn.attemptFirstFactor({
        strategy,
        code
      });

      if (response.status === 'complete') {
        setSession(response.createdSessionId, () =>
          router.push(`/?strategy=${strategy}`)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (event) => {
    const formData = new FormData(event.target);
    const strategy = formData.get('strategy');
    const identifier = formData.get('email');
    const password = formData.get('password');

    event.preventDefault();

    if (!status) {
      // Prepare sign in with strategy and identifier
      const response = await signIn.create({
        strategy,
        identifier,
        password: password || undefined,
        redirect_url: `${window.location.origin}/?strategy=${strategy}`
      });

      setStatus(response.status);

      if (response.status === 'complete') {
        setSession(response.createdSessionId, () =>
          router.push(`/?strategy=${strategy}`)
        );
      }

      return;
    }

    // Attempt sign in with applicable strategy
    if (strategy === 'email_link') {
      return signInWithLink(strategy, status, formData);
    }

    if (strategy === 'email_code') {
      return signInWithCode(strategy, status, formData);
    }
  };

  return (
    <div className={common.container}>
      <h1>Welcome back to Clerk Playground!</h1>
      <p>Been here before? Sign in using the form below.</p>
      <p>
        If it's your first time, you'll want to{' '}
        <Link href="/sign-up">
          <a className={common.link}>sign up</a>
        </Link>{' '}
        instead.
      </p>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="emailAddress">Email address</label>
          <input
            id="emailAddress"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
          />
        </div>
        <fieldset className={styles.field}>
          <legend>How would you like to sign in?</legend>
          <div className={styles.field}>
            <input
              type="radio"
              id="magicLink"
              name="strategy"
              onChange={(e) => setStrategy(e.target.value)}
              value="email_link"
              required
            />
            <label htmlFor="magicLink">Magic link</label>
          </div>
          <div className={styles.field}>
            <input
              type="radio"
              id="passcode"
              name="strategy"
              onChange={(e) => setStrategy(e.target.value)}
              value="email_code"
              required
            />
            <label htmlFor="passcode">One-time passcode</label>
          </div>
          <div className={styles.field}>
            <input
              type="radio"
              id="password"
              name="strategy"
              onChange={(e) => setStrategy(e.target.value)}
              value="password"
              required
            />
            <label htmlFor="password">Password</label>
          </div>
        </fieldset>
        {strategy === 'email_code' && status === 'needs_first_factor' ? (
          <div className={styles.field}>
            <label>Verfication code</label>
            <input
              type="text"
              name="code"
              placeholder="Code from email"
              required
            />
          </div>
        ) : null}
        {strategy === 'password' ? (
          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Your password"
              required
            />
          </div>
        ) : null}
        {strategy === 'email_link' && status === 'needs_first_factor' ? (
          <div className={styles.message}>
            Check your email inbox for a sign in link. It will expire in 10
            minutes.
          </div>
        ) : null}
        <button className={common.button} type="submit">
          {getButtonText()}
        </button>
      </form>
    </div>
  );
};

export default SignInPage;
