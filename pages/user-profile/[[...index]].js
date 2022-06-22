import { useUser } from '@clerk/nextjs';
import styles from '/styles/UserProfile.module.css';
import Link from 'next/link';
import common from '/styles/Common.module.css';

const UserPage = () => {
  const { user } = useUser();

  const handleSubmit = async (event) => {
    const formData = new FormData(event.target);
    const newFirstName = formData.get('firstName');
    const newLastName = formData.get('lastName');
    event.preventDefault();
    await user.update({ firstName: newFirstName, lastName: newLastName });
  };

  const handleSubmitImage = async (event) => {
    const formData = new FormData(event.target);
    const profileImage = formData.get('profileImage');
    event.preventDefault();
    await user.setProfileImage({ file: profileImage });
  };

  return (
    <section className={styles.section}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <h1>User profile</h1>
          <p>
            Clerk makes it easy to collect information about your users. If your
            user has not provided a first name and last name, they can enter it
            below.
          </p>
          <p>
            For more information about the properties available on the User
            object, check out Clerk's{' '}
            <Link href="https://clerk.dev/docs/reference/clerkjs/user">
              <a className={common.link}>documentation</a>
            </Link>
            .
          </p>
        </div>
        <div className={styles.container}>
          <div className={styles.field}>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder={user.firstName || 'First name'}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder={user.lastName || 'Last name'}
            />
          </div>
        </div>
        <button className={common.button} type="submit">
          Submit
        </button>
      </form>

      <form onSubmit={handleSubmitImage} className={styles.form}>
        <div>
          <h1>Profile Image</h1>
          <p>
            Your user can upload an image to be used as their profile avatar.
            Upload an image below.
          </p>
        </div>
        <div className={styles.imageContainer}>
          <img
            src={user.profileImageUrl ? user.profileImageUrl : null}
            className={styles.img}
          />
          <div className={styles.field}>
            <label htmlFor="profileImage">Profile Image</label>
            <input id="profileImage" name="profileImage" type="file" required />
          </div>
        </div>
        <button className={common.button} type="submit">
          Upload Image
        </button>
      </form>
    </section>
  );
};

export default UserPage;
