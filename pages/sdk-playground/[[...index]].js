import { useState } from 'react';

import Code from '/components/Code';
import Explorer from '/components/Explorer';
import { SDK_METHODS } from '/utils/methods';

import common from '/styles/Common.module.css';
import styles from '/styles/Explorer.module.css';
import { useEffect } from 'react';

const SDKPlayground = () => {
  const [activeMethod, setActiveMethod] = useState(null);
  const [output, setOutput] = useState(
    '← Click on a property or method to the left and view the results here.'
  );
  const [jwt, setDecodedJWT] = useState('');

  const handleMethodCall = (method, response, decoded) => {
    setActiveMethod(method.name);

    if (response) {
      setOutput(response);

      if (decoded) {
        setDecodedJWT(decoded);
      } else {
        setDecodedJWT('');
      }
    } else {
      setOutput('// No data returned');
    }
  };

  return (
    <>
      <Explorer
        methods={SDK_METHODS}
        onUpdate={handleMethodCall}
        activeMethod={activeMethod}
      />
      <div className={styles.container}>
        <h1 className={common.title}>SDK Playground</h1>
        <Code>{output}</Code>
        {jwt ? (
          <>
            <h2>Decoded JWT</h2>
            <Code>{jwt}</Code>
          </>
        ) : null}
      </div>
    </>
  );
};

export default SDKPlayground;
