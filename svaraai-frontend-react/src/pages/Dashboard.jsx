import { useEffect, useState, useCallback, useMemo } from 'react';
import api from '../api';
import Card from '../components/Card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Button from '../components/Button';

const COLORS = ['#4f46e5', '#f59e0b', '#10b981'];

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasksSummary, setTasksSummary] = useState({ todo: 0, 'in-progress': 0, done: 0 });
  const [totalTasks, setTotalTasks] = useState(0);
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // responsive chart height
  const [chartHeight, setChartHeight] = useState(getChartHeight());

  function getChartHeight() {
    if (typeof window === 'undefined') return 280;
    const w = window.innerWidth;
    if (w < 480) return 220;
    if (w < 880) return 260;
    if (w < 1200) return 300;
    return 320;
  }

  useEffect(() => {
    const onResize = () => setChartHeight(getChartHeight());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pRes = await api.get('/projects');
      const projList = Array.isArray(pRes.data) ? pRes.data : [];
      setProjects(projList);

      // fetch tasks for all projects in parallel
      const tasksFetch = projList.map((p) =>
        api.get(`/tasks/project/${p._id}?limit=1000`).then(r => r.data.items).catch(() => [])
      );
      const tasksByProject = await Promise.all(tasksFetch);
      const allTasks = tasksByProject.flat();

      const summary = { todo: 0, 'in-progress': 0, done: 0 };
      const now = new Date();
      const overdueList = [];

      allTasks.forEach((t) => {
        const s = t.status || 'todo';
        summary[s] = (summary[s] || 0) + 1;

        if (t.deadline) {
          const dl = new Date(t.deadline);
          if (dl < now && s !== 'done') overdueList.push(t);
        }
      });

      setTasksSummary(summary);
      setTotalTasks(allTasks.length);
      overdueList.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      setOverdue(overdueList);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const data = useMemo(() => ([
    { name: 'Todo', value: tasksSummary.todo },
    { name: 'In Progress', value: tasksSummary['in-progress'] },
    { name: 'Done', value: tasksSummary.done },
  ]), [tasksSummary]);

  const formatDateShort = (d) => (d ? new Date(d).toLocaleDateString() : '-');

  return (
    <div className="page">
      <div className="page-header responsive-header">
        <div>
          <h1>Dashboard</h1>
          <div className="muted small">Overview of projects & tasks</div>
        </div>

        <div className="header-actions">
          <Button onClick={fetchData} className="btn-small" aria-label="Refresh dashboard">Refresh</Button>
        </div>
      </div>

      {error && <div className="alert error" role="alert">{error}</div>}

      <div className="grid three-cols responsive-stats">
        <Card aria-label="Projects">
          <div className="stat-title">Projects</div>
          <div className="stat-value">{projects.length}</div>
          <div className="stat-sub">Total projects you own</div>
        </Card>

        <Card aria-label="Total tasks">
          <div className="stat-title">Total Tasks</div>
          <div className="stat-value">{loading ? '—' : totalTasks}</div>
          <div className="stat-sub">All tasks across projects</div>
        </Card>

        <Card aria-label="Overdue tasks">
          <div className="stat-title">Overdue</div>
          <div className="stat-value overdue">{loading ? '—' : overdue.length}</div>
          <div className="stat-sub">Tasks past deadline and not done</div>
        </Card>
      </div>

      <div className="grid main-grid responsive-main">
        <Card className="chart-card">
          <div className="card-header">
            <h3>Tasks by Status</h3>
            <div className="updated">Last updated: {new Date().toLocaleString()}</div>
          </div>

          <div style={{ width: '100%', height: chartHeight }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={Math.max(60, Math.floor(chartHeight / 3))}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {data.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="legend-row small" aria-hidden>
            <div className="legend-item"><span className="legend-swatch" style={{ background: COLORS[0] }}></span> Todo <strong>{tasksSummary.todo}</strong></div>
            <div className="legend-item"><span className="legend-swatch" style={{ background: COLORS[1] }}></span> In Progress <strong>{tasksSummary['in-progress']}</strong></div>
            <div className="legend-item"><span className="legend-swatch" style={{ background: COLORS[2] }}></span> Done <strong>{tasksSummary.done}</strong></div>
          </div>
        </Card>

        <Card>
          <div className="card-header">
            <h3>Overdue Tasks</h3>
            <div className="muted">{overdue.length} total</div>
          </div>

          {loading ? <div className="muted">Loading…</div> :
            overdue.length === 0 ? <div className="muted">No overdue tasks 🎉</div> :
              <ul className="list-overdue">
                {overdue.map(t => (
                  <li key={t._id} className="overdue-item">
                    <div className="overdue-left">
                      <div className="overdue-title">{t.title}</div>
                      <div className="muted small">{t.projectId ? `Project: ${t.projectId}` : ''}</div>
                    </div>
                    <div className="muted small">{formatDateShort(t.deadline)}</div>
                  </li>
                ))}
              </ul>
          }
        </Card>
      </div>
    </div>
  );
}
