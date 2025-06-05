"use client"
import { useState } from "react"
import { X, Upload, Link as LinkIcon } from "./icons"

export default function FileUploadModal({ onClose, onSubmit, taskId, taskTitle }) {
  const [uploadType, setUploadType] = useState("file") // "file" or "link"
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [docLink, setDocLink] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsUploading(true)

    // Create the submission data based on upload type
    const submissionData = {
      taskId,
      type: uploadType,
      timestamp: new Date().toISOString(),
    }

    if (uploadType === "file") {
      // In a real app, you would upload the file to a server here
      // For this demo, we'll just pass the file name
      submissionData.file = file
      // submissionData.fileUrl = `#/files/${fileName}` // Placeholder URL
    } else {
      submissionData.docLink = docLink
    }

    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false)
      onSubmit(submissionData)
    }, 1000)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content file-upload-modal">
        <div className="modal-header">
          <h2 className="modal-title">Upload Submission</h2>
          <button className="modal-close" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="task-info-banner">
          <p>
            Task: <strong>{taskTitle}</strong>
          </p>
        </div>

        <div className="upload-type-selector">
          <button
            className={`upload-type-btn ${uploadType === "file" ? "active" : ""}`}
            onClick={() => setUploadType("file")}
          >
            <Upload className="upload-type-icon" />
            <span>Upload File</span>
          </button>
          <button
            className={`upload-type-btn ${uploadType === "link" ? "active" : ""}`}
            onClick={() => setUploadType("link")}
          >
            <LinkIcon className="upload-type-icon" />
            <span>Google Docs Link</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {uploadType === "file" ? (
            <div className="form-group">
              <label htmlFor="file-upload">Select File</label>
              <div className="file-upload-container">
                <input type="file" id="file-upload" onChange={handleFileChange} className="file-input" required />
                <label htmlFor="file-upload" className="file-upload-label">
                  <Upload className="upload-icon" />
                  <span>{fileName || "Choose a file..."}</span>
                </label>
              </div>
              <p className="file-help-text">Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX</p>
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="doc-link">Google Docs Link</label>
              <input
                type="url"
                id="doc-link"
                placeholder="https://docs.google.com/..."
                value={docLink}
                onChange={(e) => setDocLink(e.target.value)}
                className="form-control"
                required
              />
              <p className="file-help-text">Paste the shareable link to your Google Docs document</p>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-submit" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
