import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocuments } from "../hooks/useDocuments";
import DropZone from "../components/DropZone";
import DocumentList from "../components/DocumentList";
import { Document } from "../types";

export default function DocumentsPage() {
  const { documents, loading, uploading, error, uploadDocument, deleteDocument } =
    useDocuments();
  const navigate = useNavigate();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleDrop = async (file: File) => {
    setUploadError(null);
    try {
      await uploadDocument(file);
    } catch (err: unknown) {
      setUploadError((err as Error).message);
    }
  };

  const handleSelect = (doc: Document) => {
    navigate(`/chat/${doc.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload files to start chatting with them.
        </p>
      </div>

      <DropZone onDrop={handleDrop} uploading={uploading} />

      {(uploadError || error) && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {uploadError ?? error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
      ) : (
        <DocumentList
          documents={documents}
          onDelete={deleteDocument}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}
