"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  BadgeCheck,
  Building2,
  CircleDollarSign,
  Clock3,
  Cpu,
  Database,
  FileCheck,
  MessageSquareText,
  ShieldAlert,
  Ticket,
  UserCheck,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "./stat-card";
import { ChartCard } from "./chart-card";
import { SectionHeader } from "./section-header";
import { QuickActionCard } from "./quick-action-card";
import { ActivityCard } from "./activity-card";
import { TableCard } from "./table-card";
import { DashboardCard } from "./dashboard-card";

const kpis = [
  { title: "Total Users", value: "84,221", change: "+8.2%", hint: "vs last month", icon: Users },
  { title: "Active Agents", value: "2,148", change: "+5.1%", hint: "in last 30 days", icon: UserCheck },
  { title: "Active Agencies", value: "496", change: "+2.4%", hint: "verified organizations", icon: Building2 },
  { title: "Today's Visitors", value: "12,870", change: "+10.9%", hint: "unique sessions", icon: Activity },
  { title: "Pending Approvals", value: "93", change: "+1.8%", hint: "requires review", icon: FileCheck },
  { title: "Open Tickets", value: "41", change: "-4.0%", hint: "support queue", icon: Ticket },
  { title: "Revenue", value: "LKR 9.8M", change: "+12.4%", hint: "monthly recurring", icon: CircleDollarSign },
  { title: "Monthly Growth", value: "18.2%", change: "+2.3%", hint: "platform expansion", icon: BadgeCheck },
];

const quickActions = [
  { label: "Create User", icon: Users },
  { label: "Approve Agency", icon: Building2 },
  { label: "Add Job", icon: FileCheck },
  { label: "Review Documents", icon: ShieldAlert },
  { label: "View Reports", icon: Activity },
  { label: "System Backup", icon: Database },
];

const health = [
  { label: "CPU", value: 48 },
  { label: "Memory", value: 64 },
  { label: "Storage", value: 52 },
  { label: "Queue", value: 27 },
  { label: "Database", value: 41 },
  { label: "API Status", value: 32 },
  { label: "Background Jobs", value: 58 },
  { label: "Cron Jobs", value: 73 },
];

export function DashboardShell() {
  const showSkeleton = false;

  const aiMetrics = useMemo(
    () => [
      { label: "AI Requests", value: "12,442" },
      { label: "Tokens Used", value: "4.8M" },
      { label: "Prompt Success Rate", value: "96.2%" },
      { label: "Avg Response Time", value: "740ms" },
    ],
    [],
  );

  return (
    <main className="space-y-8 p-4 md:p-6">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {kpis.map((item) => (
              <StatCard key={item.title} {...item} />
            ))}
          </motion.section>

          <section className="grid gap-4 xl:grid-cols-2">
            <ChartCard title="User Growth" />
            <ChartCard title="Monthly Revenue" />
            <ChartCard title="Exam Applications" />
            <ChartCard title="Agency Registrations" />
          </section>

          <section>
            <SectionHeader
              title="Quick Actions"
              subtitle="Frequently used operational shortcuts"
            />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {quickActions.map((action) => (
                <QuickActionCard key={action.label} label={action.label} icon={action.icon} />
              ))}
            </div>
          </section>

          <TableCard />

          <section className="grid gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <ActivityCard />
            </div>
            <DashboardCard title="System Health" description="Realtime infrastructure and service checks">
              <div className="space-y-3">
                {health.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-medium text-slate-800">{item.value}%</span>
                    </div>
                    <Progress value={item.value} />
                  </div>
                ))}
              </div>
            </DashboardCard>
          </section>

          <section>
            <SectionHeader title="AI Operations" subtitle="Requests, conversations, and model health" />
            <div className="grid gap-4 lg:grid-cols-4">
              {aiMetrics.map((item) => (
                <Card key={item.label}>
                  <CardHeader>
                    <CardTitle className="text-sm text-slate-500">{item.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <p className="text-2xl font-semibold">{item.value}</p>
                    <MessageSquareText className="h-4 w-4 text-blue-600" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Recent AI Conversations</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li className="rounded-lg bg-slate-50 p-2">Agent #12 generated campaign copy for exam listing moderation. <span className="text-slate-400">2m ago</span></li>
                <li className="rounded-lg bg-slate-50 p-2">Billing assistant summarized failed payment retries. <span className="text-slate-400">11m ago</span></li>
                <li className="rounded-lg bg-slate-50 p-2">Support bot escalated agency onboarding ticket. <span className="text-slate-400">29m ago</span></li>
              </ul>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader><CardTitle className="text-sm text-slate-500">Payment Analytics</CardTitle></CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">LKR 12.4M</p>
                <p className="mt-1 text-xs text-slate-500">Captured this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm text-slate-500">Model Status</CardTitle></CardHeader>
              <CardContent className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-emerald-600" />
                <p className="text-sm text-slate-700">Operational with normal latency</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm text-slate-500">Queue Watch</CardTitle></CardHeader>
              <CardContent className="flex items-center gap-2">
                <Clock3 className="h-5 w-5 text-amber-600" />
                <p className="text-sm text-slate-700">12 background jobs waiting</p>
              </CardContent>
            </Card>
          </section>

          {showSkeleton ? (
            <Card>
              <CardContent className="py-10 text-center text-slate-500">Loading dashboard...</CardContent>
            </Card>
          ) : null}
    </main>
  );
}
