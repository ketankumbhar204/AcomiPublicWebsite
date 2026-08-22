import { Link } from 'react-router-dom';
import { APP } from '../../constants/links';
import { BrandMark } from '../common/BrandMark';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-white py-14">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 font-semibold text-text">
              <BrandMark size={36} />
              <span>ACOMI</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              Operations for PGs, hostels, co-living, rentals, and messes.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Product</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/features" className="text-text-secondary transition hover:text-primary-dark">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-text-secondary transition hover:text-primary-dark">
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/who-its-for" className="text-text-secondary transition hover:text-primary-dark">
                  Who it&apos;s for
                </Link>
              </li>
              <li>
                <Link to="/platforms" className="text-text-secondary transition hover:text-primary-dark">
                  Platforms
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-text-secondary transition hover:text-primary-dark">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Account</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={APP.register} className="text-text-secondary transition hover:text-primary-dark">
                  Get started
                </a>
              </li>
              <li>
                <a href={APP.login} className="text-text-secondary transition hover:text-primary-dark">
                  Sign in
                </a>
              </li>
            </ul>
          </div>

          {/* Contact column: add when a real public email exists. */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Legal</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={APP.privacy} className="text-text-secondary transition hover:text-primary-dark">
                  Privacy
                </a>
              </li>
              <li>
                <a href={APP.deleteAccount} className="text-text-secondary transition hover:text-primary-dark">
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
