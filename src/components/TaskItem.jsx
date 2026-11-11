import { startTransition, useOptimistic, useState, useTransition } from "react";

export default function TaskItem({ task, onToggle }) {
  const [concluida, setOptimisticConcluida] = useOptimistic(task.concluida);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startSaving] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      setOptimisticConcluida((prev) => !prev);
      await onToggle(task);
    });
  };

  let className = "task";
  if (concluida) {
    className += " task--done";
  }
  if(isEditing) {
    className += " task--editing";
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const titulo = formData.get("titulo").trim();
    const descricao = formData.get("descricao").trim() || null;
    const unchanged = titulo === task.titulo && descricao === (task.descricao || null);

    if( !titulo || unchanged ) {
      setIsEditing(false);
      return;
    }
  }
  startSaving(async () => {
    const ok = await onEdit(task, { titulo, descricao });
    if(ok) {
      setIsEditing(false);
    }
  });

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setIsEditing(false);
    }
  }
  return (
    <li className={className}>
      <div className="task__check">
        <input
          className="checkbox"
          type="checkbox"
          checked={concluida}
          onChange={handleToggle}
          aria-label={`Concluir: ${task.titulo}`}
        />
      </div>
      {isEditing ? (
        {
          <form className="task__edit-form" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            <label className="visually-hidden" htmlFor={`edit-titulo-${task.id}`}>
              Título
            </label>
            <input
              id={`edit-titulo-${task.id}`}
              name="titulo"
              type="text"
              className="task__edit-title"
              defaultValue={task.titulo}
              maxLength={255}
              required
              disabled={isPending}
            />
            <label className="visually-hidden" htmlFor={`edit-descricao-${task.id}`}>
              Descrição
            </label>
            <textarea
              id={`edit-descricao-${task.id}`}
              name="descricao"
              className="task__edit-description"
              defaultValue={task.descricao || ""}
              rows={1}
              disabled={isPending}
            />
            <div className="task__edit-actions">
              <button type="submit" className="button button--primary" disabled={isPending}>
                Salvar 
              </button>
            </div>
          </form>
        }
      ) : (
      <>
      <div className="task__body">
        <span className="task__title">{task.titulo}</span>

        {task.descricao && (
          <p className="task__description">{task.descricao}</p>
        )}
      </div>

      <div className="task__actions">
        <button className="task__action" aria-label={`Editar: ${task.titulo}`}>
          Editar
        </button>
        <button
          className="task__action task-action--danger"
          aria-label={`Remover: ${task.titulo}`}
        >
          Remover
        </button>
      </div>
      </>
      )}
    
    </li>
  );
}
