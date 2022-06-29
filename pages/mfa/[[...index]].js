import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

import common from '/styles/Common.module.css';
import styles from '/styles/Form.module.css';

const MultiFactorAuth = () => {
  const { user } = useUser();
  const [statusValue, setStatus] = useState('');
  const status = {
    empty: !statusValue,
    enabled: statusValue === 'enabled',
    verified: statusValue === 'verified',
    unverified: statusValue === 'unverified'
  };
  const verifiedOrEnabled = status.enabled || status.verified;
  const firstPhone = user.phoneNumbers?.[0];
  const hasSecondFactor = firstPhone && firstPhone.reservedForSecondFactor;

  const handleError = (error) => console.error(error);

  const handleSubmit = async (event) => {
    const form = event.target;
    const formData = new FormData(form);
    const phoneNumber = formData.get('phone');
    const code = formData.get('code');

    event.preventDefault();

    if (!user.twoFactorEnabled() && status.empty) {
      try {
        const phone = await user.createPhoneNumber({
          phoneNumber
        });

        const result = await phone.prepareVerification();

        if (result.phoneNumber) {
          setStatus(result.verification.status);
          form.reset();
        }
      } catch (err) {
        handleError(err);
      }
    } else {
      try {
        const attempt = await firstPhone.attemptVerification({
          code
        });

        await attempt.setReservedForSecondFactor({
          reserved: true
        });
      } catch (err) {
        handleError(err);
      }
    }
  };

  const toggleSecondFactor = async () => {
    try {
      const reserved = !firstPhone.reservedForSecondFactor;

      await firstPhone.setReservedForSecondFactor({
        reserved
      });
    } catch (err) {
      handleError(err);
    }
  };

  const removePhoneNumber = () => {
    firstPhone.destroy();
  };

  useEffect(() => {
    if (!firstPhone) {
      setStatus('');
      return;
    }

    const { verification } = firstPhone;

    if (
      verification.status === 'verified' &&
      firstPhone.reservedForSecondFactor
    ) {
      setStatus('enabled');
      return;
    }

    setStatus(firstPhone.verification.status);
  }, [firstPhone]);

  return (
    <div className={common.container}>
      <h1 className={common.title}>Multifactor Authentication (MFA)</h1>
      <p>
        Multifactor authentication, also called two-factor authentication (2FA),
        can be used to encourage users to perform a second verification check
        during sign in. By having two different types of verifications, you can
        drastically improve the security for your users.
      </p>
      <p>Clerk currently supports MFA through the use of an SMS code.</p>
      <p>Add your mobile phone number below to get started.</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="phoneNumber">Phone number</label>
          {!status.empty ? (
            <input type="tel" value={firstPhone} readOnly />
          ) : (
            <input id="phoneNumber" name="phone" type="tel" required />
          )}
        </div>
        {verifiedOrEnabled ? (
          <>
            <div className={hasSecondFactor ? styles.message : styles.warning}>
              Two-factor authentication is{' '}
              {hasSecondFactor ? 'currently' : 'not'} enabled
            </div>
            <div className={styles.actions}>
              <button
                className={common.button}
                type="button"
                onClick={toggleSecondFactor}
              >
                {hasSecondFactor ? 'Remove' : 'Enable'} second factor
              </button>
              <button
                className={common.secondaryButton}
                type="button"
                onClick={removePhoneNumber}
              >
                Remove phone number
              </button>
            </div>
          </>
        ) : null}
        {status.unverified ? (
          <div className={styles.field}>
            <label htmlFor="code">Verification code</label>
            <input id="code" name="code" type="text" required />
          </div>
        ) : null}
        {!verifiedOrEnabled ? (
          <button className={common.button} type="submit">
            {status.unverified ? 'Verify' : 'Send'} code
          </button>
        ) : null}
      </form>
    </div>
  );
};

export default MultiFactorAuth;
