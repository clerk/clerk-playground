import Highlight, { defaultProps } from 'prism-react-renderer';

import styles from '/styles/Common.module.css';

const Code = ({ children, ...otherProps }) => {
  return (
    <Highlight {...defaultProps} code={children} language="js" {...otherProps}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={`${styles.code} ${className}`} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

export default Code;
