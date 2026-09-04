import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { APP } from '../../constants/links';
import { useUserType } from '../../context/UserTypeContext';
import { BrandMark } from '../common/BrandMark';
import { Container } from './Container';

export function Footer() {
  const { t } = useTranslation();
  const { openUserTypeModal } = useUserType();

  return (
    <footer className="border-t border-border bg-white py-14">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 font-semibold text-navy">
              <BrandMark size={30} className="!rounded-md" />
              <span>{t('brand')}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
              {t('footer.product')}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/features" className="text-text-secondary transition hover:text-primary">
                  {t('nav.features')}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-text-secondary transition hover:text-primary">
                  {t('nav.howItWorks')}
                </Link>
              </li>
              <li>
                <Link to="/who-its-for" className="text-text-secondary transition hover:text-primary">
                  {t('nav.whoItsFor')}
                </Link>
              </li>
              <li>
                <Link to="/platforms" className="text-text-secondary transition hover:text-primary">
                  {t('nav.platforms')}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-text-secondary transition hover:text-primary">
                  {t('nav.pricing')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-text-secondary transition hover:text-primary">
                  {t('nav.about')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
              {t('footer.account')}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={openUserTypeModal}
                  className="text-left text-text-secondary transition hover:text-primary"
                >
                  {t('nav.getStarted')}
                </button>
              </li>
              <li>
                <a href={APP.login} className="text-text-secondary transition hover:text-primary">
                  {t('nav.signIn')}
                </a>
              </li>
              <li>
                <a href={APP.web} className="text-text-secondary transition hover:text-primary">
                  {t('common.openWebApp')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
              {t('footer.legal')}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={APP.privacy} className="text-text-secondary transition hover:text-primary">
                  {t('common.privacy')}
                </a>
              </li>
              <li>
                <a href={APP.deleteAccount} className="text-text-secondary transition hover:text-primary">
                  {t('common.deleteAccount')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-xs text-muted">{t('footer.copyright')}</p>
        </div>
      </Container>
    </footer>
  );
}
