import React from "react";
import Layout from "@/components/layout/layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import {
  MessageCircle,
  Users,
  TrendingUp,
  Award,
  Search,
  BookOpen,
  Filter,
} from "lucide-react";

const CommunityForum = () => {
  // Sample forum topics
  const featuredTopics = [
    {
      id: 1,
      title: "NBA Playoff Betting Strategy Discussion",
      author: "MichaelJ",
      authorBadge: "Pro Trader",
      replies: 32,
      views: 458,
      lastActivity: "10 minutes ago",
      tags: ["NBA", "Playoffs", "Strategy"],
    },
    {
      id: 2,
      title: "Advanced MLB Prop Betting Analysis",
      author: "SarahT",
      authorBadge: "Veteran",
      replies: 24,
      views: 367,
      lastActivity: "1 hour ago",
      tags: ["MLB", "Props", "Statistics"],
    },
    {
      id: 3,
      title: "Bankroll Management for Long-Term Success",
      author: "TradingPro21",
      authorBadge: "Expert",
      replies: 56,
      views: 789,
      lastActivity: "3 hours ago",
      tags: ["Bankroll", "Strategy", "Risk Management"],
    },
    {
      id: 4,
      title: "My Journey to a Funded Account: Tips and Lessons",
      author: "NewTrader99",
      authorBadge: "Funded Trader",
      replies: 47,
      views: 623,
      lastActivity: "5 hours ago",
      tags: ["Success Story", "Challenge", "Tips"],
    },
    {
      id: 5,
      title: "Understanding Key Numbers in NFL Betting",
      author: "FootballExpert",
      authorBadge: "NFL Specialist",
      replies: 29,
      views: 412,
      lastActivity: "12 hours ago",
      tags: ["NFL", "Strategy", "Point Spreads"],
    },
  ];

  const recentTopics = [
    {
      id: 6,
      title: "Anyone trading the Lakers game tonight?",
      author: "LACaptain",
      authorBadge: "",
      replies: 7,
      views: 89,
      lastActivity: "5 minutes ago",
      tags: ["NBA", "Live Trading"],
    },
    {
      id: 7,
      title: "Help with challenge rules clarification",
      author: "NewMember23",
      authorBadge: "",
      replies: 3,
      views: 45,
      lastActivity: "15 minutes ago",
      tags: ["Challenge", "Rules", "Question"],
    },
    {
      id: 8,
      title: "Just got funded! $50K account approved",
      author: "HappyTrader",
      authorBadge: "New Funded",
      replies: 12,
      views: 143,
      lastActivity: "30 minutes ago",
      tags: ["Success Story", "Funded Account"],
    },
    {
      id: 9,
      title: "Best sportsbooks for line shopping?",
      author: "ValueHunter",
      authorBadge: "",
      replies: 8,
      views: 76,
      lastActivity: "45 minutes ago",
      tags: ["Sportsbooks", "Lines", "Strategy"],
    },
    {
      id: 10,
      title: "Check out my MLB season performance tracker (spreadsheet)",
      author: "BaseballGuru",
      authorBadge: "Contributor",
      replies: 5,
      views: 62,
      lastActivity: "55 minutes ago",
      tags: ["MLB", "Analysis", "Tool"],
    },
  ];

  // Sample community members
  const communityMembers = [
    { name: "TradingPro21", badge: "Expert", funded: true, posts: 287 },
    { name: "SportsBettorPro", badge: "Veteran", funded: true, posts: 143 },
    { name: "MLBAnalyst", badge: "MLB Specialist", funded: true, posts: 98 },
    { name: "ValueHunter", badge: "", funded: false, posts: 76 },
    { name: "NBAFanatic", badge: "NBA Specialist", funded: true, posts: 112 },
  ];

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Community Forum
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Connect with fellow sports strategists, share insights, and learn
            from our sports community
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="w-full md:w-2/3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-white">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span className="font-medium">Latest Discussions</span>
              </div>

              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
                  <Input
                    type="search"
                    placeholder="Search discussions..."
                    className="pl-9 bg-[#121212]/70 border-primary/20 text-white"
                  />
                </div>

                <Button className="bg-primary hover:bg-primary/90 text-white">
                  New Topic
                </Button>
              </div>
            </div>

            <Tabs defaultValue="featured" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>

              <TabsContent value="featured" className="mt-0">
                <ForumTopics topics={featuredTopics} />
              </TabsContent>

              <TabsContent value="recent" className="mt-0">
                <ForumTopics topics={recentTopics} />
              </TabsContent>
            </Tabs>

            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                className="border-primary/20 text-white hover:bg-primary/10"
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-white/50 text-sm">Page 1 of 12</span>
              </div>
              <Button
                variant="outline"
                className="border-primary/20 text-white hover:bg-primary/10"
              >
                Next
              </Button>
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-white">
                  Active Members
                </h3>
              </div>

              <div className="space-y-4">
                {communityMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-medium">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium">
                            {member.name}
                          </p>
                          {member.funded && (
                            <span className="text-xs bg-green-900/40 text-green-400 px-1.5 py-0.5 rounded">
                              Funded
                            </span>
                          )}
                        </div>
                        {member.badge && (
                          <p className="text-white/50 text-xs">
                            {member.badge}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-white/50 text-xs">
                      {member.posts} posts
                    </span>
                  </div>
                ))}
              </div>

              <Link href="/register">
                <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white">
                  Join Community
                </Button>
              </Link>
            </div>

            <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-white">
                  Trending Tags
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  NBA (78)
                </span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  MLB (65)
                </span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  Strategy (54)
                </span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  Bankroll (43)
                </span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  Challenge (39)
                </span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  Success Story (34)
                </span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  NFL (28)
                </span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  Live Trading (26)
                </span>
              </div>
            </div>

            <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-white">
                  Forum Leaderboard
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-primary/10">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-yellow-500">
                      1
                    </span>
                    <span className="text-white">TradingPro21</span>
                  </div>
                  <span className="text-primary text-sm">287 posts</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-primary/10">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-400">
                      2
                    </span>
                    <span className="text-white">SportsBettorPro</span>
                  </div>
                  <span className="text-primary text-sm">143 posts</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-primary/10">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-amber-700">
                      3
                    </span>
                    <span className="text-white">NBAFanatic</span>
                  </div>
                  <span className="text-primary text-sm">112 posts</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-white/50">
                      4
                    </span>
                    <span className="text-white">MLBAnalyst</span>
                  </div>
                  <span className="text-primary text-sm">98 posts</span>
                </div>
              </div>
            </div>

            <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-white">
                  Forum Guidelines
                </h3>
              </div>

              <ul className="space-y-2 text-white/80 text-sm">
                <li>• Be respectful to all community members</li>
                <li>• No spam or promotional content without permission</li>
                <li>• Keep discussions relevant to sports trading</li>
                <li>• No sharing of personal information</li>
                <li>• Respect others' trading strategies and opinions</li>
              </ul>

              <Link href="#">
                <Button variant="link" className="text-primary p-0 h-auto mt-2">
                  Read Full Guidelines
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface ForumTopicsProps {
  topics: {
    id: number;
    title: string;
    author: string;
    authorBadge: string;
    replies: number;
    views: number;
    lastActivity: string;
    tags: string[];
  }[];
}

const ForumTopics: React.FC<ForumTopicsProps> = ({ topics }) => {
  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <motion.div
          key={topic.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: topic.id * 0.05 }}
          className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-4 hover:border-primary/50 transition-colors"
        >
          <div className="flex flex-col md:flex-row justify-between gap-3">
            <div className="flex-1">
              <Link href={`/community-forum/topic/${topic.id}`}>
                <h3 className="text-white font-medium hover:text-primary transition-colors cursor-pointer">
                  {topic.title}
                </h3>
              </Link>

              <div className="flex flex-wrap gap-2 mt-2">
                {topic.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-primary/10 text-primary/80 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-end justify-between gap-6 text-sm">
              <div className="flex flex-col items-center">
                <span className="text-white/50">Author</span>
                <span className="text-white">{topic.author}</span>
                {topic.authorBadge && (
                  <span className="text-xs text-primary">
                    {topic.authorBadge}
                  </span>
                )}
              </div>

              <div className="flex flex-col items-center">
                <span className="text-white/50">Replies</span>
                <span className="text-white">{topic.replies}</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-white/50">Views</span>
                <span className="text-white">{topic.views}</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-white/50">Last Activity</span>
                <span className="text-white">{topic.lastActivity}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CommunityForum;
