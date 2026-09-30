import {useEffect, useRef, useState, type TouchEvent} from 'react';
import {Image, MediaFile} from '@shopify/hydrogen';
import type {ProductFragment, ProductVariantFragment} from 'storefrontapi.generated';
import {Modal} from '../ui/Modal';

export function ProductGallery({media, selectedImage, title}: {
  media: ProductFragment['media']['nodes'];
  selectedImage?: ProductVariantFragment['image'];
  title: string;
}) {
  const [index, setIndex] = useState(() => Math.max(0, media.findIndex((item) => item.previewImage?.url === selectedImage?.url || (item.__typename === 'MediaImage' && item.image?.url === selectedImage?.url))));
  const [zoom, setZoom] = useState(false);
  const [enlarged, setEnlarged] = useState(false);
  const touch = useRef<{x: number; y: number} | null>(null);
  const suppressZoomUntil = useRef(0);
  useEffect(() => {
    const position = media.findIndex((item) => item.previewImage?.url === selectedImage?.url || (item.__typename === 'MediaImage' && item.image?.url === selectedImage?.url));
    if (position >= 0) setIndex(position);
  }, [selectedImage?.url, media]);

  const current = media[index];
  const image = current?.__typename === 'MediaImage' ? current.image : !current ? selectedImage : null;
  const total = media.length;
  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    touch.current = null;
    if (event.touches.length !== 1) return;
    const target = event.target;
    if (target instanceof Element && target.closest('.gallery-controls, video, iframe')) return;
    const first = event.touches[0];
    touch.current = first ? {x: first.clientX, y: first.clientY} : null;
  }
  function onTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touch.current;
    touch.current = null;
    const end = event.changedTouches[0];
    if (!start || !end || total < 2) return;
    const horizontal = end.clientX - start.x;
    const vertical = end.clientY - start.y;
    // Leave native vertical scrolling and pinch gestures entirely to the browser.
    if (Math.abs(horizontal) > 48 && Math.abs(horizontal) > Math.abs(vertical) * 1.4) {
      suppressZoomUntil.current = Date.now() + 500;
      setIndex((value) => (value + (horizontal < 0 ? 1 : -1) + total) % total);
    }
  }
  return (
    <section className="product-gallery" aria-label={`${title} gallery`}>
      <div className="product-gallery-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onTouchCancel={() => {touch.current = null;}}>
        {image ? (
          <button className="product-image-zoom" type="button" aria-label={`Enlarge image ${index + 1} of ${title}`} onClick={() => {if (Date.now() < suppressZoomUntil.current) return; setEnlarged(false); setZoom(true);}} onKeyDown={(event) => {
            if (total > 1 && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
              event.preventDefault();
              setIndex((value) => (value + (event.key === 'ArrowRight' ? 1 : -1) + total) % total);
            }
          }}>
            <Image data={image} alt={image.altText || title} sizes="(min-width: 1600px) 850px, (min-width: 900px) 58vw, 100vw" width={1200} loading="eager" fetchPriority="high" />
            <span className="product-zoom-label">Explore the details <span aria-hidden="true">＋</span></span>
          </button>
        ) : current ? (
          <MediaFile data={current} className="product-gallery-video" mediaOptions={{video: {controls: true, preload: 'none'}, externalVideo: {controls: true}}} />
        ) : <div className="product-media-empty">Photography is not available for this piece.</div>}
        {total > 1 && <div className="gallery-controls">
          <button type="button" aria-label="Previous product image" onClick={() => setIndex((index - 1 + total) % total)}>←</button>
          <span aria-live="polite">{index + 1} <span aria-hidden="true">/</span><span className="sr-only">of</span> {total}</span>
          <button type="button" aria-label="Next product image" onClick={() => setIndex((index + 1) % total)}>→</button>
        </div>}
      </div>
      {total > 1 && <div className="gallery-thumbnails" aria-label="Choose product media">
        {media.map((item, position) => (
          <button key={item.id} type="button" className={position === index ? 'is-selected' : ''} aria-label={`View ${item.__typename === 'Video' || item.__typename === 'ExternalVideo' ? 'video' : 'image'} ${position + 1}`} aria-pressed={position === index} onClick={() => setIndex(position)}>
            {item.previewImage ? <Image data={item.previewImage} alt="" width={110} sizes="70px" loading="lazy" /> : <span>Video</span>}
            {item.__typename !== 'MediaImage' && <span className="gallery-video-indicator" aria-hidden="true">▶</span>}
          </button>
        ))}
      </div>}
      <Modal open={zoom} onClose={() => setZoom(false)} title="A closer look" className="product-zoom-modal">
        {image && <div className="product-zoom-content">
          <p>Use the image to zoom. Scroll to explore the garment.</p>
          <button type="button" className={`product-zoom-image${enlarged ? ' is-enlarged' : ''}`} aria-label={enlarged ? 'Reduce image size' : 'Zoom in on garment'} aria-pressed={enlarged} onClick={() => setEnlarged(!enlarged)}>
            <Image data={image} alt={image.altText || title} width={2000} sizes={enlarged ? '1800px' : '90vw'} loading="lazy" />
          </button>
        </div>}
      </Modal>
    </section>
  );
}
