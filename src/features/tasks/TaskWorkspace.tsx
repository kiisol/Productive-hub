import { useState } from 'react';
import { useTasks } from './useTasks';
import NewTaskDialog from './NewTaskDialog';
import { t } from '@shared/i18n';
import { PanelHeader } from '@shared/ui/PanelHeader';
import { ScreenHeader, ScreenLayout } from '@shared/ui/ScreenLayout';
import { StatCard } from '@shared/ui/StatCard';

export default function TaskWorkspace({ today = false }: { today?: boolean }) {
    const { tasks, add, toggle, remove, storageError } = useTasks();
    const [filter, setFilter] = useState('All tasks');
    const [query, setQuery] = useState('');
    const [creating, setCreating] = useState(false);
    const done = tasks.filter((t) => t.done).length;
    const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    const visible = tasks.filter(
        (t) =>
            (!today || !t.done) &&
            (filter === 'All tasks' || (filter === 'In progress' ? !t.done : t.done)) &&
            `${t.title} ${t.project}`.toLowerCase().includes(query.toLowerCase()),
    );
    return (
        <ScreenLayout
            breadcrumb={
                <>
                    {t('tasks.workspace')} <span>/</span>{' '}
                    {today ? t('tasks.myDay') : t('navigation.tasks')}
                </>
            }
            footer={t('tasks.pageNote')}
        >
            <ScreenHeader
                eyebrow={t('tasks.focusEyebrow')}
                title={today ? t('tasks.myDayTitle') : t('tasks.tasksTitle')}
                description={today ? t('tasks.myDaySubtitle') : t('tasks.tasksSubtitle')}
                action={
                    <button className="primary" onClick={() => setCreating(true)}>
                        <span>＋</span> {t('tasks.newTask')}
                    </button>
                }
            />
            <section className="overview" aria-label={t('tasks.overview')}>
                <StatCard icon="▤" iconTone="purple" label={t('tasks.total')} value={tasks.length} hint={t('tasks.inYourSpace')} />
                <StatCard icon="◷" iconTone="amber" label={t('tasks.inProgress')} value={tasks.length - done} hint={t('tasks.stepByStep')} />
                <StatCard icon="✓" iconTone="green" label={t('tasks.completed')} value={done} hint={t('tasks.beProud')} />
            </section>
            <div className="workspace-grid">
                <section className="task-panel">
                    <PanelHeader
                        title={today ? t('tasks.nextStep') : t('tasks.yourTasks')}
                        count={tasks.length}
                        meta={t('tasks.list')}
                    />
                    <div className="task-toolbar">
                        <div className="tabs" aria-label={t('tasks.filter')}>
                            {[t('tasks.all'), t('tasks.active'), t('tasks.done')]
                                .filter((f) => !today || f !== t('tasks.done'))
                                .map((f) => (
                                    <button
                                        key={f}
                                        className={filter === f ? 'active' : ''}
                                        aria-pressed={filter === f}
                                        onClick={() => setFilter(f)}
                                    >
                                        {f}
                                    </button>
                                ))}
                        </div>
                        <label className="search">
                            <span aria-hidden="true">⌕</span>
                            <input
                                aria-label={t('tasks.search')}
                                placeholder={t('tasks.searchPlaceholder')}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </label>
                    </div>
                    {storageError && (
                        <p role="alert" className="error">
                            {t('tasks.storageError')}
                        </p>
                    )}
                    <div className="list-label">
                        <span>{t('tasks.name')}</span>
                        <span>{t('tasks.priority')}</span>
                    </div>
                    <div className="task-list">
                        {visible.map((task) => (
                            <div
                                className={`task-row ${task.done ? 'completed' : ''}`}
                                key={task.id}
                            >
                                <input
                                    type="checkbox"
                                    checked={task.done}
                                    onChange={() => toggle(task.id)}
                                    aria-label={t('tasks.doneLabel', { title: task.title })}
                                />
                                <div className="task-copy">
                                    <span>{task.title}</span>
                                    <small>
                                        <i
                                            className={
                                                task.project === t('common.personal')
                                                    ? 'personal-dot'
                                                    : ''
                                            }
                                        />
                                        {task.project}
                                    </small>
                                </div>
                                <span
                                    className={`badge ${task.priority === 'High' ? 'high' : task.priority === 'Medium' ? 'medium' : 'low'}`}
                                >
                                    {task.priority}
                                </span>
                                <button
                                    className="delete-task"
                                    aria-label={t('tasks.deleteLabel', { title: task.title })}
                                    onClick={() => remove(task.id)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    {!visible.length && (
                        <div className="empty">
                            <span>✧</span>
                            <h3>{query ? t('tasks.noResults') : t('tasks.empty')}</h3>
                            <p>{query ? t('tasks.noResultsHint') : t('tasks.emptyHint')}</p>
                        </div>
                    )}
                    <button className="add-row" onClick={() => setCreating(true)}>
                        ＋ {t('common.addTask')}
                    </button>
                    <footer className="list-footer">
                        {visible.length} of {tasks.length} tasks <span>{t('tasks.saved')}</span>
                    </footer>
                </section>
                <aside className="right-column">
                    <section className="focus-card">
                        <span className="eyebrow">{t('tasks.focus')}</span>
                        <div className="focus-art" aria-hidden="true">
                            <div className="orbit orbit-one" />
                            <div className="orbit orbit-two" />
                            <span>✦</span>
                        </div>
                        <h2>
                            {t('tasks.focusTitleFirst')}
                            <br />
                            {t('tasks.focusTitleSecond')}
                        </h2>
                        <p>{t('tasks.focusText')}</p>
                        <button
                            onClick={() => {
                                setFilter(t('tasks.active'));
                                setQuery('');
                            }}
                        >
                            {t('tasks.goToTasks')}
                        </button>
                    </section>
                    <section className="progress-card">
                        <div className="section-heading">
                            <h3>{t('tasks.smallWins')}</h3>
                            <span>✧</span>
                        </div>
                        <p>{t('tasks.smallWinsText')}</p>
                        <div className="progress-caption">
                            <strong>{percent}%</strong>
                            <span>{t('tasks.progress', { done, total: tasks.length })}</span>
                        </div>
                        <progress value={done} max={tasks.length || 1} />
                        <small>
                            {done ? t('tasks.progressStarted') : t('tasks.progressEmpty')}
                        </small>
                    </section>
                </aside>
            </div>
            {creating && <NewTaskDialog add={add} onClose={() => setCreating(false)} />}
        </ScreenLayout>
    );
}
