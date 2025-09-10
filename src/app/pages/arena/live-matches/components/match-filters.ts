import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {LiveMatchesService} from '../services/live-matches.service';
import {MatchFilters, MatchStatus, Sport, Tournament} from '../models/match.interface';
import {SportIconPipe} from '../pipes/sport-icon.pipe';

@Component({
  selector: 'app-match-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, SportIconPipe],
  templateUrl: './match-filters.html',
  styleUrl: './match-filters.scss'
})
export class MatchFiltersComponent implements OnInit, OnDestroy {
  filters: MatchFilters = {};
  sports: Sport[] = [];
  tournaments: Tournament[] = [];
  statusOptions: { id: MatchStatus; label: string; color: string }[] = [
    {id: 'live', label: 'Ao Vivo', color: '#4CAF50'},
    {id: 'scheduled', label: 'Agendado', color: '#FF9800'},
    {id: 'finished', label: 'Finalizado', color: '#f44336'},
    {id: 'halftime', label: 'Intervalo', color: '#2196F3'}
  ];
  searchTerm: string = '';
  selectedSports: string[] = [];
  selectedTournaments: string[] = [];
  selectedStatuses: MatchStatus[] = [];
  showFilters: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private liveMatchesService: LiveMatchesService) {
  }

  ngOnInit(): void {
    this.loadFiltersData();
    this.loadCurrentFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(): void {
    this.updateFilters();
  }

  onSportChange(sportId: string, checked: boolean): void {
    if (checked) {
      this.selectedSports = [...this.selectedSports, sportId];
    } else {
      this.selectedSports = this.selectedSports.filter(id => id !== sportId);
    }
    this.updateFilters();
  }

  onTournamentChange(tournamentId: string, checked: boolean): void {
    if (checked) {
      this.selectedTournaments = [...this.selectedTournaments, tournamentId];
    } else {
      this.selectedTournaments = this.selectedTournaments.filter(id => id !== tournamentId);
    }
    this.updateFilters();
  }

  onStatusChange(status: MatchStatus, checked: boolean): void {
    if (checked) {
      this.selectedStatuses = [...this.selectedStatuses, status];
    } else {
      this.selectedStatuses = this.selectedStatuses.filter(s => s !== status);
    }
    this.updateFilters();
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.selectedSports = [];
    this.selectedTournaments = [];
    this.selectedStatuses = [];
    this.updateFilters();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.searchTerm) count++;
    if (this.selectedSports.length) count++;
    if (this.selectedTournaments.length) count++;
    if (this.selectedStatuses.length) count++;
    return count;
  }

  isSportSelected(sportId: string): boolean {
    return this.selectedSports.includes(sportId);
  }

  isTournamentSelected(tournamentId: string): boolean {
    return this.selectedTournaments.includes(tournamentId);
  }

  isStatusSelected(status: MatchStatus): boolean {
    return this.selectedStatuses.includes(status);
  }

  private loadFiltersData(): void {
    this.liveMatchesService.getSports()
      .pipe(takeUntil(this.destroy$))
      .subscribe(sports => this.sports = sports);

    this.liveMatchesService.getTournaments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(tournaments => this.tournaments = tournaments);
  }

  private loadCurrentFilters(): void {
    this.liveMatchesService.getFilters()
      .pipe(takeUntil(this.destroy$))
      .subscribe(filters => {
        this.filters = filters;
        this.searchTerm = filters.searchTerm || '';
        this.selectedSports = filters.sport || [];
        this.selectedTournaments = filters.tournament || [];
        this.selectedStatuses = filters.status || [];
      });
  }

  private updateFilters(): void {
    const newFilters: MatchFilters = {
      searchTerm: this.searchTerm || undefined,
      sport: this.selectedSports.length ? this.selectedSports : undefined,
      tournament: this.selectedTournaments.length ? this.selectedTournaments : undefined,
      status: this.selectedStatuses.length ? this.selectedStatuses : undefined
    };

    this.liveMatchesService.setFilters(newFilters);
  }
}
