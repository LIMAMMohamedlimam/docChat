import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface DropZoneProps {
  onDrop: (file: File) => void;
  uploading: boolean;
}

const ACCEPTED = {
  "application/pdf": [".pdf"],
  "text/csv": [".csv"],
  "text/plain": [".txt"],
};

export default function DropZone({ onDrop, uploading }: DropZoneProps) {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) onDrop(acceptedFiles[0]);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop: handleDrop,
    accept: ACCEPTED,
    maxSize: 20 * 1024 * 1024,
    multiple: false,
    disabled: uploading,
  });

  const rejection = fileRejections[0]?.errors[0]?.message;

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400 bg-white"}
          ${uploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p className="text-sm text-gray-500">Uploading…</p>
        ) : isDragActive ? (
          <p className="text-sm text-blue-600 font-medium">Drop it here</p>
        ) : (
          <div>
            <p className="text-sm text-gray-600">
              Drag & drop a file here, or{" "}
              <span className="text-blue-600 font-medium">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">PDF, CSV, TXT — max 20 MB</p>
          </div>
        )}
      </div>
      {rejection && <p className="text-xs text-red-600">{rejection}</p>}
    </div>
  );
}
