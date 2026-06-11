import { Switch, Route, Router as WouterRouter } from "wouter";
import Home from "./pages/Home";
import DesignSystem from "./pages/DesignSystem";
import SearchPage from "./pages/SearchPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryDetailPage from "./pages/CategoryDetailPage";
import DesktopHomePage from "./pages/DesktopHomePage";

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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={SearchPage} />
      <Route path="/categories">
        {() => <CategoriesPage />}
      </Route>
      <Route path="/categories/:slug">
        {(params) => <CategoryDetailPage slug={params?.slug ?? ""} />}
      </Route>
      <Route path="/desktop" component={DesktopHomePage} />
      <Route path="/design" component={DesignSystem} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}
