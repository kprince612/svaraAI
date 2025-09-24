import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from '../api';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import Button from '../components/Button';

const columnsOrder = ['todo', 'in-progress', 'done'];

export default function Kanban() {
  const { id: projectId } = useParams();
  const [tasksByStatus, setTasksByStatus] = useState({ todo: [], 'in-progress': [], done: [] });
  const [project, setProject] = useState(null);
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  const fetch = async () => {
    try {
      const pRes = await api.get('/projects');
      setProjects(pRes.data);
      const res = await api.get(`/tasks/project/${projectId}`);
      const items = res.data.items || [];
      const grouped = { todo: [], 'in-progress': [], done: [] };
      items.forEach(t => grouped[t.status].push(t));
      setTasksByStatus(grouped);
      setProject(pRes.data.find(x => x._id === projectId) || null);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch tasks');
    }
  };

  useEffect(() => { if (projectId) fetch(); }, [projectId]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const task = tasksByStatus[source.droppableId].find(t => t._id === draggableId);
    if (!task) return;
    try {
      await api.put(`/tasks/${draggableId}`, { status: destination.droppableId });
      const sourceList = Array.from(tasksByStatus[source.droppableId]);
      const destList = Array.from(tasksByStatus[destination.droppableId]);
      const idx = sourceList.findIndex(t => t._id === draggableId);
      sourceList.splice(idx, 1);
      destList.splice(destination.index, 0, { ...task, status: destination.droppableId });
      setTasksByStatus({ ...tasksByStatus, [source.droppableId]: sourceList, [destination.droppableId]: destList });
    } catch (err) {
      console.error(err);
      alert('Failed to update task status');
    }
  };

  const addTask = async (data) => {
    try {
      await api.post('/tasks', data);
      setOpen(false);
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>{project?.name || 'Kanban'}</h1>
        <Button onClick={() => setOpen(true)}>Add Task</Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-grid">
          {columnsOrder.map(col => (
            <Droppable droppableId={col} key={col}>
              {(provided) => (
                <div className="kanban-column" ref={provided.innerRef} {...provided.droppableProps}>
                  <div className="column-title">{col.replace('-', ' ').toUpperCase()}</div>
                  <div className="column-list">
                    {tasksByStatus[col].map((task, idx) => (
                      <Draggable draggableId={task._id} index={idx} key={task._id}>
                        {(prov) => (
                          <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="draggable">
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <Modal open={open} onClose={() => setOpen(false)} title="Add task">
        <TaskForm onSave={addTask} onCancel={() => setOpen(false)} projects={projects} />
      </Modal>
    </div>
  );
}
