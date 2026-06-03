import { useState, useEffect, useCallback } from "react";
import client from "../api/client";
import { Document } from "../types";

interface UseDocumentsReturn {
  documents: Document[];
  loading: boolean;
  uploading: boolean;
  error: string | null;
  uploadDocument: (file: File) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  refresh: () => void;
}

export function useDocuments(): UseDocumentsReturn {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await client.get<{ documents: Document[] }>("/documents");
      setDocuments(data.documents);
    } catch {
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const uploadDocument = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await client.post<{ document: Document }>("/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDocuments((prev) => [data.document, ...prev]);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        "Upload failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await client.delete(`/documents/${id}`);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch {
      setError("Failed to delete document");
    }
  };

  return {
    documents,
    loading,
    uploading,
    error,
    uploadDocument,
    deleteDocument,
    refresh: fetchDocuments,
  };
}
