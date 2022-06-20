import { useClerk, useSignUp } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import styles from '/styles/SignUp.module.css';

const VerificationPage = () => {
  const [sent, setSent] = useState(false);
  const { signUp } = useSignUp();
  const sendMagicLink = async () => {
    const { startMagicLinkFlow } = signUp.createMagicLinkFlow();

    setSent(true);

    setTimeout(() => {
      setSent(false);
    }, 10000);

    await startMagicLinkFlow({
      redirectUrl: `${window.location.origin}/home`
    });
  };

  useEffect(() => {
    sendMagicLink();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Welcome to the Clerk Playground!</h1>
      <p>
        Check your email inbox for a sign in link. It will expire in 10 minutes.
      </p>
      <button
        className={styles.button}
        type="button"
        disabled={sent}
        onClick={sendMagicLink}
      >
        {sent ? 'Sent!' : 'Resend link'}
      </button>
    </div>
  );
};

export default VerificationPage;
