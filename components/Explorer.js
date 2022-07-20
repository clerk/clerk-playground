import decode from 'jwt-decode';

import common from '/styles/Common.module.css';
import styles from '/styles/Explorer.module.css';

const Explorer = (props) => {
  const { activeMethod, methods, onUpdate } = props;
  const handleSubmit = async (event, method) => {
    const formData = new FormData(event.target);
    const values = Array.from(formData.values());
    const hasValues = Boolean(values.filter(Boolean).length);
    const entries = Object.fromEntries(formData.entries());
    const params = hasValues
      ? Object.keys(entries).reduce((acc, key) => {
          if (entries[key]) {
            acc[key] = entries[key];
          }

          return acc;
        }, {})
      : undefined;

    event.preventDefault();

    try {
      const response = await method.value(params);
      const responseText =
        typeof response !== 'string'
          ? JSON.stringify(response, null, 2)
          : response;

      if (responseText.startsWith('ey')) {
        // Decode JWT
        const decoded = decode(responseText);
        onUpdate(method, responseText, JSON.stringify(decoded, null, 2));
      } else {
        onUpdate(method, responseText);
      }
    } catch (err) {
      const error = err?.errors?.[0];
      onUpdate(method, error?.message || 'An error occurred');
    }
  };

  return (
    <div className={styles.nav}>
      <ul className={styles.list}>
        {methods.map((feature) => (
          <li key={feature.name}>
            <h2 className={styles.title}>{feature.name}</h2>
            <ul className={styles.list}>
              {feature.methods.map((method) => (
                <li key={method.name}>
                  <form
                    className={
                      method.name === activeMethod ? styles.active : undefined
                    }
                    onSubmit={(event) => handleSubmit(event, method)}
                  >
                    {method.fields?.map((field) => (
                      <input
                        key={field.name}
                        className={styles.input}
                        name={field.name}
                        placeholder={field.placeholder}
                        type={field.type}
                      />
                    ))}
                    <button className={styles.button} type="submit">
                      {method.name}
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Explorer;
