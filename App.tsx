import { Switch, Route } from "wouter"
import { queryClient } from "./lib/queryClient"
import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"

// Pages
import Home from "@/pages/home.tsx"
import OddsPage from "@/pages/odds.tsx"
import HowItWorks from "@/pages/how-it-works.tsx"
import Plans from "@/pages/plans.tsx"
import FAQ from "@/pages/faq.tsx"
import Rules from "@/pages/rules.tsx"
import EducationalCenter from "@/pages/educational-center.tsx"
import TradingGuides from "@/pages/trading-guides.tsx"
import MarketAnalysis from "@/pages/market-analysis.tsx"
import CommunityForum from "@/pages/community-forum.tsx"
import TermsOfService from "@/pages/legal/terms-of-service.tsx"
import PrivacyPolicy from "@/pages/legal/privacy-policy.tsx"
import RiskDisclosure from "@/pages/legal/risk-disclosure.tsx"
import Disclaimer from "@/pages/disclaimer.tsx"
import LeaderboardPage from "@/pages/leaderboard.tsx"
import NotFound from "@/pages/not-found.tsx"

// ✅ Import your Chatbot
import Chatbot from "@/components/ui/chatbot"

import ScrollToTop from "@/components/ScrollToTop.tsx"

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/leaderboard" component={LeaderboardPage} />
      <Route path="/odds" component={OddsPage} />

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
  )
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
  )
}

export default App
