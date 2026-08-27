import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ListingDrawerProvider } from '../../context/ListingDrawerContext';
import { ListingPreviewProvider } from '../../context/ListingPreviewContext';
import { UserTypeProvider } from '../../context/UserTypeContext';
import { PersistentListingActions } from '../common/PersistentListingActions';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { SkipLink } from './SkipLink';

function RouteScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export function Layout() {
  return (
    <UserTypeProvider>
      <ListingDrawerProvider>
        <ListingPreviewProvider>
          <div className="min-h-dvh bg-background text-text antialiased">
            <SkipLink />
            <Navbar />
            <PersistentListingActions />
            <RouteScroll />
            <main id="main" className="pt-16">
              <Outlet />
            </main>
            <Footer />
          </div>
        </ListingPreviewProvider>
      </ListingDrawerProvider>
    </UserTypeProvider>
  );
}
