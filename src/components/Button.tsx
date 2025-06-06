import { ReactNode } from 'react';

type ButtonProps = {
  onClick: () => void;
  children: ReactNode;
  title?: string;
  style?: React.CSSProperties;
};

export default function Button({ onClick, children, title, style }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: '#eee',
        border: '1px solid #ccc',
        borderRadius: 4,
        padding: '0.3em 1em',
        ...style
      }}
    >
      {children}
    </button>
  );
}
