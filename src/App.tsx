import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AboutPage } from './pages/AboutPage';
import { RegisterMessPage } from './pages/ComingSoonPages';
import { MealsPage } from './pages/MealsPage';
import { MessDetailPage } from './pages/MessDetailPage';
import { PlacesPage } from './pages/PlacesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HomePage } from './pages/HomePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PlatformsPage } from './pages/PlatformsPage';
import { PricingPage } from './pages/PricingPage';
import { MessVendorsPage } from './pages/MessVendorsPage';
import { PropertyOwnersPage } from './pages/PropertyOwnersPage';
import { RegisterSpacePage } from './pages/RegisterSpacePage';
import { WhoItsForPage } from './pages/WhoItsForPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/who-its-for" element={<WhoItsForPage />} />
          <Route path="/platforms" element={<PlatformsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/property-owners" element={<PropertyOwnersPage />} />
          <Route path="/mess-vendors" element={<MessVendorsPage />} />
          <Route path="/register-space" element={<RegisterSpacePage />} />
          <Route path="/register-mess" element={<RegisterMessPage />} />
          <Route path="/places" element={<PlacesPage />} />
          <Route path="/places/:id" element={<PropertyDetailPage />} />
          <Route path="/meals" element={<MealsPage />} />
          <Route path="/meals/:id" element={<MessDetailPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
