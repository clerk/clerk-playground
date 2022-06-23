import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import styles from '/styles/OAuth.module.css';
import common from '/styles/Common.module.css';
import { useEffect, useState } from 'react';

const OAuthPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [verifiedConnections, setVerifiedConnections] = useState([]);

  const toggleAccountConnection = async (strategy) => {
    if (!verifiedConnections.includes(strategy)) {
      const res = await user
        .createExternalAccount({
          strategy: strategy,
          redirect_url: '/oauth'
        })
        .catch((error) => console.error(error));
      if (res) {
        router.push(res.verification.externalVerificationRedirectURL);
      }
    } else {
      const accountToDelete = user.externalAccounts.find(
        (account) => account.verification.strategy === strategy
      );
      const res = await accountToDelete
        .destroy()
        .catch((error) => console.log(error));
      return res;
    }
  };

  const getVerifiedConnections = () => {
    const res = user.externalAccounts.filter(
      (account) => account.verification.status === 'verified'
    );
    return res;
  };

  useEffect(() => {
    if (user) {
      const connections = getVerifiedConnections().map(
        (connection) => connection.verification.strategy
      );
      setVerifiedConnections(connections);
    }
  }, [user]);

  // Render a button for each supported OAuth provider
  // you want to add to your app
  return (
    <div className={styles.section}>
      <h1 className={styles.title}>OAuth SSO Providers Page</h1>
      <p className={styles.description}>
        This page demonstrates how your users can connect their existing account
        to an external OAuth provider.
      </p>

      <div className={styles.oauth}>
        <button
          className={common.button}
          onClick={() => toggleAccountConnection('oauth_google')}
        >
          {!verifiedConnections.includes('oauth_google')
            ? 'Connect'
            : 'Disconnect'}{' '}
          your Google account
        </button>
        {verifiedConnections.includes('oauth_google') && (
          <p className={styles.p}>Connected!</p>
        )}
      </div>

      <div className={styles.oauth}>
        <button
          className={common.button}
          onClick={() => toggleAccountConnection('oauth_github')}
        >
          {!verifiedConnections.includes('oauth_github')
            ? 'Connect'
            : 'Disconnect'}{' '}
          your GitHub account
        </button>
        {verifiedConnections.includes('oauth_github') && (
          <p className={styles.p}>Connected!</p>
        )}
      </div>

      <div className={styles.oauth}>
        <button
          className={common.button}
          onClick={() => toggleAccountConnection('oauth_twitter')}
        >
          {!verifiedConnections.includes('oauth_twitter')
            ? 'Connect'
            : 'Disconnect'}{' '}
          your Twitter account
        </button>
        {verifiedConnections.includes('oauth_twitter') && (
          <p className={styles.p}>Connected!</p>
        )}
      </div>
    </div>
  );
};

export default OAuthPage;
