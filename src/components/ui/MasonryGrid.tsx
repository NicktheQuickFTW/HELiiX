'use client';

import Masonry from 'react-masonry-css';
import { Media } from '@once-ui-system/core';

interface MasonryGridProps {
  images: Array<{
    src: string;
    alt: string;
    orientation?: 'horizontal' | 'vertical';
  }>;
  breakpoints?: {
    default: number;
    [key: number]: number;
  };
  className?: string;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  images,
  breakpoints = {
    default: 3,
    1024: 2,
    720: 1,
  },
  className,
}) => {
  return (
    <Masonry
      breakpointCols={breakpoints}
      className={`masonry-grid ${className || ''}`}
      columnClassName="masonry-grid-column"
    >
      {images.map((image, index) => (
        <Media
          priority={index < 10}
          sizes="(max-width: 560px) 100vw, 33vw"
          key={index}
          radius="m"
          aspectRatio={image.orientation === 'horizontal' ? '16 / 9' : '3 / 4'}
          src={image.src}
          alt={image.alt}
          style={{
            marginBottom: '1rem',
            display: 'block',
            width: '100%',
          }}
        />
      ))}
    </Masonry>
  );
};

// Add these styles to your globals.css
export const masonryStyles = `
.masonry-grid {
  display: flex;
  margin-left: -1rem;
  width: auto;
}

.masonry-grid-column {
  padding-left: 1rem;
  background-clip: padding-box;
}

.masonry-grid-column > div {
  margin-bottom: 1rem;
}
`;
