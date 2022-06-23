import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

import common from '/styles/Common.module.css';
import styles from '/styles/UserProfile.module.css';

const UserProfilePage = () => {
  const { user } = useUser();

  const handleSubmit = async (event) => {
    const formData = new FormData(event.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');

    event.preventDefault();

    await user.update({ firstName, lastName });
  };

  const handleSubmitImage = async (event) => {
    const formData = new FormData(event.target);
    const file = formData.get('profileImage');

    event.preventDefault();

    await user.setProfileImage({ file });
  };

  return (
    <div className={common.container}>
      <h1 className={common.title}>User Profile</h1>
      <p>
        Clerk makes it easy to collect information about your users. If first
        name and last name were not collected during sign up, they can be added
        later with a custom form. Your user can also upload an image to be used
        as their profile avatar.
      </p>
      <p>
        For more information about the properties available on the User object,
        check out Clerk's{' '}
        <Link href="https://clerk.dev/docs/reference/clerkjs/user">
          <a className={common.link}>documentation</a>
        </Link>
        .
      </p>
      <section className={styles.section}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder={user.firstName || 'First name'}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder={user.lastName || 'Last name'}
            />
          </div>
          <div className={styles.actions}>
            <button className={common.button} type="submit">
              Update name
            </button>
          </div>
        </form>
        <form onSubmit={handleSubmitImage} className={styles.form}>
          <div className={styles.imageContainer}>
            <img src={user.profileImageUrl} className={styles.img} />
            <div className={styles.field}>
              <input
                id="profileImage"
                name="profileImage"
                type="file"
                required
              />
            </div>
          </div>
          <div className={styles.actions}>
            <button className={common.button} type="submit">
              Upload image
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default UserProfilePage;
