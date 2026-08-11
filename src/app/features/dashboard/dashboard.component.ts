import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { KpiCard } from '../../models/kpi.model';
import { MetricPoint } from '../../models/metric.model';
import { MetricCardComponent } from '../../shared/components/metric-card/metric-card.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { TrendChartComponent } from '../../shared/components/trend-chart/trend-chart.component';

const SAMPLE_KPIS: KpiCard[] = [
  { id: 'kpi-revenue', label: 'Monthly Revenue', value: 184500, unit: '$', change: 12.4, trend: 'up', icon: 'payments' },
  { id: 'kpi-ticket', label: 'Average Ticket', value: 1250, unit: '$', change: 6.8, trend: 'up', icon: 'receipt_long' },
  { id: 'kpi-conversion', label: 'Conversion Rate', value: 4.6, unit: '%', change: -2.1, trend: 'warn', icon: 'percent' },
  { id: 'kpi-cac', label: 'Customer Acquisition Cost', value: 87, unit: '$', change: 9.3, trend: 'down', icon: 'campaign' },
];

const SALES_HISTORY: MetricPoint[] = [
  { label: 'Jan', value: 120 },
  { label: 'Feb', value: 148 },
  { label: 'Mar', value: 135 },
  { label: 'Apr', value: 172 },
  { label: 'May', value: 190 },
  { label: 'Jun', value: 182 },
  { label: 'Jul', value: 210 },
  { label: 'Aug', value: 232 },
  { label: 'Sep', value: 225 },
  { label: 'Oct', value: 258 },
  { label: 'Nov', value: 240 },
  { label: 'Dec', value: 286 },
];

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, PageHeaderComponent, MetricCardComponent, TrendChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  protected readonly kpis = signal<KpiCard[]>(SAMPLE_KPIS);
  protected readonly salesHistory = signal<MetricPoint[]>(SALES_HISTORY);
}