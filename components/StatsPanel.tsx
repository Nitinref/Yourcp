"use client";

import type React from "react";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Question } from "@/types";

const chartColors = [
  "#06b6d4",
  "#34d399",
  "#f59e0b",
  "#fb7185",
  "#818cf8",
  "#22c55e"
];

function countBy<T extends string>(items: T[]) {
  return Object.entries(
    items.reduce<Record<string, number>>((accumulator, item) => {
      accumulator[item] = (accumulator[item] ?? 0) + 1;
      return accumulator;
    }, {})
  ).map(([name, value]) => ({ name, value }));
}

function ChartCard({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function StatsPanel({ questions }: { questions: Question[] }) {
  const statusData = countBy(questions.map((question) => question.status));
  const platformData = countBy(questions.map((question) => question.platform));
  const topicData = countBy(questions.flatMap((question) => question.topics))
    .sort((first, second) => second.value - first.value)
    .slice(0, 10);
  const difficultyData = countBy(questions.map((question) => question.difficulty));

  const dateMap = new Map<string, number>();
  const today = new Date();
  for (let index = 13; index >= 0; index -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - index);
    const key = day.toISOString().slice(0, 10);
    dateMap.set(
      key,
      questions.filter((question) => question.dateAdded.slice(0, 10) === key).length
    );
  }

  const lineData = Array.from(dateMap.entries()).map(([date, count]) => ({
    date: date.slice(5),
    count
  }));

  const avgConfidence =
    questions.length > 0
      ? (
          questions.reduce((sum, question) => sum + question.confidence, 0) /
          questions.length
        ).toFixed(1)
      : "0.0";

  const mostPracticedTopic = topicData[0]?.name ?? "None yet";
  const hardestPlatform =
    platformData
      .map((platform) => ({
        ...platform,
        score: questions
          .filter((question) => question.platform === platform.name)
          .reduce((sum, question) => {
            const points =
              question.difficulty === "Hard"
                ? 3
                : question.difficulty === "Medium"
                  ? 2
                  : 1;
            return sum + points;
          }, 0)
      }))
      .sort((first, second) => second.score - first.score)[0]?.name ?? "None yet";

  const statCards = [
    { title: "Total Questions", value: String(questions.length) },
    { title: "Avg Confidence", value: avgConfidence },
    { title: "Most Practiced Topic", value: mostPracticedTopic },
    { title: "Hardest Platform", value: hardestPlatform }
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, index) => (
          <Card
            key={card.title}
            className={`group glow-ring transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(6,182,212,0.15)] animate-fade-in-up delay-${(index + 1) * 100}`}
          >
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className="text-2xl font-extrabold">{card.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="animate-fade-in delay-100">
          <ChartCard
            title="Progress Status"
            description="Solved vs attempted vs unsolved"
          >
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={68}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#f1f5f9" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="animate-fade-in delay-200">
          <ChartCard
            title="Difficulty Split"
            description="Easy, medium, and hard coverage"
          >
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={difficultyData} dataKey="value" nameKey="name" outerRadius={105}>
                  {difficultyData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#f1f5f9" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="animate-fade-in delay-300">
          <ChartCard
            title="Questions by Platform"
            description="Where you practice most often"
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={platformData}>
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#f1f5f9" }}
                />
                <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                  {platformData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="animate-fade-in delay-400">
          <ChartCard title="Top Topics" description="Your most practiced concepts">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topicData}>
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#f1f5f9" }}
                />
                <Bar dataKey="value" fill="#06b6d4" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      <div className="animate-fade-in delay-500">
        <ChartCard
          title="Activity Over Time"
          description="Questions added during the last 14 days"
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={lineData}>
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#f1f5f9" }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ r: 4, fill: "#22d3ee" }}
                activeDot={{ r: 7, fill: "#06b6d4", stroke: "#22d3ee", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
