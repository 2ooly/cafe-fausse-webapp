import { useState } from 'react';
import { galleryImages } from '../data/gallery.js';

export default function Gallery() {
  const [lightboxImage, setLightboxImage] = useState(null);

  const handleOpen = (image) => setLightboxImage(image);
  const handleClose = () => setLightboxImage(null);

  return (
    <div className="page gallery">
      <header className="page-header">
        <h1>Gallery</h1>
        <p>Explore the ambiance, cuisine, and experiences that define Café Fausse.</p>
      </header>

      <div className="gallery-grid" role="list">
        {galleryImages.map((image) => (
          <button
            key={image.src}
            type="button"
            className="gallery-tile"
            onClick={() => handleOpen(image)}
          >
            <img src={image.src} alt={image.alt} />
          </button>
        ))}
      </div>

      {lightboxImage && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={handleClose}>
          <div className="lightbox-content" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="lightbox-close" onClick={handleClose} aria-label="Close image">
              ×
            </button>
            <img src={lightboxImage.src} alt={lightboxImage.alt} />
            <p>{lightboxImage.alt}</p>
          </div>
        </div>
      )}
    </div>
  );
}
