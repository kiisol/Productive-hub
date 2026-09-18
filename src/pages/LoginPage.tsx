import LoginForm from '@features/auth/LoginForm';
import { t } from '@shared/i18n';
export default function LoginPage() {
    return (
        <main className="login-page">
            <section className="login-story">
                <div className="brand">
                    <span className="brand-mark">
                        p<span>•</span>
                    </span>
                    productive.
                </div>
                <div>
                    <div className="eyebrow">{t('login.eyebrow')}</div>
                    <h1>
                        {t('login.titleFirst')}
                        <br />
                        {t('login.titleSecond')}
                    </h1>
                    <p>
                        {t('login.descriptionFirst')}
                        <br />
                        {t('login.descriptionSecond')}
                    </p>
                    <div className="login-art" aria-hidden="true">
                        ✳
                    </div>
                </div>
                <small>{t('login.footer')}</small>
            </section>
            <section className="login-form-panel">
                <div>
                    <span className="eyebrow">{t('login.formEyebrow')}</span>
                    <h2>{t('login.heading')}</h2>
                    <p>{t('login.subtitle')}</p>
                    <LoginForm />
                </div>
            </section>
        </main>
    );
}
