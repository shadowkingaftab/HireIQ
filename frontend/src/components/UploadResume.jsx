import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { parseResume } from "../services/api";

export default function UploadResume({ onParse, setLoading }) {
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const data = await parseResume(file);
      onParse(data);
    } catch (error) {
      console.error("Error parsing resume:", error);
      alert("Failed to parse resume. Please ensure it is a valid PDF.");
    } finally {
      setLoading(false);
    }
  }, [onParse, setLoading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed p-8 rounded-xl text-center cursor-pointer transition ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="C7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        {isDragActive ? (
          <p className="text-blue-600 font-medium">Drop the resume here ...</p>
        ) : (
          <p className="text-gray-600">Drag & drop a PDF resume here, or click to select</p>
        )}
        <p className="text-xs text-gray-400 mt-2">Only PDF files are supported</p>
      </div>
    </div>
  );
}
