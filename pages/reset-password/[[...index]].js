import { useClerk, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useState } from 'react';

import common from '/styles/Common.module.css';
import styles from '/styles/Form.module.css';

const ResetPasswordPage = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [notification, setNotifcation] = useState(null);
  const router = useRouter();
  const fromFlow = router.query.__clerk_status;

  const handleError = (err) => console.error(err);

  const handleSubmit = async (event) => {
    const form = event.target;
    const formData = new FormData(form);
    const password = formData.get('password');
    const confirmation = formData.get('confirmation');

    event.preventDefault();

    if (password !== confirmation) {
      setNotifcation({
        type: 'warning',
        text: 'Passwords must match'
      });
      return;
    }

    if (password.length < 8) {
      setNotifcation({
        type: 'warning',
        text: 'Passwords must be a minimum of 8 characters'
      });
      return;
    }

    try {
      const response = await user.update({ password });
      if (response && fromFlow) {
        // Redirect as part of Forgot Password flow
        router.push('/?strategy=forgot_password');
      } else {
        form.reset();
        setNotifcation({
          type: 'message',
          text: 'Password successfully changed!'
        });
      }
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className={common.container}>
      <h1 className={common.title}>Reset Password</h1>
      <p>
        With Clerk, you can build a custom "Forgot password" flow using magic
        links.
      </p>
      {!fromFlow ? (
        <p>
          If you would like to see the full flow,{' '}
          <a className={common.link} href="/sign-in" onClick={signOut}>
            sign out
          </a>{' '}
          and then click the "Forgot password" link.
        </p>
      ) : null}
      <p>
        Change your password below. It must contain a minimum of 8 characters.
      </p>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="password">New password</label>
          <input id="password" name="password" type="password" required />
        </div>
        <div className={styles.field}>
          <label htmlFor="confirmation">Confirm password</label>
          <input
            id="confirmation"
            name="confirmation"
            type="password"
            required
          />
        </div>
        <div className={styles.actions}>
          <button className={common.button} type="submit">
            Set new password
          </button>
        </div>
      </form>
      {notification && (
        <p className={styles[notification.type]}>{notification.text}</p>
      )}
    </div>
  );
};

export default ResetPasswordPage;
