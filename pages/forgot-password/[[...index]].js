import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import common from '/styles/Common.module.css';
import styles from '/styles/SignIn.module.css';

const ForgotPasswordPage = () => {
  const { user } = useUser();
  const [message, setMessage] = useState('');
  const getButtonText = () => {
    return !message ? 'Continue' : 'Resend Link';
  };

  const handleSubmit = async (event) => {
    const formData = new FormData(event.target);
    const identifier = formData.get('email');
    const match = user.emailAddresses.find(
      (address) => address.emailAddress === identifier
    );
    event.preventDefault();
    if (match) {
      const { startMagicLinkFlow } = match.createMagicLinkFlow();

      try {
        const response = await startMagicLinkFlow({
          redirectUrl: `${window.location.origin}/reset-password`
        });
        if (response) {
          setMessage('An email was sent to your account');
        }
      } catch (err) {
        console.error('error', err);
      }
    } else {
      setMessage('No account was found matching that email.');
    }
  };

  return (
    <div className={common.container}>
      <h1>Forgot Password</h1>
      <p>Want to see a custom "Forgot password" user flow?</p>
      <p>
        Enter your email below to receive a magic link, which will route you to
        page that will allow you reset your password.
      </p>
      <form onSubmit={handleSubmit}>
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
        <p>{message}</p>
        <button className={common.button} type="submit">
          {getButtonText()}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
