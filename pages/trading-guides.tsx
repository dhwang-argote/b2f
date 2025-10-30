import React from "react";
import Layout from "@/components/layout/layout";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const TradingGuides = () => {
  const articles = [
    {
      id: 1,
      title: "Understanding Value Betting",
      description: "Learn how to identify value in sports picking markets",
      category: "Strategy",
      date: "May 15, 2025",
      imagePath: "/src/assets/value-betting.jpg",
      url: "/trading-guides/value-betting",
    },
    {
      id: 2,
      title: "Bankroll Management Fundamentals",
      description:
        "Master the principles of proper bankroll management for long-term success",
      category: "Risk Management",
      date: "May 10, 2025",
      imagePath: "/src/assets/bankroll-management.jpg",
      url: "/trading-guides/bankroll-management",
    },
    {
      id: 3,
      title: "Statistical Analysis in NBA Betting",
      description:
        "How to use advanced statistics to gain an edge in NBA betting markets",
      category: "Analysis",
      date: "May 5, 2025",
      imagePath: "/src/assets/nba-stats.jpg",
      url: "/trading-guides/nba-statistics",
    },
    {
      id: 4,
      title: "Exploiting Line Movements",
      description: "Strategies for capitalizing on betting line movements",
      category: "Strategy",
      date: "April 28, 2025",
      imagePath: "/src/assets/line-movements.jpg",
      url: "/trading-guides/line-movements",
    },
    {
      id: 5,
      title: "The Psychology of Sports Trading",
      description: "Understanding the mental aspects of successful trading",
      category: "Psychology",
      date: "April 20, 2025",
      imagePath: "/src/assets/trading-psychology.jpg",
      url: "/trading-guides/trading-psychology",
    },
    {
      id: 6,
      title: "Building a Sports Picking Model",
      description:
        "Step-by-step guide to creating your own sports picking prediction model",
      category: "Advanced",
      date: "April 15, 2025",
      imagePath: "/src/assets/betting-model.jpg",
      url: "/trading-guides/betting-model",
    },
    {
      id: 7,
      title: "Understanding Implied Probability",
      description:
        "How to convert odds to probabilities and use them to find value",
      category: "Strategy",
      date: "April 10, 2025",
      imagePath: "/src/assets/implied-probability.jpg",
      url: "/trading-guides/implied-probability",
    },
    {
      id: 8,
      title: "Advanced Soccer Betting Markets",
      description:
        "A deep dive into specialized soccer betting markets like Asian handicaps and totals",
      category: "Analysis",
      date: "April 5, 2025",
      imagePath: "/src/assets/soccer-markets.jpg",
      url: "/trading-guides/soccer-markets",
    },
    {
      id: 9,
      title: "Handling Winning and Losing Streaks",
      description:
        "Psychological strategies for maintaining discipline during hot and cold runs",
      category: "Psychology",
      date: "March 28, 2025",
      imagePath: "/src/assets/streaks.jpg",
      url: "/trading-guides/streaks",
    },
    {
      id: 10,
      title: "Sports Picking Arbitrage Explained",
      description:
        "How to guarantee profits by betting on all possible outcomes at favorable odds",
      category: "Advanced",
      date: "March 20, 2025",
      imagePath: "/src/assets/arbitrage.jpg",
      url: "/trading-guides/arbitrage",
    },
    {
      id: 11,
      title: "Using Weather Data in NFL Betting",
      description:
        "How weather conditions impact game totals and how to profit from this knowledge",
      category: "Analysis",
      date: "March 15, 2025",
      imagePath: "/src/assets/weather-nfl.jpg",
      url: "/trading-guides/weather-nfl",
    },
    {
      id: 12,
      title: "Record-Keeping for Sports Traders",
      description:
        "Essential metrics to track and analyze for continuous improvement",
      category: "Beginner",
      date: "March 10, 2025",
      imagePath: "/src/assets/record-keeping.jpg",
      url: "/trading-guides/record-keeping",
    },
  ];

  const categories = [
    { label: "All Guides", count: articles.length },
    {
      label: "Strategy",
      count: articles.filter((a) => a.category === "Strategy").length,
    },
    {
      label: "Risk Management",
      count: articles.filter((a) => a.category === "Risk Management").length,
    },
    {
      label: "Analysis",
      count: articles.filter((a) => a.category === "Analysis").length,
    },
    {
      label: "Psychology",
      count: articles.filter((a) => a.category === "Psychology").length,
    },
    {
      label: "Advanced",
      count: articles.filter((a) => a.category === "Advanced").length,
    },
    {
      label: "Beginner",
      count: articles.filter((a) => a.category === "Beginner").length,
    },
  ];

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
            Sports Picking Guides
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Comprehensive resources to help you build and refine your sports
            trading strategies
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="md:col-span-1">
            <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-white">Categories</h2>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li
                    key={category.label}
                    className="flex justify-between items-center"
                  >
                    <span className="text-white/80 hover:text-primary cursor-pointer transition-colors">
                      {category.label}
                    </span>
                    <span className="text-white/50 text-sm bg-primary/10 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-4 bg-primary/10 rounded-lg">
                <h3 className="font-medium mb-2 text-white">
                  Ready to start trading?
                </h3>
                <p className="text-sm text-white/70 mb-3">
                  Put these strategies into practice with a funded account.
                </p>
                <Link href="/#plans">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    View Funding Plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 * (article.id % 6) }}
                >
                  <Card className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 overflow-hidden h-full flex flex-col">
                    <div className="h-36 bg-gray-800 relative">
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-primary/80 text-white text-xs px-2 py-1 rounded-md">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-base md:text-lg">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-white/60 text-xs">
                        {article.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-white/80 text-sm flex-grow pb-2">
                      <p>{article.description}</p>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Link href={article.url}>
                        <Button
                          variant="outline"
                          className="border-primary/60 bg-transparent text-white hover:bg-primary/10 w-full text-sm"
                        >
                          Read Full Article
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TradingGuides;
