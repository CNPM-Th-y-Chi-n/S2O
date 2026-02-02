import { Brain, TrendingUp, Clock, Target, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const peakHoursData = [
  { hour: "6 AM", orders: 12 },
  { hour: "9 AM", orders: 45 },
  { hour: "12 PM", orders: 156 },
  { hour: "3 PM", orders: 78 },
  { hour: "6 PM", orders: 234 },
  { hour: "9 PM", orders: 189 },
  { hour: "12 AM", orders: 34 },
];

const aiRecommendationsData = [
  { week: "Week 1", baseline: 1200, withAI: 1250 },
  { week: "Week 2", baseline: 1180, withAI: 1320 },
  { week: "Week 3", baseline: 1220, withAI: 1450 },
  { week: "Week 4", baseline: 1190, withAI: 1580 },
];

const insights = [
  {
    icon: Clock,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    title: "Peak Ordering Time",
    value: "6:00 PM - 8:00 PM",
    description: "234 orders during peak hours today",
    suggestion: "Suggest restaurants to increase staff during this period"
  },
  {
    icon: Target,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    title: "Most Profitable Restaurant",
    value: "Pizza Palace",
    description: "$45,890 revenue this month",
    suggestion: "Analyze their success patterns for other restaurants"
  },
  {
    icon: Users,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    title: "User Behavior Trend",
    value: "Mobile Orders +42%",
    description: "Mobile app usage increased significantly",
    suggestion: "Optimize mobile experience and promote app features"
  },
  {
    icon: TrendingUp,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-50",
    title: "Revenue Growth Prediction",
    value: "+28% Next Month",
    description: "Based on current trends and seasonality",
    suggestion: "Prepare infrastructure for increased demand"
  },
];

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* AI Insights Cards */}
      <div className="grid grid-cols-2 gap-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 ${insight.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${insight.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{insight.title}</p>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{insight.value}</h3>
                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Brain className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-900">
                          <span className="font-medium">AI Recommendation:</span> {insight.suggestion}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Peak Hours Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Peak Ordering Hours Analysis</CardTitle>
            <CardDescription>AI-detected patterns in customer ordering behavior</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={peakHoursData}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorOrders)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Recommendations Effectiveness */}
        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations Impact</CardTitle>
            <CardDescription>Performance comparison with and without AI insights</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={aiRecommendationsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px' 
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="baseline" 
                  stroke="#94a3b8" 
                  strokeWidth={2}
                  name="Baseline"
                  strokeDasharray="5 5"
                />
                <Line 
                  type="monotone" 
                  dataKey="withAI" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="With AI"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-900">
                <span className="font-semibold">AI Impact:</span> Orders increased by 32% on average when restaurants follow AI recommendations
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced AI Insights</CardTitle>
          <CardDescription>Comprehensive analysis and actionable recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-medium text-gray-900 mb-1">Customer Retention Pattern</h4>
              <p className="text-sm text-gray-600 mb-2">
                Customers who order within the first 3 days of registration have a 78% higher retention rate.
              </p>
              <p className="text-sm text-blue-900 bg-blue-50 p-3 rounded">
                <Brain className="w-4 h-4 inline mr-1" />
                Send personalized welcome offers to new users to encourage early ordering.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-medium text-gray-900 mb-1">Menu Optimization Opportunity</h4>
              <p className="text-sm text-gray-600 mb-2">
                Restaurants with 8-12 menu items have 45% higher conversion rates than those with 20+ items.
              </p>
              <p className="text-sm text-green-900 bg-green-50 p-3 rounded">
                <Brain className="w-4 h-4 inline mr-1" />
                Recommend restaurants to curate focused menus with bestsellers.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h4 className="font-medium text-gray-900 mb-1">Pricing Strategy Insight</h4>
              <p className="text-sm text-gray-600 mb-2">
                Orders with delivery fees under $3 have 60% higher completion rates.
              </p>
              <p className="text-sm text-purple-900 bg-purple-50 p-3 rounded">
                <Brain className="w-4 h-4 inline mr-1" />
                Encourage competitive delivery pricing or introduce free delivery thresholds.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
