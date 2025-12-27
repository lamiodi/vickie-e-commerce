import { useState, useEffect } from 'react';

const FilePreview = ({ file, className, alt }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) {
      // eslint-disable-next-line
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Cleanup
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!preview) return null;

  return <img src={preview} alt={alt || 'Preview'} className={className} />;
};

export default FilePreview;
