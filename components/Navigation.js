import Link from 'next/link';
import { useRouter } from 'next/router';
import { FEATURE_LINKS } from '/utils/constants';

import common from '/styles/Common.module.css';
import styles from '/styles/Navigation.module.css';

const Navigation = () => {
  const router = useRouter();

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {FEATURE_LINKS.map((feature) => (
          <li key={feature.name}>
            <Link href={feature.path}>
              <a
                className={`${styles.link} ${
                  router.pathname === feature.path ? styles.active : ''
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
