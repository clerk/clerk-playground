import { useClerk, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import common from '/styles/Common.module.css';

const VerificationPage = () => {
  const [sent, setSent] = useState(false);
  const { signUp, setSession } = useSignUp();
  const router = useRouter();
  const sendMagicLink = async () => {
    const { startMagicLinkFlow } = signUp.createMagicLinkFlow();

    setSent(true);

    setTimeout(() => {
      setSent(false);
    }, 10000);

    const response = await startMagicLinkFlow({
      redirectUrl: `${window.location.origin}/`
    });

    if (response.status === 'complete') {
      setSession(su.createdSessionId, () => router.push('/'));
      return;
    }
  };

  useEffect(() => {
    sendMagicLink();
  }, []);

  return (
    <div className={common.container}>
      <h1>Welcome to the Clerk Playground!</h1>
      <p>
        Check your email inbox for a sign in link. It will expire in 10 minutes.
      </p>
      <button
        className={common.button}
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
