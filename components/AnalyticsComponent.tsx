"use client"

import { BarChart, PieChart } from "lucide-react"
import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "./../components/chart"

interface DishViewData{
  id:number,
  name:string,
  views:number
}

interface AnalyticsComponentProps {
  qrAnalyticsData?: any;
  dishViewData?: DishViewData[];
}

export default function AnalyticsDashboard({ qrAnalyticsData, dishViewData }: AnalyticsComponentProps) {
  const [activeTab, setActiveTab] = useState("qr");

  // Transform QR analytics data for the chart
  const qrScanData = qrAnalyticsData?.dailyScans?.map((day: any) => ({
    name: day.dayName,
    scans: day.count
  })) || [
    { name: "Mon", scans: 0 },
    { name: "Tue", scans: 0 },
    { name: "Wed", scans: 0 },
    { name: "Thu", scans: 0 },
    { name: "Fri", scans: 0 },
    { name: "Sat", scans: 0 },
    { name: "Sun", scans: 0 },
  ];

  const qrLocationData = [
    { name: "Dining Area", value: 45 },
    { name: "Takeout Counter", value: 30 },
    { name: "Website", value: 15 },
    { name: "Social Media", value: 10 },
  ]

  // Use real dish data if available, otherwise fallback to mock data
  const dishPopularityData = dishViewData?.map(dish => ({
    name: dish.name,
    views: dish.views
  })) || [
    { name: "Pasta", views: 85 },
    { name: "Pizza", views: 120 },
    { name: "Salad", views: 55 },
    { name: "Burger", views: 95 },
    { name: "Dessert", views: 40 },
  ]

  const dishRevenueData = [
    { name: "Mon", revenue: 1200 },
    { name: "Tue", revenue: 1500 },
    { name: "Wed", revenue: 1800 },
    { name: "Thu", revenue: 1450 },
    { name: "Fri", revenue: 1900 },
    { name: "Sat", revenue: 2100 },
    { name: "Sun", revenue: 1700 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      <Tabs defaultValue="qr" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="qr" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>QR Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="dish analytics" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Dish Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="qr" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Scans</CardTitle>
                <CardDescription>Daily scan activity over the past week</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={qrScanData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="scans" fill="hsl(var(--primary))" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>QR Code Locations</CardTitle>
                <CardDescription>Distribution of scans by location</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={qrLocationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {qrLocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>QR Analytics Summary</CardTitle>
                <CardDescription>Key metrics for your QR codes this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">Total Scans This Week</p>
                    <p className="text-3xl font-bold">{qrAnalyticsData?.totalScans || 0}</p>
                    <p className="text-green-500 text-sm">Last 7 days</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">Average Daily Scans</p>
                    <p className="text-3xl font-bold">{qrAnalyticsData?.totalScans ? Math.round(qrAnalyticsData.totalScans / 7) : 0}</p>
                    <p className="text-green-500 text-sm">Per day average</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">Peak Day</p>
                    <p className="text-3xl font-bold">
                      {qrAnalyticsData?.dailyScans?.reduce((max: any, day: any) => 
                        day.count > max.count ? day : max, { count: 0, dayName: 'N/A' })?.dayName || 'N/A'}
                    </p>
                    <p className="text-muted-foreground text-sm">Highest scan day</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dish analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dish Popularity</CardTitle>
                <CardDescription>Most viewed dishes this week</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={dishPopularityData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="hsl(var(--primary))" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dish Revenue</CardTitle>
                <CardDescription>Daily revenue over the past week</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={dishRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Dish Analytics Summary</CardTitle>
                <CardDescription>Key metrics for your menu items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">Total Views</p>
                    <p className="text-3xl font-bold">
                      {dishViewData?.reduce((sum, dish) => sum + dish.views, 0) || 395}
                    </p>
                    <p className="text-green-500 text-sm">↑ 15% from last week</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">Average Views</p>
                    <p className="text-3xl font-bold">
                      {dishViewData?.length ? Math.round(dishViewData.reduce((sum, dish) => sum + dish.views, 0) / dishViewData.length) : 79}
                    </p>
                    <p className="text-green-500 text-sm">Per dish average</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">Most Popular</p>
                    <p className="text-3xl font-bold">
                      {dishViewData?.reduce((max, dish) => dish.views > max.views ? dish : max, { name: 'N/A', views: 0 })?.name || 'N/A'}
                    </p>
                    <p className="text-muted-foreground text-sm">Highest viewed dish</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

