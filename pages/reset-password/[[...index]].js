import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import common from '/styles/Common.module.css';
import styles from '/styles/SignIn.module.css';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { user } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const password = formData.get('password');
    const confirmation = formData.get('confirmation');
    const match = password == confirmation;
    if (match) {
      try {
        const response = await user.update({ password: password });
        if (response) {
          console.log('response', response);
          router.push('/');
        }
      } catch (err) {
        console.error('error', err);
      }
    } else {
      console.log('Passwords must match');
    }
  };

  return (
    <div className={common.container}>
      <h1>Reset Password</h1>
      <p>Enter your new password</p>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required />
        </div>
        <div className={styles.field}>
          <label htmlFor="password">Confirm Password</label>
          <input
            id="confirmation"
            name="confirmation"
            type="password"
            required
          />
        </div>
        <button className={common.button} type="submit">
          Save password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
