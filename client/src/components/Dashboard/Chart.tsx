'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';

// Array of colors for pie chart segments
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#8dd1e1',
];

export function ApplicationChart({ chartData }) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Technology Stack Distribution</CardTitle>
        <CardDescription>
          Applicants by technology stack with hiring outcomes
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer
          config={{
            count: {
              label: 'Total Applicants',
              color: 'hsl(var(--chart-1))',
            },
            hired: {
              label: 'Hired',
              color: 'hsl(var(--chart-2))',
            },
            rejected: {
              label: 'Rejected',
              color: 'hsl(var(--chart-3))',
            },
          }}
          className="aspect-[4/3]"
        >
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="var(--chart-1)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="hired"
                  fill="var(--chart-2)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="rejected"
                  fill="var(--chart-3)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-muted-foreground flex h-[350px] items-center justify-center">
              No data available for technology stack distribution
            </div>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function ApplicationStatusChart({ statusData }) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Application Status</CardTitle>
        <CardDescription>
          Current status distribution of all applicants
        </CardDescription>
      </CardHeader>
      <CardContent>
        {statusData && statusData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} applicants`, 'Count']}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-muted-foreground flex h-[300px] items-center justify-center">
            No data available for application status
          </div>
        )}
      </CardContent>
    </Card>
  );
}
