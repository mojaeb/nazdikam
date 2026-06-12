import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { CityProvider } from "@/lib/city-context";
import Home from "./pages/Home";
import DesignSystem from "./pages/DesignSystem";
import SearchPage from "./pages/SearchPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryDetailPage from "./pages/CategoryDetailPage";
import DesktopHomePage from "./pages/DesktopHomePage";
import DashboardPage from "./pages/DashboardPage";
import BusinessProfilePage from "./pages/BusinessProfilePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import MapPage from "./pages/MapPage";
import AccountPage from "./pages/AccountPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import HelpPage from "./pages/HelpPage";
import TermsPage from "./pages/TermsPage";
import LoginPage from "./pages/LoginPage";
import CreateBusinessPage from "./pages/CreateBusinessPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";

function SmartHome() {
  if (typeof window !== "undefined" && window.innerWidth >= 1024) {
    return <DesktopHomePage />;
  }
  return <Home />;
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-page-bg">
      <div className="text-center">
        <p className="text-display font-iran-yekan-x text-neutral-800">۴۰۴</p>
        <p className="text-body text-neutral-500 mt-2 font-vazirmatn">صفحه یافت نشد</p>
      </div>
    </div>
  );
}

/* Redirect /dashboard/* → /business/* */
function RedirectToBusiness() {
  const [location, navigate] = useLocation();
  useEffect(() => {
    const newPath = location.replace(/^\/dashboard/, "/business");
    navigate(newPath, { replace: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={SmartHome} />
      <Route path="/search" component={SearchPage} />
      <Route path="/categories">
        {() => <CategoriesPage />}
      </Route>
      <Route path="/categories/:slug">
        {(params) => <CategoryDetailPage slug={params?.slug ?? ""} />}
      </Route>
      <Route path="/services/:slug">
        {(params) => <ServiceDetailPage slug={params?.slug ?? ""} />}
      </Route>
      <Route path="/businesses/:slug">
        {(params) => <BusinessProfilePage slug={params?.slug ?? ""} />}
      </Route>
      <Route path="/products/:slug">
        {(params) => <ProductDetailPage slug={params?.slug ?? ""} />}
      </Route>
      <Route path="/map" component={MapPage} />
      <Route path="/account" component={AccountPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/help" component={HelpPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/desktop" component={DesktopHomePage} />

      {/* Business owner dashboard */}
      <Route path="/business" component={DashboardPage} />
      <Route path="/business/*" component={DashboardPage} />

      {/* Auth */}
      <Route path="/auth/login" component={LoginPage} />

      {/* Account actions */}
      <Route path="/account/create-business" component={CreateBusinessPage} />

      {/* Legacy redirect */}
      <Route path="/dashboard" component={RedirectToBusiness} />
      <Route path="/dashboard/*" component={RedirectToBusiness} />

      <Route path="/design" component={DesignSystem} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <AuthProvider>
        <CityProvider>
          <Router />
        </CityProvider>
      </AuthProvider>
    </WouterRouter>
  );
}
