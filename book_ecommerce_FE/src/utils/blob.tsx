import { useState, useEffect } from 'react';

interface ImageComponentProps {
  imageUrl: string;
  alt?: string;
  className?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ 
  imageUrl, 
  alt = "", 
  className = "",
  onLoad,
  onError 
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!imageUrl) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    let objectUrl: string | null = null;

    const loadImage = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(imageUrl, {
          mode: 'cors',
          credentials: 'omit', // Important for ORB
          headers: {
            'Accept': 'image/*',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();
        
        // Check if component is still mounted
        if (!isMounted) return;

        objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
        
        if (onLoad) {
          onLoad();
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        console.error('Error loading image:', error);
        
        if (isMounted) {
          setError(true);
          if (onError) {
            onError(error);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadImage();

    // Cleanup function
    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageUrl, onLoad, onError]);

  if (loading) {
    return <div className="image-loading">Loading image...</div>;
  }

  if (error) {
    return <div className="image-error">Failed to load image</div>;
  }

  if (!imageSrc) {
    return null;
  }

  return (
    <img 
      src={imageSrc} 
      alt={alt}
      className={className}
    />
  );
};

export default ImageComponent;