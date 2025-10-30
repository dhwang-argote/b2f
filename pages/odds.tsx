import React from 'react';
import Layout from '@/components/layout/layout';
import OddsPreview from '@/components/odds/odds-preview';

const OddsPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-900">
        {/* Added extra padding-top for mobile to prevent header overlap */}
        <div className="pt-2 sm:pt-4 pb-10 px-3 sm:px-6">
          <header>
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-4 sm:mb-6 md:mb-8">Live Betting Odds</h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 text-center max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-12">
                Get real-time NBA betting odds from top sportsbooks. Check the latest moneyline, point spread, and totals for upcoming games.
              </p>
            </div>
          </header>
          <main>
            <OddsPreview />
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default OddsPage;