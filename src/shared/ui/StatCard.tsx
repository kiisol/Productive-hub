import type { ReactNode } from 'react';

type StatCardProps = {
    icon: ReactNode;
    iconTone: 'purple' | 'amber' | 'green';
    label: ReactNode;
    value: string | number;
    hint: ReactNode;
};

export function StatCard({ icon, iconTone, label, value, hint }: StatCardProps) {
    return (
        <div className="stat">
            <span className={`stat-icon ${iconTone}`}>{icon}</span>
            <div>
                <p>{label}</p>
                <strong>{String(value).padStart(2, '0')}</strong>
            </div>
            <small>{hint}</small>
        </div>
    );
}
