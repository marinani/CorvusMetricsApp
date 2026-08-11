import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { MetricTrend } from '../../../models/metric.model';

@Component({
  selector: 'app-metric-card',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly unit = input<string>('');
  readonly change = input<number>(0);
  readonly trend = input<MetricTrend>('up');
  readonly icon = input<string>('insights');

  protected readonly formattedValue = computed(() =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(this.value())
  );

  protected readonly formattedChange = computed(() =>
    `${this.change() > 0 ? '+' : ''}${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(this.change())}%`
  );

  protected readonly trendIcon = computed(() =>
    this.trend() === 'up' ? 'trending_up' : this.trend() === 'down' ? 'trending_down' : 'trending_flat'
  );
}