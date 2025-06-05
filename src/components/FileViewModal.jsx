"use client"
import { useState } from "react"
import { X, ExternalLink, FileText, Download } from "./icons"

export default function FileViewModal({ onClose, submission, taskTitle, task_id,  submitted_date }) {
  const [isLoading, setIsLoading] = useState(true)
  console.log(submitted_date)
  // Simulate loading the file or link
  setTimeout(() => {
    setIsLoading(false)
  }, 1000)

  const handleDownload = async() => {
    // In a real app, this would trigger a file download
    // alert("Downloading file: " + submission)

    const response = await fetch(`http://localhost:8000/api/download/${task_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      console.error("Failed to download file:", response.statusText)
      return
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${submission}`; 
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleOpenLink = () => {
    // Open the Google Docs link in a new tab
    window.open(submission.docLink, "_blank")
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content file-view-modal">
        <div className="modal-header">
          <h2 className="modal-title">View Submission</h2>
          <button className="modal-close" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="task-info-banner">
          <p>
            Task: <strong>{taskTitle}</strong>
          </p>
          <p className="submission-date">Submitted: {submitted_date ? new Date(submitted_date).toLocaleString() : "N/A"}</p>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading submission...</p>
          </div>
        ) : (
          <div className="submission-content">
            {
              submission.endsWith('.pdf') ||
              submission.endsWith('.docx') ||
              submission.endsWith('.pptx') ||
              submission.endsWith('.txt') ||
              submission.endsWith('.xlsx') ||
              submission.endsWith('.doc') ||
              submission.endsWith('.xls') ||
              submission.endsWith('.ppt')
              ? (
              <div className="file-preview">
                <div className="file-icon-container">
                  <FileText className="file-icon" />
                  <p className="file-name">{submission.fileName}</p>
                </div>
                <div className="file-actions">
                  <button className="btn btn-primary" onClick={handleDownload}>
                    <Download className="btn-icon" />
                    Download File
                  </button>
                </div>
              </div>
            ) : (
              <div className="link-preview">
                <p className="link-info">This submission is a Google Docs link:</p>
                <div className="link-container">
                  <a href={submission.docLink} target="_blank" rel="noopener noreferrer" className="doc-link">
                    {submission.docLink}
                  </a>
                </div>
                <div className="link-actions">
                  <button className="btn btn-primary" onClick={handleOpenLink}>
                    <ExternalLink className="btn-icon" />
                    Open in Google Docs
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="modal-actions">
          <button className="btn btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
