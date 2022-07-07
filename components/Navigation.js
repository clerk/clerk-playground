import Link from 'next/link';
import { useRouter } from 'next/router';

import common from '/styles/Common.module.css';
import styles from '/styles/Navigation.module.css';

const Navigation = ({ links }) => {
  const { asPath } = useRouter();
  const activePath = asPath.replace(/[?#].*/, '');

  if (asPath.startsWith('/sign-in')) {
    return null;
  }

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {links.map((feature) => (
          <li key={feature.name}>
            <Link href={feature.path}>
              <a
                className={`${styles.link} ${
                  activePath === feature.path ? styles.active : ''
                }`}
              >
                {feature.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
