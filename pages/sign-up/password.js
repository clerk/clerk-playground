import { useSignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import common from '/styles/Common.module.css';
import styles from '/styles/Passwords.module.css';

const PasswordSignUp = () => {
  const [simplePassword, setSimplePassword] = useState('');
  const [complexPassword, setComplexPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [invalid, setInvalid] = useState(true);
  const [email, setEmail] = useState('');
  const { signUp, setSession } = useSignUp();
  const router = useRouter();
  const rules = [
    {
      name: 'minimum',
      description: 'At least eight characters',
      pattern: /^.{8,}/
    },
    {
      name: 'lowercase',
      description: 'At least one lowercase character',
      pattern: /[a-z]+/
    },
    {
      name: 'uppercase',
      description: 'At least one uppercase character',
      pattern: /[A-Z]+/
    },
    {
      name: 'number',
      description: 'At least one number',
      pattern: /\d+/
    },
    {
      name: 'special',
      description: 'At least one special character',
      pattern: /[!@#$%^&*?]+/
    }
  ];
  const handleError = (err) => console.error(err);
  const handleSubmit = async (event) => {
    const form = event.target;
    const formData = new FormData(form);
    const emailAddress = formData.get('email');

    event.preventDefault();

    try {
      const response = await signUp.create({
        strategy: 'password',
        emailAddress,
        password: simplePassword || complexPassword
      });

      setEmail(emailAddress);

      form.reset();

      await signUp.prepareEmailAddressVerification();

      setMessage('Check your email for one-time verfication code');

      setSimplePassword('');
      setComplexPassword('');
    } catch (err) {
      if (err?.errors?.[0]?.code === 'form_identifier_exists') {
        setStatus('error');
      } else {
        handleError(err);
      }
    }
  };
  const handleVerification = async (event) => {
    const formData = new FormData(event.target);
    const emailAddress = formData.get('email');
    const code = formData.get('code');

    event.preventDefault();

    setMessage('');

    try {
      const response = await signUp.attemptEmailAddressVerification({
        code
      });

      if (response.status === 'complete') {
        setSession(response.createdSessionId, () =>
          router.push('/?strategy=password')
        );
      }
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    if (simplePassword.length && complexPassword.length) {
      setInvalid(true);
      return;
    }

    if (simplePassword && simplePassword.length >= 8) {
      setInvalid(false);
      return;
    }

    if (
      complexPassword &&
      rules.every((rule) => rule.pattern.test(complexPassword))
    ) {
      setInvalid(false);
      return;
    }

    setInvalid(true);
  }, [simplePassword, complexPassword]);

  const renderVerificationForm = () => (
    <form className={styles.form} onSubmit={handleVerification}>
      <div className={styles.field}>
        <label htmlFor="emailAddress">Email address</label>
        <input
          id="emailAddress"
          name="email"
          type="email"
          defaultValue={email}
          readOnly
        />
      </div>
      <div className={styles.field}>
        <label>Verfication code</label>
        <input
          type="text"
          name="code"
          placeholder="Code from email"
          defaultValue=""
          required
        />
      </div>
      <button className={common.button} type="submit">
        Complete sign up with password
      </button>
    </form>
  );

  return (
    <div className={common.container}>
      <h1 className={common.title}>Sign up with Password</h1>
      <p>
        One of the most common authentication methods is to use a password. The
        only requirement enforced by Clerk is that the chosen password must have
        a minimum of 8 characters. You can of course add your own custom
        requirements on top of that.
      </p>
      <p>
        Clerk also enforces every user to have a verified email address by
        default.
      </p>
      <p>
        Go ahead add your email address and set either a simple or complex
        password.
      </p>
      {email ? (
        renderVerificationForm()
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
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
          <div className={styles.field}>
            <label htmlFor="simple">Simple password</label>
            <input
              id="simple"
              type="password"
              placeholder="Minimum 8 characters"
              onChange={(e) => setSimplePassword(e.target.value)}
              value={simplePassword}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="complex">Complex password</label>
            <input
              id="complex"
              type="password"
              placeholder="Follow password rules"
              onChange={(e) => setComplexPassword(e.target.value)}
              value={complexPassword}
            />
          </div>
          <div className={styles.rules}>
            <ul className={styles.list}>
              {rules.map((rule) => (
                <li
                  key={rule.name}
                  className={
                    rule.pattern.test(complexPassword) ? styles.pass : undefined
                  }
                >
                  {rule.description}
                </li>
              ))}
            </ul>
          </div>
          <button className={common.button} type="submit" disabled={invalid}>
            Continue
          </button>
        </form>
      )}
      <div className={styles.message}>{message}</div>
      {status === 'error' && (
        <div className={styles.warning}>
          You've already signed up.{' '}
          <Link href="/sign-in">
            <a className={common.link}>Sign in</a>
          </Link>{' '}
          instead.
        </div>
      )}
    </div>
  );
};

export default PasswordSignUp;
