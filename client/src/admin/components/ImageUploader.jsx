import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FiUploadCloud, FiX, FiLoader } from 'react-icons/fi';
import uploadService from '../../services/uploadService';
import './ImageUploader.css';

// images: array of URL strings. onChange(newArray) is called whenever it changes.
const ImageUploader = ({ images, onChange }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    if (images.length + fileList.length > 8) {
      toast.error('You can have up to 8 images per product');
      return;
    }

    setUploading(true);
    try {
      const data = await uploadService.uploadImages(fileList);
      onChange([...images, ...data.urls]);
      toast.success(`${data.urls.length} image${data.urls.length !== 1 ? 's' : ''} uploaded`);
    } catch (err) {
      toast.error(err.message || 'Could not upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        className={`image-uploader-dropzone ${uploading ? 'uploading' : ''}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          hidden
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
        />
        {uploading ? (
          <><FiLoader className="spin-icon" size={22} /><span>Uploading...</span></>
        ) : (
          <><FiUploadCloud size={22} /><span>Click to upload, or drag images here</span><small>JPG, PNG, WEBP or GIF · up to 8 images</small></>
        )}
      </div>

      {images.length > 0 && (
        <div className="image-uploader-grid">
          {images.map((url, i) => (
            <div className="image-uploader-thumb" key={url + i}>
              <img src={url} alt={`Product ${i + 1}`} />
              <button type="button" onClick={() => removeImage(i)} aria-label="Remove image"><FiX size={14} /></button>
              {i === 0 && <span className="image-uploader-primary-tag">Primary</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
