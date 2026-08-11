import { MetricTrend } from './metric.model';

export interface KpiCard {
  id: string;
  label: string;
  value: number;
  unit: string;
  change: number;
  trend: MetricTrend;
  icon: string;
}