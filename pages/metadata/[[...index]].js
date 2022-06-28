import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import common from '/styles/Common.module.css';
import styles from '/styles/Metadata.module.css';

const MetaDataPage = () => {
  const { user } = useUser();
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    const formData = new FormData(event.target);
    const birthday = formData.get('birthday');
    event.preventDefault();

    try {
      const response = await user.update({
        unsafeMetadata: { birthday: birthday }
      });
      if (response) {
        setMessage(response.unsafeMetadata.birthday);
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
        Will the custom attributes contain sensitive information that should not
        be displayed on the front-end? Use the <b>privateMetadata</b> property.{' '}
      </p>
      <p>
        Do you need to set some metadata from your back-end and have them
        displayed as read-only on the front-end? Use the <b>publicMetadata</b>{' '}
        property.{' '}
      </p>
      <p>
        Do you need to set the custom attributes from the front-end (using our
        ClerkJS library or the Frontend API)? You should choose the{' '}
        <b>unsafeMetadata</b> property.{' '}
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
          <input id="birthday" name="birthday" type="date" required />
        </div>
        {message && (
          <p className={styles.message}>Your birthday is {message}!</p>
        )}
        <button className={common.button} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default MetaDataPage;
