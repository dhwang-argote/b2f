import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Charts = () => {
  const weeklyData = [
    { day: 'Mon', bets: 45, wins: 28 },
    { day: 'Tue', bets: 52, wins: 32 },
    { day: 'Wed', bets: 48, wins: 30 },
    { day: 'Thu', bets: 60, wins: 38 },
    { day: 'Fri', bets: 75, wins: 45 },
    { day: 'Sat', bets: 90, wins: 55 },
    { day: 'Sun', bets: 65, wins: 40 },
  ];

  const pieData = [
    { name: 'Wins', value: 65 },
    { name: 'Losses', value: 35 },
  ];

  const COLORS = ['#10B981', '#EF4444'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Weekly Performance Chart */}
  

      {/* Win/Loss Ratio */}
      <Card className="bg-gray-900 border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Win/Loss Ratio</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Charts;