import Card from './Card';
import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  return (
    <Card>
      <div className="project-row">
        <div>
          <div className="project-title">{project.name}</div>
          <div className="muted">{project.description}</div>
        </div>
        <div>
          <Link to={`/projects/${project._id}/kanban`} className="link">Open</Link>
        </div>
      </div>
    </Card>
  );
}
