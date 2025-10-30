import React from "react";
import { useLocation } from "wouter";
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

const EducationalCenter = () => {
  const [, navigate] = useLocation();

  // Helpers to navigate and ensure target page is scrolled to top
  const gotoPlans = () => {
    navigate('/#plans');
    // allow route change then scroll
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const gotoCommunityForum = () => {
    navigate('/community-forum');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };
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
  ];

  const categories = [
    { label: "Strategy", count: 15 },
    { label: "Risk Management", count: 12 },
    { label: "Analysis", count: 18 },
    { label: "Psychology", count: 7 },
    { label: "Advanced", count: 9 },
    { label: "Beginner", count: 14 },
  ];

  // Removed duplicate useLocation destructuring
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
            Educational Center
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Enhance your sports picking knowledge with actionable guides,
            data-driven analysis, and step-by-step resources to help you
            confidently take funded challenges.
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

              <h2 className="text-xl font-bold mt-8 mb-6 text-white">
                Resource Types
              </h2>
              <ul className="space-y-3">
                <li className="text-white/80 hover:text-primary cursor-pointer transition-colors">
                  Sports Picking Guides
                </li>
                <li className="text-white/80 hover:text-primary cursor-pointer transition-colors">
                  Sports Analysis
                </li>
                <li className="text-white/80 hover:text-primary cursor-pointer transition-colors">
                  Case Studies
                </li>
                <li className="text-white/80 hover:text-primary cursor-pointer transition-colors">
                  Webinars
                </li>
                <li className="text-white/80 hover:text-primary cursor-pointer transition-colors">
                  E-Books
                </li>
                <li>
                  <button onClick={gotoCommunityForum} className="text-white/80 hover:text-primary transition-colors">
                    Community Forum
                  </button>
                </li>
              </ul>

              {/* Ready to start your challenge? CTA placed in left panel */}
              <div className="mt-8 bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Ready to start your challenge?</h3>
                <p className="text-white/70 text-sm mb-4">Apply your learning in a real evaluation and trade with funded capital.</p>
                <button onClick={gotoPlans} className="inline-block bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md">
                  View Plans
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 * article.id }}
                >
                  <Card className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 overflow-hidden h-full flex flex-col">
                    <div className="h-48 bg-gray-800 relative">
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-primary/80 text-white text-xs px-2 py-1 rounded-md">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-white">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-white/60">
                        {article.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-white/80 flex-grow">
                      <p>{article.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Link href={article.url}>
                        <Button
                          variant="outline"
                          className="border-primary/60 bg-transparent text-white hover:bg-primary/10 w-full"
                        >
                          Read Full Article
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Button
                variant="outline"
                className="border-primary/60 bg-transparent text-white hover:bg-primary/10"
                onClick={() => navigate("/trading-guides")}
              >
                Load More Articles
              </Button>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            Ready to Put Your Knowledge Into Practice?
          </h2>
          <p className="text-white/80 mb-6 max-w-3xl mx-auto">
            Apply what you've learned by taking on a funded picker challenge — place
            picks with our capital, keep up to 80% of your profits, and receive
            payouts processed bi-weekly.
          </p>
          <Link href="/#plans">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg shadow-[0_0_15px_rgba(0,178,255,0.5)]">
              View Funding Plans
            </Button>
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
};

export default EducationalCenter;
