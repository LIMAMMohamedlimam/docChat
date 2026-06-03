import { Document } from "../types";

interface DocumentListProps {
  documents: Document[];
  onDelete: (id: string) => void;
  onSelect?: (doc: Document) => void;
  selectedId?: string;
}

function fileIcon(mimeType: string) {
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType === "text/csv") return "CSV";
  return "TXT";
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DocumentList({
  documents,
  onDelete,
  onSelect,
  selectedId,
}: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-8">
        No documents yet. Upload one above.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {documents.map((doc) => (
        <li
          key={doc.id}
          onClick={() => onSelect?.(doc)}
          className={`flex items-center justify-between rounded-lg px-4 py-3 border transition-colors
            ${onSelect ? "cursor-pointer" : ""}
            ${selectedId === doc.id ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}
          `}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xs font-bold text-white bg-gray-400 rounded px-1.5 py-0.5 shrink-0">
              {fileIcon(doc.mimeType)}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{doc.filename}</p>
              <p className="text-xs text-gray-400">
                {formatSize(doc.sizeBytes)} · {formatDate(doc.uploadedAt)}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(doc.id);
            }}
            className="ml-4 text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0"
            aria-label="Delete document"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
