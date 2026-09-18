import type { ReactNode } from 'react';

type ScreenLayoutProps = {
    breadcrumb: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
};

export function ScreenLayout({ breadcrumb, children, footer }: ScreenLayoutProps) {
    return (
        <div className="screen-layout">
            <div className="breadcrumb">{breadcrumb}</div>
            {children}
            {footer && <p className="page-note">{footer}</p>}
        </div>
    );
}

type ScreenHeaderProps = {
    eyebrow?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
};

export function ScreenHeader({ eyebrow, title, description, action }: ScreenHeaderProps) {
    return (
        <header className="page-heading">
            <div>
                {eyebrow && <div className="eyebrow">{eyebrow}</div>}
                <h1>{title}</h1>
                {description && <p>{description}</p>}
            </div>
            {action}
        </header>
    );
}
