// src/components/group/MediaGallery.tsx
import React from "react";

interface Media {
  id: number;
  type: "image" | "video";
  url: string;
}

interface MediaGalleryProps {
  medias: Media[];
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ medias }) => {
  return (
    <div className="p-3 grid grid-cols-3 gap-2">
      {medias.map((media) => (
        <div key={media.id} className="rounded overflow-hidden">
          {media.type === "image" ? (
            <img src={media.url} alt="media" className="w-full h-full object-cover" />
          ) : (
            <video src={media.url} controls className="w-full h-full" />
          )}
        </div>
      ))}
    </div>
  );
};

export default MediaGallery;
