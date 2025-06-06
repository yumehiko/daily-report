import { ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  onClick: () => void;
  children: ReactNode;
  title?: string;
  style?: React.CSSProperties;
  className?: string;
};

export default function Button({ onClick, children, title, style, className }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={style}
      className={`${styles.button} ${className ?? ''}`.trim()}
    >
      {children}
    </button>
  );
}
