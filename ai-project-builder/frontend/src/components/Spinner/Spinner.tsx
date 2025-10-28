// frontend/components/Spinner/Spinner.tsx
import React from 'react';
import './Spinner.css';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'medium', color = '#3b82f6' }) => {
  return (
    <div className={`spinner spinner-${size}`} style={{ borderTopColor: color }}></div>
  );
};

export default Spinner;