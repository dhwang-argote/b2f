import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import OddsPage from "@/pages/odds";
import HowItWorks from "./pages/how-it-works";
import Plans from "./pages/plans";
import FAQ from "./pages/faq";
import Rules from "./pages/rules";
import EducationalCenter from "./pages/educational-center";
import TradingGuides from "./pages/trading-guides";
import MarketAnalysis from "./pages/market-analysis";
import CommunityForum from "./pages/community-forum";
import TermsOfService from "./pages/legal/terms-of-service";
import PrivacyPolicy from "./pages/legal/privacy-policy";
import RiskDisclosure from "./pages/legal/risk-disclosure";
import Disclaimer from "./pages/disclaimer";
import FundedAccountPage from "./pages/funded-account";
import LeaderboardPage from "./pages/leaderboard";
import ProfilePage from "./pages/profile";
import NotFound from "@/pages/not-found";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UsersManagement from "@/pages/admin/UsersManagement";
import Challenges from "@/pages/admin/Challenges";
import Transactions from "@/pages/admin/Transactions";

// ✅ Import your Chatbot
import Chatbot from "./components/ui/chatbot";

import ScrollToTop from "@/components/ScrollToTop.tsx";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/users" component={UsersManagement} />
      <Route path="/admin/challenges" component={Challenges} />
      <Route path="/admin/transactions" component={Transactions} />
      <Route path="/funded-account" component={FundedAccountPage} />
      <Route path="/leaderboard" component={LeaderboardPage} />
      <Route path="/odds" component={OddsPage} />
      <Route path="/profile" component={ProfilePage} />

      {/* Information Pages */}
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/plans" component={Plans} />
      <Route path="/faq" component={FAQ} />
      <Route path="/rules" component={Rules} />

      {/* Educational Resources */}
      <Route path="/educational-center" component={EducationalCenter} />
      <Route path="/trading-guides" component={TradingGuides} />
      <Route path="/market-analysis" component={MarketAnalysis} />
      <Route path="/community-forum" component={CommunityForum} />

      {/* Legal Pages */}
      <Route path="/legal/terms-of-service" component={TermsOfService} />
      <Route path="/legal/privacy-policy" component={PrivacyPolicy} />
      <Route path="/legal/risk-disclosure" component={RiskDisclosure} />
      <Route path="/disclaimer" component={Disclaimer} />
      <Route path="/risk-disclosure" component={RiskDisclosure} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ScrollToTop />
        <Router />

        {/* ✅ Add Chatbot here so it appears globally */}
        <Chatbot />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
