export default function TaskCard({ task }) {
  const priorityClass = task.priority === 'high' ? 'priority high' : task.priority === 'medium' ? 'priority medium' : 'priority low';
  return (
    <div className="task-card">
      <div className="task-row">
        <div className="task-title">{task.title}</div>
        <div className={priorityClass}>{task.priority}</div>
      </div>
      {task.deadline && <div className="muted small">Due: {new Date(task.deadline).toLocaleDateString()}</div>}
    </div>
  );
}
