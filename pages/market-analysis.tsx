import React from "react";
import Layout from "@/components/layout/layout";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

const MarketAnalysis = () => {
  const analysisArticles = {
    nba: [
      {
        id: 1,
        title: "NBA Eastern Conference Playoff Outlook",
        description:
          "Analysis of key matchups and value betting opportunities in the Eastern Conference playoff race.",
        date: "May 18, 2025",
        author: "Michael Johnson",
        authorRole: "Senior NBA Analyst",
        readTime: "12 min read",
      },
      {
        id: 2,
        title: "Point Spread Trends in Oklahoma City Games",
        description:
          "Breaking down ATS (Against The Spread) trends for the Thunder this season and identifying profitable betting angles.",
        date: "May 16, 2025",
        author: "Sarah Williams",
        authorRole: "Data Scientist",
        readTime: "15 min read",
      },
      {
        id: 3,
        title: "Impact of Injuries on Western Conference Totals",
        description:
          "How key player injuries have affected Over/Under outcomes in Western Conference games.",
        date: "May 14, 2025",
        author: "James Rodriguez",
        authorRole: "Basketball Trading Expert",
        readTime: "10 min read",
      },
    ],
    mlb: [
      {
        id: 4,
        title: "MLB Pitching Matchup Analysis: Week of May 19",
        description:
          "Detailed breakdown of upcoming pitching matchups and their betting implications.",
        date: "May 19, 2025",
        author: "David Martinez",
        authorRole: "MLB Specialist",
        readTime: "14 min read",
      },
      {
        id: 5,
        title: "Weather Effects on MLB Totals: Early Season Trends",
        description:
          "How temperature, wind, and humidity have influenced run totals in the early part of the MLB season.",
        date: "May 17, 2025",
        author: "Emily Chen",
        authorRole: "Sports Meteorologist",
        readTime: "11 min read",
      },
      {
        id: 6,
        title: "Value in MLB Underdogs: Statistical Analysis",
        description:
          "Statistical evidence showing profitable situations for backing MLB underdogs this season.",
        date: "May 15, 2025",
        author: "Robert Thompson",
        authorRole: "Statistical Analyst",
        readTime: "13 min read",
      },
    ],
    trending: [
      {
        id: 7,
        title: "Market Overreactions: Finding Value in Public Perception",
        description:
          "How to identify and capitalize on market overreactions to recent game results.",
        date: "May 19, 2025",
        author: "Jennifer Lewis",
        authorRole: "Professional Sports Trader",
        readTime: "8 min read",
      },
      {
        id: 8,
        title: "Line Movement Analysis: What It Tells Us About Sharp Money",
        description:
          "Understanding how to interpret line movements and what they reveal about professional betting action.",
        date: "May 18, 2025",
        author: "Marcus Bell",
        authorRole: "Odds Specialist",
        readTime: "16 min read",
      },
      {
        id: 9,
        title: "Live Betting Opportunities in Close Games",
        description:
          "Strategies for identifying value in live betting markets during competitive games.",
        date: "May 17, 2025",
        author: "Sophia Grant",
        authorRole: "In-Play Trading Expert",
        readTime: "9 min read",
      },
    ],
  };

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Sports Analysis
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Expert insights and data-driven analysis to help inform your trading
            decisions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-3">
            <Tabs defaultValue="trending" className="w-full mb-8">
              <TabsList className="grid grid-cols-3 w-full md:w-1/2">
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="nba">NBA</TabsTrigger>
                <TabsTrigger value="mlb">MLB</TabsTrigger>
              </TabsList>

              <TabsContent value="trending" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {analysisArticles.trending.map((article, index) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="nba" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {analysisArticles.nba.map((article, index) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="mlb" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {analysisArticles.mlb.map((article, index) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-white">
                Featured Analysis
              </h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 mb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="md:col-span-2 aspect-video bg-gray-800 rounded-lg"></div>
                  <div className="md:col-span-3">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        Premium
                      </span>
                      <span className="text-white/50 text-xs">
                        May 19, 2025
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">
                      Comprehensive NBA Playoff Betting Guide: Stats, Trends,
                      and Predictions
                    </h3>
                    <p className="text-white/80 mb-4">
                      A deep dive into statistical models, historical trends,
                      and key factors that influence NBA playoff betting
                      markets. This analysis combines advanced metrics with
                      expert insights to identify high-value betting
                      opportunities.
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 rounded-full bg-primary/20"></div>
                      <div>
                        <p className="text-white font-medium">
                          Dr. Jason Reynolds
                        </p>
                        <p className="text-white/50 text-sm">
                          Sports Analytics Director
                        </p>
                      </div>
                    </div>
                    <Link href="/register">
                      <Button className="bg-primary hover:bg-primary/90 text-white">
                        Read Full Analysis
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-green-900/40 text-green-400 px-2 py-1 rounded">
                        Free
                      </span>
                      <span className="text-white/50 text-xs">
                        May 18, 2025
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">
                      MLB Home Underdogs: Finding Value in the Lines
                    </h3>
                    <p className="text-white/80 mb-4">
                      An examination of situations where home underdogs provide
                      statistical betting value in MLB. Including key
                      statistics, optimal conditions, and specific teams to
                      target.
                    </p>
                    <Link href="#">
                      <Button
                        variant="outline"
                        className="border-primary/60 text-white hover:bg-primary/10"
                      >
                        Read Analysis
                      </Button>
                    </Link>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-green-900/40 text-green-400 px-2 py-1 rounded">
                        Free
                      </span>
                      <span className="text-white/50 text-xs">
                        May 17, 2025
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">
                      The Impact of Rest Days on NBA Team Performance
                    </h3>
                    <p className="text-white/80 mb-4">
                      How different rest schedules affect team performance and
                      betting outcomes in the NBA. Includes analysis of
                      back-to-back games, extended rest, and travel factors.
                    </p>
                    <Link href="#">
                      <Button
                        variant="outline"
                        className="border-primary/60 text-white hover:bg-primary/10"
                      >
                        Read Analysis
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-white">
                Sports Insights
              </h2>

              <div className="space-y-6">
                <div className="border-b border-primary/10 pb-4">
                  <h3 className="font-medium text-white mb-2">
                    Betting Trends
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-white/80 text-sm">
                      NBA favorites covering at 53.2% this week
                    </li>
                    <li className="text-white/80 text-sm">
                      MLB totals going under in 58.7% of night games
                    </li>
                    <li className="text-white/80 text-sm">
                      Road underdogs winning outright in 31.5% of games
                    </li>
                  </ul>
                </div>

                <div className="border-b border-primary/10 pb-4">
                  <h3 className="font-medium text-white mb-2">
                    Line Movements
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-white/80 text-sm">
                      Significant money on Lakers vs Celtics under
                    </li>
                    <li className="text-white/80 text-sm">
                      Sharp action driving Cubs line from +130 to +110
                    </li>
                    <li className="text-white/80 text-sm">
                      Public heavily backing Warriors -6.5
                    </li>
                  </ul>
                </div>

                <div className="border-b border-primary/10 pb-4">
                  <h3 className="font-medium text-white mb-2">Key Injuries</h3>
                  <ul className="space-y-2">
                    <li className="text-white/80 text-sm">
                      J. Tatum (BOS) - Questionable for Game 3
                    </li>
                    <li className="text-white/80 text-sm">
                      A. Judge (NYY) - Out for series vs. Red Sox
                    </li>
                    <li className="text-white/80 text-sm">
                      L. Doncic (DAL) - Probable despite ankle issue
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-white mb-2">
                    Weather Impact (MLB)
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-white/80 text-sm">
                      Wind blowing out at Wrigley Field (15+ mph)
                    </li>
                    <li className="text-white/80 text-sm">
                      Rain expected in Boston (60% delay risk)
                    </li>
                    <li className="text-white/80 text-sm">
                      High humidity in Atlanta affecting ball flight
                    </li>
                  </ul>
                </div>

                <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/30">
                  <h3 className="text-sm font-semibold text-primary">
                    Premium Analysis
                  </h3>
                  <p className="text-white/70 text-sm mt-2 mb-4">
                    Get access to our full suite of professional sports
                    analysis, including proprietary models and expert
                    predictions.
                  </p>
                  <Link href="/register">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                      Upgrade Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface ArticleProps {
  article: {
    id: number;
    title: string;
    description: string;
    date: string;
    author: string;
    authorRole: string;
    readTime: string;
  };
  delay: number;
}

const ArticleCard: React.FC<ArticleProps> = ({ article, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/50 text-xs">{article.date}</span>
            <span className="text-white/50 text-xs">{article.readTime}</span>
          </div>
          <CardTitle className="text-white text-lg">{article.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-white/80 flex-grow">
          <p>{article.description}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-start pt-0">
          <div className="flex items-center gap-3 mb-4 w-full">
            <div className="h-8 w-8 rounded-full bg-primary/20"></div>
            <div>
              <p className="text-white text-sm font-medium">{article.author}</p>
              <p className="text-white/50 text-xs">{article.authorRole}</p>
            </div>
          </div>
          <Link href="#" className="w-full">
            <Button
              variant="outline"
              className="border-primary/60 text-white hover:bg-primary/10 w-full"
            >
              Read Analysis
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MarketAnalysis;
