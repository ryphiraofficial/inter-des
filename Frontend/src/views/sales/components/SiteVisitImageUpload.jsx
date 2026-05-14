import React from 'react';
import { Camera, X } from 'lucide-react';

const SiteVisitImageUpload = ({ images, handleImageChange, removeImage }) => {
    return (
        <div className="form-section card">
            <label className="section-label">Site Photos (Max 5)</label>
            <div className="image-upload-grid">
                {images.map((img, index) => (
                    <div key={index} className="image-preview">
                        <img src={img.preview} alt="Site" />
                        <button type="button" className="remove-btn" onClick={() => removeImage(index)}>
                            <X size={16} />
                        </button>
                    </div>
                ))}

                {images.length < 5 && (
                    <label className="upload-placeholder">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            hidden
                        />
                        <div className="placeholder-content">
                            <Camera size={32} />
                            <span>Add Photo</span>
                        </div>
                    </label>
                )}
            </div>
            <p className="upload-hint">Upload site progress, measurements, or defects.</p>
        </div>
    );
};

export default SiteVisitImageUpload;
