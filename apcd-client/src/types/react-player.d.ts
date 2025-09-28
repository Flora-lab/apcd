declare module "react-player" {
    import * as React from "react";
  
    type ReactPlayerProps = {
      url?: string | string[];
      playing?: boolean;
      controls?: boolean;
      width?: string | number;
      height?: string | number;
      [key: string]: any;
    };
  
    const ReactPlayer: React.FC<ReactPlayerProps>;
    export default ReactPlayer;
  }
  