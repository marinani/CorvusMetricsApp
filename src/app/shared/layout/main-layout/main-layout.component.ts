import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from '../../../services/auth.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { path: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { path: 'metrics', label: 'Metrics', icon: 'query_stats' },
    ],
  },
  {
    label: 'Basic Registration',
    items: [
      { path: 'tenants', label: 'Tenants', icon: 'business' },
      { path: 'acquisition-channels', label: 'Acquisition Channels', icon: 'storefront' },
      { path: 'users', label: 'Users', icon: 'group' },
    ],
  },
];

@Component({
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  protected readonly navSections = NAV_SECTIONS;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user = this.authService.user;

  protected readonly displayName = computed(() => {
    const currentUser = this.user();

    if (!currentUser) {
      return '';
    }

    return currentUser.firstName || currentUser.email;
  });

  protected readonly isMobile = toSignal(
    inject(BreakpointObserver)
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(map((state) => state.matches)),
    { initialValue: false }
  );

  protected readonly sidenavOpened = signal(false);

  constructor() {
    effect(() => {
      this.sidenavOpened.set(!this.isMobile());
    });
  }

  protected toggleSidenav(): void {
    this.sidenavOpened.update((opened) => !opened);
  }

  protected closeSidenav(): void {
    if (this.isMobile()) {
      this.sidenavOpened.set(false);
    }
  }

  protected logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}