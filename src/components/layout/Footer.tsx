import { Link } from 'react-router-dom';
import { APP } from '../../constants/links';
import { useUserType } from '../../context/UserTypeContext';
import { BrandMark } from '../common/BrandMark';
import { Container } from './Container';

export function Footer() {
  const { openUserTypeModal } = useUserType();

  return (
    <footer className="border-t border-border bg-white py-14">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 font-semibold text-navy">
              <BrandMark size={30} className="!rounded-md" />
              <span>ACOMI</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              Accommodation + Meals. Operations software for messes, PGs, hostels, co-living, and rentals.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">Product</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/features" className="text-text-secondary transition hover:text-primary">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-text-secondary transition hover:text-primary">
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/who-its-for" className="text-text-secondary transition hover:text-primary">
                  Who it&apos;s for
                </Link>
              </li>
              <li>
                <Link to="/platforms" className="text-text-secondary transition hover:text-primary">
                  Platforms
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-text-secondary transition hover:text-primary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-text-secondary transition hover:text-primary">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">Account</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={openUserTypeModal}
                  className="text-left text-text-secondary transition hover:text-primary"
                >
                  Get started
                </button>
              </li>
              <li>
                <a href={APP.login} className="text-text-secondary transition hover:text-primary">
                  Sign in
                </a>
              </li>
              <li>
                <a href={APP.web} className="text-text-secondary transition hover:text-primary">
                  Open web app
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">Legal</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={APP.privacy} className="text-text-secondary transition hover:text-primary">
                  Privacy
                </a>
              </li>
              <li>
                <a href={APP.deleteAccount} className="text-text-secondary transition hover:text-primary">
                  Delete account
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-xs text-muted">© 2026 ACOMI. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
