import common from '/styles/Common.module.css';

const Components = () => {
  return (
    <div className={common.container} style={{ maxWidth: '95vw' }}>
      <h1 className={common.title}>Components Appearance Editor</h1>
      <iframe
        src="https://codesandbox.io/embed/infallible-black-qmyxnb?fontsize=14&hidenavigation=1&theme=dark"
        style={{
          width: '100%',
          height: 650,
          border: 0,
          borderRadius: '4px',
          overflow: 'hidden'
        }}
        title="Compoennts Appearance Editor"
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      ></iframe>
    </div>
  );
};

export default Components;
