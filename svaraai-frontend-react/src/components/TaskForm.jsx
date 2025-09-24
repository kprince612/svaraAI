import { useState } from 'react';
import Button from './Button';

export default function TaskForm({ initial = {}, onSave, onCancel, projects = [] }) {
  const [title, setTitle] = useState(initial.title || '');
  const [priority, setPriority] = useState(initial.priority || 'medium');
  const [status, setStatus] = useState(initial.status || 'todo');
  const [deadline, setDeadline] = useState(initial.deadline ? new Date(initial.deadline).toISOString().slice(0,10) : '');
  const [projectId, setProjectId] = useState(initial.projectId || (projects[0] && projects[0]._id));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return alert('Title required');
    onSave({ title, priority, status, deadline: deadline || null, projectId });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label className="label">Title</label>
      <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />

      <div className="form-row">
        <div>
          <label className="label">Priority</label>
          <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="label">Status</label>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      <label className="label">Deadline</label>
      <input className="input" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />

      <label className="label">Project</label>
      <select className="input" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
        {projects.map(p => <option key={p._id} value={p._1d}>{p.name}</option>)}
      </select>

      <div className="actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
