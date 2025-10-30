import { Card } from "@/components/ui/card";
import { Users, Trophy, TrendingUp, DollarSign } from "lucide-react";
import { Link } from "wouter";

interface StatsCardsProps {
  stats: {
    totalUsers: number;
    activeChallenges: number;
    totalWinnings: number;
    successRate: number;
  };
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "bg-blue-500",
      change: "+12% this month",
      href: "/admin/users",
    },
    {
      title: "Active Challenges",
      value: stats.activeChallenges.toLocaleString(),
      icon: Trophy,
      color: "bg-blue-500",
      change: "+8% this week",
      href: "/admin/challenges",
    },
    {
      title: "Total Winnings",
      value: `$${stats.totalWinnings.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500",
      change: "+23% this month",
      href: "#",
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      icon: TrendingUp,
      color: "bg-orange-500",
      change: "+5% this month",
      href: "#",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Link key={index} href={card.href}>
            <Card className="bg-gray-900 border-gray-800 p-6 hover:border-blue-500/50 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    {card.title}
                  </p>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {card.value}
                  </h3>
                  <p className="text-xs text-green-400 mt-2">{card.change}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default StatsCards;
