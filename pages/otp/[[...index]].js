import { useUser } from '@clerk/nextjs';
import { useEffect, useRef, useState } from 'react';

import common from '/styles/Common.module.css';
import styles from '/styles/Form.module.css';

const OneTimePasscodes = () => {
  const { user } = useUser();
  const [status, setStatus] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const formRef = useRef();
  const emailFormRef = useRef();
  const firstPhoneNumber = user.phoneNumbers?.[0];
  const primaryEmailAddress = user.primaryEmailAddress?.emailAddress;
  const secondaryEmail = user.emailAddresses.find((email) => {
    return (
      email.emailAddress !== primaryEmailAddress &&
      (!email.verification || email.verification.strategy === 'email_code')
    );
  });

  const handleError = (error) => console.error(error);

  const handleSubmit = async (event) => {
    const form = event.target;
    const formData = new FormData(form);
    const phoneNumber = formData.get('phone');
    const code = formData.get('code');
    let existingPhone = user.phoneNumbers?.[0];

    event.preventDefault();

    if (!status && !user.phoneNumbers.length) {
      // Add phone number from form
      existingPhone = await user.createPhoneNumber({
        phoneNumber
      });
    }

    if (!status && !user.primaryPhoneNumber) {
      const result = await existingPhone.prepareVerification();

      setStatus(result.verification.status);
    }

    if (status === 'unverified') {
      const result = await existingPhone.attemptVerification({
        code
      });
      setStatus(result.verification.status);
    }

    form.reset();
  };

  const handleSubmitEmail = async (event) => {
    const form = event.target;
    const formData = new FormData(form);
    const emailAddress = formData.get('secondaryEmail');
    const code = formData.get('emailCode');
    const match = user.emailAddresses.find(
      (email) => email.emailAddress === emailAddress
    );

    event.preventDefault();

    if (match && emailStatus === 'unverified') {
      const result = await match.attemptVerification({
        code
      });

      setEmailStatus(result.verification.status);
    } else if (match && match.verification.status === 'verified') {
      setEmailStatus('verified');
    }

    if (!match) {
      try {
        const result = await user.createEmailAddress({
          email: emailAddress
        });

        setEmailStatus('unverified');

        await result.prepareVerification({
          strategy: 'email_code'
        });
      } catch (err) {
        handleError(err);
      }
    } else if (!match.verification.status) {
      setEmailStatus('unverified');

      await match.prepareVerification({
        strategy: 'email_code'
      });
    }
  };

  const removePhoneNumber = async () => {
    try {
      const primaryPhone = user.primaryPhoneNumber;

      await primaryPhone.destroy();

      formRef.current.reset();
    } catch (err) {
      handleError(err);
    }
  };

  const removeSecondaryEmail = async () => {
    try {
      await secondaryEmail.destroy();

      emailFormRef.current.reset();
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    const primaryPhone = user.primaryPhoneNumber;

    if (primaryPhone && primaryPhone?.verification.status === 'verified') {
      setStatus('verified');
    } else if (
      firstPhoneNumber &&
      firstPhoneNumber.verification.status === 'unverified'
    ) {
      setStatus('unverified');
    } else if (!primaryPhone) {
      setStatus('');
    }
  }, [user.primaryPhoneNumber]);

  useEffect(() => {
    if (secondaryEmail && secondaryEmail?.verification.status === 'verified') {
      setEmailStatus('verified');
    } else if (
      secondaryEmail &&
      secondaryEmail.verification.status === 'unverified'
    ) {
      setEmailStatus('unverified');
    } else if (!secondaryEmail) {
      setEmailStatus('');
    }
  }, [secondaryEmail]);

  return (
    <div className={common.container}>
      <h1 className={common.title}>One-Time Passcodes (OTP)</h1>
      <p>
        Clerk supports passwordless authentication, which enables users to sign
        in without needing to set a password. Two ways of enabling passwordless
        authentication is using either email or SMS verification codes. Users
        receive a one-time code that will be used to complete the authentication
        process.
      </p>
      <p>
        Try adding either a secondary email address (different from the primary
        one you signed up with) or your phone number.
      </p>
      <section className={styles.row}>
        <form
          ref={emailFormRef}
          className={styles.form}
          onSubmit={handleSubmitEmail}
          autoComplete="off"
        >
          <div className={styles.field}>
            <label htmlFor="primaryEmail">Primary email address</label>
            <input
              id="primaryEmail"
              name="primaryEmail"
              type="email"
              defaultValue={primaryEmailAddress}
              readOnly
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="secondaryEmail">Secondary email address</label>
            <input
              id="secondaryEmail"
              name="secondaryEmail"
              type="email"
              defaultValue={secondaryEmail?.emailAddress || ''}
              readOnly={secondaryEmail ? true : false}
              required
            />
          </div>
          {emailStatus === 'unverified' ? (
            <>
              <div className={styles.field}>
                <label htmlFor="emailCode">Verification code</label>
                <input id="emailCode" name="emailCode" type="text" required />
              </div>
              <div className={styles.message}>
                Check your email inbox for verification code
              </div>
            </>
          ) : null}
          {emailStatus === 'verified' ? (
            <>
              <div className={styles.message}>
                Secondary email address successfully verified
              </div>
              <button
                className={common.secondaryButton}
                type="button"
                onClick={removeSecondaryEmail}
              >
                Remove secondary email
              </button>
            </>
          ) : null}
          {emailStatus !== 'verified' ? (
            <button className={common.button} type="submit">
              {emailStatus === 'unverified' ? 'Verify' : 'Send'} email code
            </button>
          ) : null}
        </form>
        <form
          ref={formRef}
          className={styles.form}
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div className={styles.field}>
            <label htmlFor="phoneNumber">Primary phone number</label>
            <input
              id="phoneNumber"
              name="phone"
              type="tel"
              defaultValue={firstPhoneNumber || ''}
              required
            />
          </div>
          {status === 'unverified' ? (
            <div className={styles.field}>
              <label htmlFor="code">Verification code</label>
              <input id="code" name="code" type="text" required />
            </div>
          ) : null}
          {status === 'verified' ? (
            <>
              <div className={styles.message}>
                Phone number successfully verified
              </div>
              <button
                className={common.secondaryButton}
                type="button"
                onClick={removePhoneNumber}
              >
                Remove phone number
              </button>
            </>
          ) : null}
          {status !== 'verified' ? (
            <button className={common.button} type="submit">
              {status === 'unverified' ? 'Verify' : 'Send'} SMS code
            </button>
          ) : null}
        </form>
      </section>
    </div>
  );
};

export default OneTimePasscodes;
