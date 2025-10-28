import React, { useState } from 'react';

export default function DeployModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (cfg: { provider: string; region?: string; bucket?: string }) => void;
}) {
  const [provider, setProvider] = useState('s3-static');
  const [region, setRegion] = useState('us-east-1');
  const [bucket, setBucket] = useState('');

  return (
    <div id="modal" style={backdropStyle}>
      <div style={modalStyle}>
        <div style={modalHeader}>
          <strong>Deploy Project</strong>
          <button onClick={onClose} style={closeX}>×</button>
        </div>

        <div style={{ padding: 10 }}>
          <label style={labelStyle}>Provider</label>
          <select value={provider} onChange={(e) => setProvider(e.target.value)} style={inputStyle}>
            <option value="s3-static">S3 Static Website</option>
            <option value="vercel">Vercel</option>
            <option value="ec2">EC2 Instance</option>
          </select>

          {provider === 's3-static' && (
            <>
              <label style={labelStyle}>Region</label>
              <input value={region} onChange={(e) => setRegion(e.target.value)} style={inputStyle} />

              <label style={labelStyle}>Bucket</label>
              <input value={bucket} onChange={(e) => setBucket(e.target.value)} style={inputStyle} />
            </>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: 10 }}>
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button onClick={() => onConfirm({ provider, region, bucket })} className="btn btn-primary">Deploy</button>
        </div>
      </div>
    </div>
  );
}

/** Minimal inline styles using your palette */
const palette = {
  dark: '#1e3c61',
  mid: '#2c99b7',
  light: '#61c4ca',
};

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  width: 'min(560px, 92vw)',
  borderRadius: 8,
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  overflow: 'hidden',
};

const modalHeader: React.CSSProperties = {
  background: `linear-gradient(135deg, ${palette.dark}, ${palette.mid})`,
  color: '#fff',
  padding: '12px 14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const closeX: React.CSSProperties = {
  background: 'transparent',
  color: '#fff',
  border: 'none',
  fontSize: 22,
  cursor: 'pointer',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  margin: '10px 0 6px',
  color: palette.dark,
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: `1px solid ${palette.light}`,
  borderRadius: 6,
  outline: 'none',
};
