import { SignIn, useSignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';

import common from '/styles/Common.module.css';
import styles from '/styles/Form.module.css';

const SignInPage = () => {
  const { signIn, setSession } = useSignIn();
  const router = useRouter();
  const form = useRef();
  const [strategy, setStrategy] = useState('');
  const [status, setStatus] = useState('');
  const [notification, setNotification] = useState(null);

  const getButtonText = () => {
    if (!status && strategy !== 'password') {
      return 'Continue';
    }

    if (strategy === 'email_link' && status) {
      return 'Resend link';
    }

    return 'Sign in';
  };

  const signInWithSecondFactor = async (strategy, formData) => {
    const code = formData.get('mobileCode');
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

  const signInWithLink = async (strategy, redirectPath) => {
    const firstFactor = signIn.supportedFirstFactors.find(
      (f) => f.strategy === strategy
    );
    const { emailAddressId } = firstFactor;
    const { startMagicLinkFlow, cancelMagicLinkFlow } =
      signIn.createMagicLinkFlow();

    const response = await startMagicLinkFlow({
      emailAddressId,
      redirectUrl: `${window.location.origin}${redirectPath}`
    });

    const verification = response.firstFactorVerification;

    if (verification.status === 'expired') {
      setNotification({
        type: 'warning',
        text: 'Sign in link has expired.'
      });
    }

    await cancelMagicLinkFlow();

    if (response.status === 'complete') {
      setSession(response.createdSessionId, () => router.push(redirectPath));
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
      } else if (response.status === 'needs_second_factor') {
        await response.prepareSecondFactor({
          strategy: 'phone_code'
        });

        setStatus(response.status);
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
      } else if (response.status === 'needs_second_factor') {
        await response.prepareSecondFactor({
          strategy: 'phone_code'
        });
      }

      return;
    }

    if (status === 'needs_second_factor') {
      return signInWithSecondFactor(strategy, formData);
    }

    // Attempt sign in with applicable strategy
    if (strategy === 'email_link') {
      return signInWithLink(strategy, `/?stratgey=${strategy}`);
    }

    if (strategy === 'email_code') {
      return signInWithCode(strategy, status, formData);
    }
  };

  const handleReset = async () => {
    const formData = new FormData(form.current);
    const identifier = formData.get('email');
    const strategy = 'email_link';
    const redirectPath = '/reset-password';

    if (!identifier) {
      setNotification({
        type: 'warning',
        text: 'Email address not provided'
      });
      form.current.email.focus();
    } else {
      await signIn.create({
        identifier,
        redirect_url: `${window.location.origin}${redirectPath}`
      });

      setNotification({
        type: 'message',
        text: 'Password reset link has been sent to your email'
      });
      signInWithLink(strategy, redirectPath);
    }
  };

  return (
    <div className={common.container}>
      <h1 className={common.title}>Welcome back to Clerk Playground!</h1>
      <p>Been here before? Sign in using the form below.</p>
      <p>
        If it's your first time, you'll want to{' '}
        <Link href="/sign-up">
          <a className={common.link}>sign up</a>
        </Link>{' '}
        instead.
      </p>
      <form ref={form} onSubmit={handleSubmit}>
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
        {status === 'needs_second_factor' ? (
          <>
            <div className={styles.field}>
              <label>Verfication code</label>
              <input
                type="text"
                name="mobileCode"
                placeholder="Code from mobile"
                required
              />
            </div>
            <div className={styles.message}>
              Check your mobile device for an SMS code. It will expire in 10
              minutes.
            </div>
          </>
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
      <p>
        Forgot your password? Enter email then{' '}
        <button className={common.link} type="button" onClick={handleReset}>
          click here
        </button>
        .
      </p>
      {notification ? (
        <div className={styles[notification.type]}>{notification.text}</div>
      ) : null}
    </div>
  );
};

export default SignInPage;
