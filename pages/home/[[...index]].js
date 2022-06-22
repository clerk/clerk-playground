import Link from 'next/link';
import styles from '/styles/Home.module.css';

const Home = () => {
  const features = [
    {
      name: 'Passwords',
      path: '/passwords'
    },
    {
      name: 'One-Time Passcodes',
      path: '#otp'
    },
    {
      name: 'Magic Links',
      path: '#magic-links'
    },
    {
      name: 'OAuth Social Providers',
      path: '#oauth'
    },
    {
      name: 'Multifactor Auth (MFA)',
      path: '#mfa'
    },
    {
      name: 'User Profile',
      path: '#profile'
    }
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Clerk Playground</h1>
      <p>
        You've just signed in with an{' '}
        <Link href="#magic-link">
          <a className={styles.link}>Email Magic Link</a>
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
