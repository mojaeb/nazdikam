import { Switch, Route, Router as WouterRouter } from "wouter";
import DesignSystem from "./pages/DesignSystem";

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
      <Route path="/" component={DesignSystem} />
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
