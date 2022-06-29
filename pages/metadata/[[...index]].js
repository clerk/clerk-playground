import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import common from '/styles/Common.module.css';
import styles from '/styles/Metadata.module.css';

const MetadataPage = () => {
  const { user } = useUser();
  const [birthday, setBirthday] = useState('');

  useEffect(() => {
    if (user.unsafeMetadata.birthday) {
      setBirthday(user.unsafeMetadata.birthday);
    }
  }, []);

  const handleSubmit = async (event) => {
    const formData = new FormData(event.target);
    const date = formData.get('birthday').replace(/\-/g, '/');
    const birthday = new Date(date).toLocaleDateString('en-US', {
      dateStyle: 'long'
    });
    event.preventDefault();

    try {
      const response = await user.update({
        unsafeMetadata: { birthday: birthday }
      });
      if (response) {
        setBirthday(response.unsafeMetadata.birthday);
      }
    } catch (err) {
      console.error('error', err);
    }
  };

  return (
    <div className={common.container}>
      <h1 className={common.title}>Metadata</h1>
      <p>
        Clerk uses three different types of metadata: <b>private</b>,{' '}
        <b>public</b>, and <b>unsafe</b>.
      </p>{' '}
      <p>
        Each has their own permissions in regard to Frontend API vs Backend API
        access.{' '}
      </p>
      <p>
        Do the custom attributes contain sensitive information that should not
        be displayed on the front-end?
      </p>
      <p>
        {' '}
        Use the <b>privateMetadata</b> property.{' '}
      </p>
      <p>
        Do you need to set some metadata from your back-end and have them
        displayed as read-only on the front-end?{' '}
      </p>
      <p>
        Use the <b>publicMetadata</b> property.{' '}
      </p>
      <p>
        Do you need to set the custom attributes from the front-end (using our
        ClerkJS library or the Frontend API)?{' '}
      </p>
      <p>
        Use the <b>unsafeMetadata</b> property.{' '}
      </p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Metadata</th>
            <th>Frontend API</th>
            <th>Backend API</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>private</td>
            <td>-</td>
            <td>Read/Write</td>
          </tr>
          <tr>
            <td>public</td>
            <td>Read</td>
            <td>Read/Write</td>
          </tr>
          <tr>
            <td>unsafe</td>
            <td>Read/Write</td>
            <td>Read/Write</td>
          </tr>
        </tbody>
      </table>
      <form onSubmit={handleSubmit} className={styles.form}>
        <p>
          Enter your birthday and press submit to save it to the User object's{' '}
          <b>unsafeMetadata</b> property.
        </p>
        <div className={styles.field}>
          <label htmlFor="birthday">Birthday</label>
          <input
            id="birthday"
            name="birthday"
            type="date"
            required
            defaultValue={birthday || null}
          />
        </div>
        {birthday && (
          <p className={styles.message}>Your birthday is {birthday}!</p>
        )}
        <button className={common.button} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default MetadataPage;
