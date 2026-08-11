import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { MetricPoint } from '../../../models/metric.model';

@Component({
  selector: 'app-trend-chart',
  templateUrl: './trend-chart.component.html',
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .trend-chart {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrendChartComponent {
  readonly data = input<MetricPoint[]>([]);
  readonly color = input<string>('#00e5ff');

  private static nextGradientId = 0;

  protected readonly gradientId = `trend-gradient-${TrendChartComponent.nextGradientId++}`;

  private readonly coordinates = computed(() => {
    const points = this.data();

    if (points.length === 0) {
      return [];
    }

    const values = points.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    return points.map((point, index) => {
      const x = points.length === 1 ? 50 : (index / (points.length - 1)) * 100;
      const y = (point.value - min) / range;
      return { x, y: 38 - y * 36 };
    });
  });

  protected readonly linePath = computed(() => {
    const coords = this.coordinates();
    return coords.map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  });

  protected readonly areaPath = computed(() => {
    const coords = this.coordinates();
    if (coords.length === 0) {
      return '';
    }
    const line = coords.map((point) => `L ${point.x} ${point.y}`).join(' ');
    return `M ${coords[0].x} 39 ${line} L ${coords[coords.length - 1].x} 39 Z`;
  });
}