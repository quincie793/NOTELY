// components/UploadImage.tsx
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface UploadImageProps {
  onSuccess: (url: string) => void;
  className?: string;
  children?: React.ReactNode;
  isIcon?: boolean;
}

function UploadImage({ onSuccess, className = "", children, isIcon = false }: UploadImageProps) {
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Check if Cloudinary script is loaded
    if (!window.cloudinary) {
      // Load Cloudinary widget script dynamically
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        initWidget();
      };
    } else {
      initWidget();
    }

    function initWidget() {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: "djyqthxkc", // Your cloud name
          uploadPreset: "wavinya", // Your upload preset
          sources: ['local', 'camera', 'url'],
          multiple: false,
          cropping: true,
          croppingAspectRatio: 1,
          croppingDefaultSelectionRatio: 0.8,
          croppingShowDimensions: true,
          showAdvancedOptions: true,
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#90A0B3",
              tabIcon: "#0078FF",
              menuIcons: "#5A616A",
              textDark: "#000000",
              textLight: "#FFFFFF",
              link: "#0078FF",
              action: "#FF620C",
              inactiveTabIcon: "#0E2F5A",
              error: "#F44235",
              inProgress: "#0078FF",
              complete: "#20B832",
              sourceBg: "#E4EBF1"
            }
          }
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            console.log("Cloudinary upload result:", result.info);
            onSuccess(result.info.secure_url);
          } else if (error) {
            console.error("Cloudinary upload error:", error);
          }
        }
      );
    }

    return () => {
      // Cleanup if needed
      if (widgetRef.current) {
        widgetRef.current.destroy();
      }
    };
  }, [onSuccess]);

  const handleClick = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      console.error("Cloudinary widget not initialized");
    }
  };

  if (isIcon && children) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={className}
        aria-label="Upload profile picture"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-all duration-200 ${className}`}
    >
      {children || "Upload Image"}
    </button>
  );
}

export default UploadImage;