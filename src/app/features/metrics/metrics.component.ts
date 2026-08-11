import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { resource } from '@angular/core';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { catchError, firstValueFrom, of } from 'rxjs';

import { Metric, MetricTrend } from '../../models/metric.model';
import { MetricService } from '../../services/metric.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

const SAMPLE_METRICS: Metric[] = [
  {
    id: 'met-1',
    companyId: 'cmp-1',
    name: 'Monthly Revenue',
    slug: 'monthly-revenue',
    description: 'Total revenue generated in the period',
    unit: '$',
    period: 'monthly',
    value: 184500,
    target: 180000,
    previousValue: 164150,
    trend: 'up',
    recordedAt: new Date('2026-08-01'),
  },
  {
    id: 'met-2',
    companyId: 'cmp-1',
    name: 'Conversion Rate',
    slug: 'conversion-rate',
    description: 'Visitors converted into customers',
    unit: '%',
    period: 'monthly',
    value: 4.6,
    target: 5,
    previousValue: 4.7,
    trend: 'warn',
    recordedAt: new Date('2026-08-01'),
  },
  {
    id: 'met-3',
    companyId: 'cmp-2',
    name: 'Customer Acquisition Cost',
    slug: 'cac',
    description: 'Cost to acquire a new customer',
    unit: '$',
    period: 'monthly',
    value: 87,
    target: 60,
    previousValue: 79.6,
    trend: 'down',
    recordedAt: new Date('2026-08-01'),
  },
  {
    id: 'met-4',
    companyId: 'cmp-1',
    name: 'Average Ticket',
    slug: 'average-ticket',
    description: 'Average value per sale',
    unit: '$',
    period: 'monthly',
    value: 1250,
    target: 1150,
    previousValue: 1170,
    trend: 'up',
    recordedAt: new Date('2026-08-01'),
  },
  {
    id: 'met-5',
    companyId: 'cmp-3',
    name: 'Customer Churn Rate',
    slug: 'churn-rate',
    description: 'Customers lost during the period',
    unit: '%',
    period: 'monthly',
    value: 7.2,
    target: 5,
    previousValue: 6.1,
    trend: 'down',
    recordedAt: new Date('2026-08-01'),
  },
];

@Component({
  selector: 'app-metrics',
  imports: [MatCardModule, MatTableModule, MatIconModule, MatProgressSpinnerModule, PageHeaderComponent, DecimalPipe, TitleCasePipe],
  templateUrl: './metrics.component.html',
  styleUrl: './metrics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsComponent {
  protected readonly columns = ['name', 'period', 'value', 'target', 'trend'];

  private readonly metricService = inject(MetricService);

  protected readonly metricsResource = resource<Metric[], unknown>({
    loader: () => firstValueFrom(this.metricService.getAll().pipe(catchError(() => of(SAMPLE_METRICS)))),
  });

  protected readonly trendIcon: Record<MetricTrend, string> = {
    up: 'trending_up',
    warn: 'trending_flat',
    down: 'trending_down',
  };

  protected getTrendIcon(trend: MetricTrend): string {
    return this.trendIcon[trend];
  }
}