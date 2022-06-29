import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import common from '/styles/Common.module.css';
import styles from '/styles/Form.module.css';

const MagicLinks = () => {
  const { user } = useUser();
  const { query } = useRouter();
  const [status, setStatus] = useState('');
  const primaryEmailAddress = user.primaryEmailAddress?.emailAddress;

  const handleError = (error) => console.error(error);

  const handleSubmit = async (event) => {
    const emailId = user.primaryEmailAddressId;

    event.preventDefault();

    if (emailId) {
      const { startMagicLinkFlow } =
        user.primaryEmailAddress.createMagicLinkFlow();

      try {
        const response = await startMagicLinkFlow({
          redirectUrl: window.location.href
        });

        if (response) {
          setStatus('sent');
        }
      } catch (err) {
        handleError(err);
      }
    }
  };

  useEffect(() => {
    if (query && query.__clerk_status) {
      setStatus(query.__clerk_status);
    }
  }, [query]);

  return (
    <div className={common.container}>
      <h1 className={common.title}>Magic Links</h1>
      <p>
        Magic links are another way in which Clerk supports passwordless
        authentication. During login or registration, users will be asked to
        enter their email address to receive an email with a link to complete
        the authentication process.
      </p>
      <p>
        Click the button below and you will receive a magic link in your inbox.
      </p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="emailAddress">Email address</label>
          <input
            id="emailAddress"
            name="emailAddress"
            type="email"
            defaultValue={primaryEmailAddress}
            readOnly
          />
        </div>
        {status === 'sent' && (
          <div className={styles.message}>
            Check your email inbox for a sign in link. It will expire in 10
            minutes.
          </div>
        )}
        {status === 'verified' && (
          <div className={styles.message}>
            Success! You've been brought here with a magic link.
          </div>
        )}
        {status === 'expired' && (
          <div className={styles.warning}>
            Your magic link has expired. Try sending it again
          </div>
        )}
        {status !== 'sent' && status !== 'verified' ? (
          <button className={common.button} type="submit">
            Send magic link
          </button>
        ) : null}
      </form>
    </div>
  );
};

export default MagicLinks;
