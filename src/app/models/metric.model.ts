export type MetricTrend = 'up' | 'warn' | 'down';

export interface Metric {
  id: string;
  companyId: string;
  name: string;
  slug: string;
  description: string;
  unit: string;
  period: MetricPeriod;
  value: number;
  target: number;
  previousValue: number;
  trend: MetricTrend;
  recordedAt: Date;
}

export type MetricPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface MetricPoint {
  label: string;
  value: number;
}

export interface MetricHistory {
  metricId: string;
  points: MetricPoint[];
}