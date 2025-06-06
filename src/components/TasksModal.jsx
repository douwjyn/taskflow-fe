"use client"
import { X } from "./icons"

export default function TasksModal({ title, items, onClose, formatDate }) {
  console.log(items)
  return (
    <div className="modal-overlay">
      <div className="modal-content tasks-modal">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <X />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="no-items">
            <p>No items to display.</p>
          </div>
        ) : (
          <div className="tasks-list">
            {items.map((item, index) => {
              return <div className="task-item-modal" key={index}>
                <div className="task-info">
                  <h4 className="task-title">{item.title}</h4>
                  {item.team && <p className="task-team">Team: {item.team}</p>}
                  {item.dueDate && <p className="task-date">Due: {formatDate(item.dueDate)}</p>}
                  {item.assignee && <p className="task-assignee">Assigned to: {item.assignee}</p>}
                </div>
                {item.status && (
                  <span
                    className={`task-status ${item.status === "Completed" ? "status-complete" : "status-progress"}`}
                  >
                    {item.status === "Completed" ? "Complete" : "In Progress"}
                  </span>
                )}
              </div>
            })}
          </div>
        )}
      </div>
    </div>
  )
}
