import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { OAUTH_PROVIDERS } from '/utils/constants';
import common from '/styles/Common.module.css';
import styles from '/styles/OAuth.module.css';

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
        .catch((error) => console.error(error));
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
    <div className={common.container}>
      <h1 className={common.title}>OAuth Social Providers</h1>
      <p>
        OAuth (Open Authentication) is an open-standard authorization protocol
        that delegates authentication to an external identity provider (IdP). A
        user can use their account from another website (such as Google or
        Twitter) to sign in to another website without having to re-enter common
        credentials.
      </p>
      <p>
        This page demonstrates how easily your users can connect their existing
        account to an external OAuth provider.
      </p>
      <section className={styles.wrapper}>
        {OAUTH_PROVIDERS.map((provider) => (
          <div key={provider.name} className={styles.oauth}>
            <button
              className={common.button}
              onClick={() => toggleAccountConnection(provider.strategy)}
            >
              {!verifiedConnections.includes(provider.strategy)
                ? 'Connect'
                : 'Disconnect'}{' '}
              your {provider.name} account
            </button>
            {verifiedConnections.includes(provider.strategy) && (
              <p className={styles.p}>Connected!</p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default OAuthPage;
