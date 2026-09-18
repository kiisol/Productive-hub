import type { ReactNode } from 'react';

type PanelHeaderProps = {
    title: ReactNode;
    count?: number;
    meta?: ReactNode;
};

export function PanelHeader({ title, count, meta }: PanelHeaderProps) {
    return (
        <div className="section-heading">
            <h2>
                {title} {count !== undefined && <span>{count}</span>}
            </h2>
            {meta && <span className="muted">{meta}</span>}
        </div>
    );
}
