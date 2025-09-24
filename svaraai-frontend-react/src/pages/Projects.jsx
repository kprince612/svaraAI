import { useEffect, useState } from 'react';
import api from '../api';
import ProjectCard from '../components/ProjectCard';
import Modal from '../components/Modal';
import Button from '../components/Button';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetch = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch projects');
    }
  };

  useEffect(() => { fetch(); }, []);

  const create = async () => {
    try {
      await api.post('/projects', { name, description });
      setOpen(false); setName(''); setDescription('');
      fetch();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Projects</h1>
        <Button onClick={() => setOpen(true)}>New Project</Button>
      </div>

      <div className="grid two-cols">
        {projects.map(p => <ProjectCard key={p._id} project={p} />)}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create project">
        <div className="modal-body">
          <label className="label">Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          <label className="label">Description</label>
          <textarea className="input textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="actions">
            <Button onClick={create}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
