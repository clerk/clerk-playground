import { useUser } from '@clerk/nextjs';
import styles from '/styles/UserProfile.module.css';
import Link from 'next/link';

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
      <form onSubmit={handleSubmit} className={styles.names}>
        <h1>User management</h1>
        <p>
          Clerk makes it easy to collect information about your users. If your
          user has not provided a first name and last name, they can enter it
          below.
        </p>
        <p>
          For more information about the properties available on the User
          object, check out Clerk's{' '}
          <Link href="https://clerk.dev/docs/reference/clerkjs/user">
            <a>documentation</a>
          </Link>
          .
        </p>
        <div className={styles.field}>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder={user.firstName ? user.firstName : 'First name'}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder={user.lastName ? user.lastName : 'Last name'}
          />
        </div>
        <button className={styles.button} type="submit">
          Submit
        </button>
      </form>

      <h1>Profile Image</h1>
      <p>
        Your user can upload an image to be used as their profile avatar. Upload
        an image below.
      </p>
      <img
        src={user.profileImageUrl ? user.profileImageUrl : null}
        className={styles.img}
      />
      <form onSubmit={handleSubmitImage} className={styles.profileImage}>
        <div className={styles.field}>
          <label htmlFor="profileImage">Profile Image</label>
          <input id="profileImage" name="profileImage" type="file" required />
        </div>
        <button className={styles.button} type="submit">
          Update Image
        </button>
      </form>
    </section>
  );
};

export default UserPage;
