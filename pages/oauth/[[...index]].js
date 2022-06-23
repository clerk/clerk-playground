import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import styles from '/styles/OAuth.module.css';
import common from '/styles/Common.module.css';

const OAuthPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const verifiedConnections = [];

  const connectAccount = async (strategy) => {
    const res = await user
      .createExternalAccount({
        strategy: strategy,
        redirect_url: '/oauth'
      })
      .catch((error) => console.error(error));

    if (res.verification.status !== 'verified') {
      router.push(res.verification.externalVerificationRedirectURL);
    }
  };

  const getVerifiedConnections = () => {
    const res = user.externalAccounts.filter(
      (account) => account.verification.status === 'verified'
    );
    res.map((connection) =>
      verifiedConnections.push(connection.verification.strategy)
    );
  };

  getVerifiedConnections();

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
          onClick={() => connectAccount('oauth_google')}
        >
          Connect your Google account
        </button>
        {verifiedConnections.includes('oauth_google') && (
          <p className={styles.p}>Connected!</p>
        )}
      </div>
      <div className={styles.oauth}>
        <button
          className={common.button}
          onClick={() => connectAccount('oauth_github')}
        >
          Connect your GitHub account
        </button>
        {verifiedConnections.includes('oauth_github') && (
          <p className={styles.p}>Connected!</p>
        )}
      </div>
      <div className={styles.oauth}>
        <button
          className={common.button}
          onClick={() => connectAccount('oauth_twitter')}
        >
          Connect your Twitter account
        </button>
        {verifiedConnections.includes('oauth_twitter') && (
          <p className={styles.p}>Connected!</p>
        )}
      </div>
    </div>
  );
};

export default OAuthPage;
