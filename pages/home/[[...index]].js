import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '/styles/Home.module.css';

const Home = () => {
  const { query } = useRouter();
  const strategy = query?.strategy || 'email_link';
  const features = [
    {
      name: 'Passwords',
      label: 'Password',
      strategy: 'password',
      path: '/passwords'
    },
    {
      name: 'One-Time Passcodes',
      label: 'One-Time Passcode',
      strategy: 'email_code',
      path: '#otp'
    },
    {
      name: 'Magic Links',
      label: 'Email Magic Link',
      strategy: 'email_link',
      path: '#magic-links'
    },
    {
      name: 'OAuth Social Providers',
      path: '/oauth'
    },
    {
      name: 'Multifactor Auth (MFA)',
      path: '#mfa'
    },
    {
      name: 'User Profile',
      path: '/user-profile'
    }
  ];
  const link = features.find((f) => f.strategy === strategy);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Clerk Playground</h1>
      <p>
        You've just signed in with{' '}
        <Link href={link.path}>
          <a className={styles.link}>{link.label}</a>
        </Link>
        . Choose another feature of Clerk to explore:
      </p>
      <ul className={styles.list}>
        {features.map((feature) => (
          <li key={feature.name}>
            <Link href={feature.path}>
              <a className={styles.link}>{feature.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
