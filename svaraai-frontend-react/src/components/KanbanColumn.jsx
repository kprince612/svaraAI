export default function KanbanColumn({ title, children }) {
  return (
    <div className="kanban-column">
      <div className="column-title">{title}</div>
      <div className="column-body">{children}</div>
    </div>
  );
}
