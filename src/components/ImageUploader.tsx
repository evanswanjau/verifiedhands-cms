import { useState, useRef, useEffect, type DragEvent } from "react";
import { UploadCloud, Loader2 } from "lucide-react";

type Props = {
  value?: string; // current image URL
  onSelect: (file: File) => void;
  uploading?: boolean;
  height?: number;
};

export default function ImageUploader({
  value,
  onSelect,
  uploading = false,
  height = 200,
}: Props) {
  const [preview, setPreview] = useState<string | undefined>(value);
  const [imgLoaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper function to get the full image URL
  const getImageUrl = (url: string) => {
    // If it's already a blob URL or absolute URL, return as-is
    if (url.startsWith("blob:") || url.startsWith("http")) {
      return url;
    }
    // Otherwise, prepend the base URL
    return import.meta.env.VITE_BASE_URL + url;
  };

  /* ---- keep preview in sync with the prop ---- */
  useEffect(() => {
    setPreview(value);
    setLoaded(false); // show Loader2 until it finishes loading
  }, [value]);

  /* revoke old object URLs to avoid leaks */
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const pick = () => inputRef.current?.click();

  const takeFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    setLoaded(false);
    onSelect(file);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) takeFile(e.dataTransfer.files[0]);
  };

  const bg = preview ? `url(${getImageUrl(preview)})` : "none";

  return (
    <div
      className="relative flex items-center justify-center w-full rounded-lg
        border-2 border-dashed border-gray-300 text-gray-500 cursor-pointer
        transition hover:border-primary/70 focus-within:ring-2 focus-within:ring-primary/60"
      style={{
        height,
        backgroundImage: bg,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      tabIndex={0}
      role="button"
      aria-label="Upload image"
      onClick={pick}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* Prompt when there's no image */}
      {!preview && (
        <div className="flex flex-col items-center pointer-events-none">
          <UploadCloud className="w-6 h-6 mb-1" />
          <span className="text-xs">Upload</span>
        </div>
      )}

      {/* Loader while uploading or while the preview hasn't finished loading */}
      {(uploading || (!imgLoaded && preview)) && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
          <Loader2 className="w-6 h-6 animate-spin text-white" />
        </div>
      )}

      {/* Invisible img just to detect onLoad */}
      {preview && (
        <img
          src={getImageUrl(preview)}
          alt=""
          className="sr-only"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(true); // Hide loader even on error
          }}
        />
      )}

      <input
        ref={inputRef}
        type="file"
        name="image"
        accept="image/*"
        className="sr-only"
        onChange={(e) => e.target.files?.[0] && takeFile(e.target.files[0])}
      />
    </div>
  );
}
