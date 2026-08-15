"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColumnWithTasks } from "@/lib/supabase/models";
import { Activity, AlertTriangle, Clock, Zap } from "lucide-react";
import { getBoardStats } from "../utils";

interface BoardInsightsProps {
  columns: ColumnWithTasks[];
}

export function BoardInsights({ columns }: BoardInsightsProps) {
  const stats = getBoardStats(columns);
  const dueRatio = stats.totalTasks
    ? Math.round((stats.dueSoon / stats.totalTasks) * 100)
    : 0;
  const overdueRatio = stats.totalTasks
    ? Math.round((stats.overdue / stats.totalTasks) * 100)
    : 0;

  return (
    <section className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-sky-600 via-cyan-600 to-sky-500 text-white shadow-xl border-0 overflow-hidden">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-base text-white">Task Load</CardTitle>
              <p className="text-xs text-sky-100/80">
                Total work items on this board
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 p-2 text-white">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-bold text-white">
            {stats.totalTasks}
          </div>
          <div className="mt-4 rounded-full bg-white/15 h-2.5 overflow-hidden">
            <div
              className="h-2.5 bg-white/80"
              style={{ width: `${Math.min(stats.totalTasks * 8, 100)}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-sky-100/90">
            Board capacity indicator
          </p>
        </div>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Priority Mix</CardTitle>
              <p className="text-xs text-gray-500">
                High, medium, and low priority tasks
              </p>
            </div>
            <Zap className="w-5 h-5 text-amber-600" />
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {[
            { label: "High", value: stats.highPriority, color: "bg-red-500" },
            {
              label: "Medium",
              value: stats.mediumPriority,
              color: "bg-yellow-500",
            },
            { label: "Low", value: stats.lowPriority, color: "bg-emerald-500" },
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`${item.color} h-2 rounded-full`}
                  style={{ width: `${Math.min(item.value * 12, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Coming Due</CardTitle>
              <p className="text-xs text-gray-500">
                Tasks due in the next 7 days
              </p>
            </div>
            <div className="rounded-2xl bg-violet-100 p-2 text-violet-700">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-4xl font-bold text-gray-900">
            {stats.dueSoon}
          </div>
          <div className="mt-4 rounded-full bg-violet-100 h-2.5 overflow-hidden">
            <div
              className="h-2.5 bg-violet-600"
              style={{ width: `${Math.min(dueRatio, 100)}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-gray-500">
            {dueRatio}% of tasks are due soon
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Overdue</CardTitle>
              <p className="text-xs text-gray-500">
                Tasks that need attention now
              </p>
            </div>
            <div className="rounded-2xl bg-red-100 p-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-4xl font-bold text-gray-900">
            {stats.overdue}
          </div>
          <div className="mt-4 rounded-full bg-red-100 h-2.5 overflow-hidden">
            <div
              className="h-2.5 bg-red-500"
              style={{ width: `${Math.min(overdueRatio, 100)}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-gray-500">
            {overdueRatio}% of tasks are overdue
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
