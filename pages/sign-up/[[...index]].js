import { SignUp, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useState } from 'react';

import styles from '/styles/SignUp.module.css';

const SignUpPage = () => {
  const { signUp } = useSignUp();
  const router = useRouter();

  const handleSubmit = async (event) => {
    const formData = new FormData(event.target);
    const emailAddress = formData.get('email');

    event.preventDefault();

    await signUp.create({ emailAddress });

    router.push('/verify');
  };

  return (
    <div className={styles.container}>
      <h1>Welcome to the Clerk Playground!</h1>
      <p>
        This app will demonstrate some of the features of Clerk and different
        combinations that can be used to build authentication and user
        management flows.
      </p>
      <p>
        The source code from this app is available in this GitHub repository.
      </p>
      <p>Get started by signing up with your email address.</p>
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
        <button className={styles.button} type="submit">
          Let's play
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
