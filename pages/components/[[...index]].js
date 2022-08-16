import common from '/styles/Common.module.css';
import styles from '/styles/Components.module.css';

const Components = () => {
  return (
    <div className={common.container} style={{ maxWidth: '95vw' }}>
      <header className={styles.header}>
        <h1 className={common.title}>Components Appearance Customizer</h1>
        <div className={styles.message}>
          <p>
            <strong>Note:</strong> IntelliSense code completion doesn't fully
            work in the embed. Use the{' '}
            <a
              href="https://codesandbox.io/s/infallible-black-qmyxnb?from-embed"
              className={styles.link}
              target="_blank"
            >
              full version
              <svg
                className={styles.icon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
              </svg>
            </a>{' '}
            for type hints.
          </p>
        </div>
      </header>
      <iframe
        src="https://codesandbox.io/embed/infallible-black-qmyxnb?fontsize=14&hidenavigation=1&theme=dark"
        style={{
          width: '100%',
          height: 650,
          border: 0,
          borderRadius: '4px',
          overflow: 'hidden'
        }}
        title="Components Appearance Customizer"
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      ></iframe>
    </div>
  );
};

export default Components;
