import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import './gallery.css';

export const metadata = {
  title: "Gallery | Discover Greece with George",
  description: "A glimpse of the beautiful destinations we visit in Greece.",
};

export default function GalleryPage() {
  // Read all photos from public/photos
  const photosDir = path.join(process.cwd(), 'public', 'photos');
  const files = fs.readdirSync(photosDir);
  const photos = files.filter(file => file.endsWith('.jfif') || file.endsWith('.jpg') || file.endsWith('.png'));

  return (
    <div className="gallery-page page-container">
      <div className="container">
        <header className="page-header text-center">
          <h1 className="font-serif">Photo Gallery</h1>
          <p className="page-subtitle">A glimpse of the beautiful destinations we visit across Greece.</p>
        </header>

        <div className="masonry-grid">
          {photos.map((photo, i) => (
            <div key={i} className="masonry-item">
              <Image 
                src={`/photos/${photo}`}
                alt={`Gallery photo ${i + 1}`}
                width={600}
                height={400}
                className="masonry-img object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
