// src/components/ui/Avatar.tsx
import React from "react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = "Avatar", size = 40 }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ccc",
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <span style={{ fontSize: size / 2, color: "#fff" }}>👥</span>
      )}
    </div>
  );
};

export default Avatar;
