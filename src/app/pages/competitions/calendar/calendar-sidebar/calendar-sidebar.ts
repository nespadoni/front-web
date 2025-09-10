import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Subject, takeUntil} from 'rxjs';
import {CalendarService} from '../services/calendar.service';
import {CalendarMatch} from '../interfaces/calendar.interface';
// IMPORT ADICIONADO
import {MatchCardComponent} from '../match-card/match-card';

@Component({
  selector: 'app-calendar-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatchCardComponent  // ADICIONADO
  ],
  templateUrl: './calendar-sidebar.html',
  styleUrl: './calendar-sidebar.scss'
})
export class CalendarSidebarComponent implements OnInit, OnDestroy {
  selectedDate: Date = new Date();
  selectedDayMatches: CalendarMatch[] = [];

  private destroy$ = new Subject<void>();

  constructor(private calendarService: CalendarService) {
  }

  get selectedDateFormatted(): string {
    return this.selectedDate.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  ngOnInit(): void {
    this.calendarService.selectedDate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(date => {
        this.selectedDate = date;
        this.updateSelectedDayMatches();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMatchClick(match: CalendarMatch): void {
    // Implementar navegação para detalhes do jogo
    console.log('Navegar para jogo:', match);
  }

  trackByMatchId(index: number, match: CalendarMatch): number {
    return match.id;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'live':
        return 'status-live';
      case 'scheduled':
        return 'status-scheduled';
      case 'finished':
        return 'status-finished';
      case 'postponed':
        return 'status-postponed';
      default:
        return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'live':
        return 'AO VIVO';
      case 'scheduled':
        return 'AGENDADO';
      case 'finished':
        return 'FINALIZADO';
      case 'postponed':
        return 'ADIADO';
      default:
        return status.toUpperCase();
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  }

  private updateSelectedDayMatches(): void {
    this.selectedDayMatches = this.calendarService.getMatchesForDate(this.selectedDate);
  }
}
