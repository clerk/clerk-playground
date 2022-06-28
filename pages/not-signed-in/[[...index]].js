import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useState } from 'react';

import common from '/styles/Common.module.css';
import styles from '/styles/SignIn.module.css';

const NotSignedInPage = () => {
  const { signIn, setSession } = useSignIn();
  const router = useRouter();
  const strategy = 'email_link';
  const [status, setStatus] = useState('');

  const signInWithLink = async (strategy, status, formData) => {
    const firstFactor = signIn.supportedFirstFactors.find(
      (f) => f.strategy === strategy
    );
    const { emailAddressId } = firstFactor;
    const { startMagicLinkFlow } = signIn.createMagicLinkFlow();

    const response = await startMagicLinkFlow({
      emailAddressId,
      redirectUrl: `${window.location.origin}/reset-password`
    });

    if (response.status === 'complete') {
      setSession(response.createdSessionId, () =>
        router.push(`/?strategy=${strategy}`)
      );
      return;
    }
  };

  const handleSubmit = async (event) => {
    const formData = new FormData(event.target);
    const identifier = formData.get('email');

    event.preventDefault();

    if (!status) {
      // Prepare sign in with strategy and identifier
      const response = await signIn.create({
        strategy,
        identifier,
        redirect_url: `${window.location.origin}/reset-password`
      });

      setStatus(response.status);

      if (response.status === 'complete') {
        setSession(response.createdSessionId, () =>
          router.push(`/reset-password`)
        );
      }

      return;
    }

    // Attempt sign in with applicable strategy
    if (strategy === 'email_link') {
      return signInWithLink(strategy, status, formData);
    }
  };

  return (
    <div>
      <div className={common.container}>
        <h1>Forgot Password</h1>
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
          {status === 'needs_first_factor' ? (
            <div className={styles.message}>
              Check your email inbox for a sign in link. It will expire in 10
              minutes.
            </div>
          ) : null}
          <button className={common.button} type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default NotSignedInPage;
