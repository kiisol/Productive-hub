import { useState } from 'react';
import type { Task } from './model';
import { t } from '@shared/i18n';
export default function NewTaskDialog({
    add,
    onClose,
}: {
    add: (title: string, priority: Task['priority']) => void;
    onClose: () => void;
}) {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<Task['priority']>('Medium');
    return (
        <div className="modal-backdrop" onClick={() => onClose()}>
            <section
                className="task-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="new-task-title"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') onClose();
                    if (e.key === 'Tab') {
                        const els = Array.from(
                            e.currentTarget.querySelectorAll<HTMLElement>('button, input, select'),
                        );
                        const first = els[0],
                            last = els[els.length - 1];
                        if (e.shiftKey && document.activeElement === first) {
                            e.preventDefault();
                            last.focus();
                        } else if (!e.shiftKey && document.activeElement === last) {
                            e.preventDefault();
                            first.focus();
                        }
                    }
                }}
            >
                <h2 id="new-task-title">{t('tasks.newTaskTitle')}</h2>
                <p>{t('tasks.newTaskQuestion')}</p>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!title.trim()) return;
                        add(title.trim(), priority);
                        setTitle('');
                        onClose();
                    }}
                >
                    <label>
                        {t('tasks.taskName')}
                        <input
                            autoFocus
                            required
                            maxLength={160}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={t('tasks.taskPlaceholder')}
                        />
                    </label>
                    <label>
                        {t('tasks.priority')}
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as Task['priority'])}
                        >
                            <option value="High">{t('priority.high')}</option>
                            <option value="Medium">{t('priority.medium')}</option>
                            <option value="Low">{t('priority.low')}</option>
                        </select>
                    </label>
                    <div className="modal-actions">
                        <button type="button" className="secondary" onClick={() => onClose()}>
                            {t('common.cancel')}
                        </button>
                        <button className="primary" disabled={!title.trim()}>
                            {t('common.addTask')}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
