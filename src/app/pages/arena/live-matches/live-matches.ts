import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {LiveMatchesService} from './services/live-matches.service';
import {MatchCardComponent} from './components/match-card';
import {MatchFiltersComponent} from './components/match-filters';
import {Match, MatchPriority, MatchStatus} from './models/match.interface';

@Component({
  selector: 'app-live-matches',
  standalone: true,
  imports: [
    CommonModule,
    MatchCardComponent,
    MatchFiltersComponent
  ],
  templateUrl: './live-matches.html',
  styleUrl: './live-matches.scss'
})
export class LiveMatchesComponent implements OnInit, OnDestroy {
  matches: Match[] = [];
  filteredMatches: Match[] = [];
  isLoading: boolean = true;
  hasError: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private liveMatchesService: LiveMatchesService,
    private router: Router
  ) {
    console.log('🏀 LiveMatchesComponent constructor');
  }

  ngOnInit(): void {
    console.log('🏀 LiveMatchesComponent ngOnInit');
    this.loadMatches();

    // ❌ NÃO fazer manipulações globais do DOM aqui
    // document.body.style.overflow = 'hidden'; // Problemático
    // document.querySelector('app-socialbar')?.remove(); // Problemático
  }

  ngOnDestroy(): void {
    console.log('🏀 LiveMatchesComponent ngOnDestroy');
    this.destroy$.next();
    this.destroy$.complete();

    // ❌ NÃO fazer manipulações globais do DOM aqui também
    // document.body.style.overflow = ''; // Problemático
  }

  // ... resto dos métodos permanecem iguais
  onFollowMatch(matchId: string): void {
    this.liveMatchesService.toggleFollowMatch(matchId);
  }

  onViewMatchDetails(matchId: string): void {
    this.router.navigate(['/match-details', matchId]);
  }

  onRetry(): void {
    this.loadMatches();
  }

  getLiveMatchesCount(): number {
    return this.matches.filter(match => match.status === 'live').length;
  }

  getScheduledMatchesCount(): number {
    return this.matches.filter(match => match.status === 'scheduled').length;
  }

  getFollowingMatchesCount(): number {
    return this.matches.filter(match => match.isFollowing).length;
  }

  getLiveMatches(): Match[] {
    return this.filteredMatches.filter(match =>
      match.status === 'live' || match.status === 'halftime'
    );
  }

  getScheduledMatches(): Match[] {
    return this.filteredMatches.filter(match => match.status === 'scheduled');
  }

  getFinishedMatches(): Match[] {
    return this.filteredMatches.filter(match =>
      match.status === 'finished' || match.status === 'postponed'
    );
  }

  private loadMatches(): void {
    this.isLoading = true;
    this.hasError = false;

    this.liveMatchesService.getMatches()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (matches) => {
          this.matches = matches;
          this.isLoading = false;
        },
        error: () => {
          this.hasError = true;
          this.isLoading = false;
        }
      });

    this.liveMatchesService.getFilteredMatches()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (filteredMatches) => {
          this.filteredMatches = this.sortMatches(filteredMatches);
        },
        error: () => {
          this.hasError = true;
          this.isLoading = false;
        }
      });
  }

  private sortMatches(matches: Match[]): Match[] {
    return matches.sort((a, b) => {
      const statusPriority: Record<MatchStatus, number> = {
        'live': 5,
        'halftime': 4,
        'scheduled': 3,
        'finished': 2,
        'postponed': 1
      };

      const priorityDiff = (statusPriority[b.status] || 0) - (statusPriority[a.status] || 0);
      if (priorityDiff !== 0) return priorityDiff;

      const matchPriority: Record<MatchPriority, number> = {
        'high': 3,
        'medium': 2,
        'low': 1
      };

      const matchPriorityDiff = (matchPriority[b.priority] || 0) - (matchPriority[a.priority] || 0);
      if (matchPriorityDiff !== 0) return matchPriorityDiff;

      return b.startTime.getTime() - a.startTime.getTime();
    });
  }
}
