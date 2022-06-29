import { useClerk, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import common from '/styles/Common.module.css';
import styles from '/styles/Passwords.module.css';

const Passwords = () => {
  const [simplePassword, setSimplePassword] = useState('');
  const [complexPassword, setComplexPassword] = useState('');
  const [message, setMessage] = useState('');
  const [invalid, setInvalid] = useState(true);
  const { signOut } = useClerk();
  const { user } = useUser();
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
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await user.update({
        password: simplePassword || complexPassword
      });

      setSimplePassword('');
      setComplexPassword('');
      setMessage('Password successfully set!');

      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error(err);
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

  return (
    <div className={common.container}>
      <h1 className={common.title}>Passwords</h1>
      <p>
        One of the most common authentication methods is to use a password. The
        functionality of setting a password on an existing user account can be
        used to build a{' '}
        <Link href="/forgot-password">
          <a className={common.link}>Forgot Password flow</a>
        </Link>
        .
      </p>
      <p>
        The only requirement enforced by Clerk is that the chosen password must
        have a minimum of 8 characters. You can of course add your own custom
        requirements on top of that.
      </p>
      <p>
        Go ahead and set either a simple or complex password on your account.
        You will then be able to{' '}
        <a className={common.link} href="/sign-in" onClick={signOut}>
          sign out and back in
        </a>{' '}
        with a password.
      </p>
      <form className={styles.form} onSubmit={handleSubmit}>
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
          Set password
        </button>
      </form>
      <div className={styles.message}>{message}</div>
    </div>
  );
};

export default Passwords;
