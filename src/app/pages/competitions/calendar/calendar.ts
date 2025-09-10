import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Subject} from 'rxjs';

// Services
import {CalendarService} from './services/calendar.service';

// Components
import {CalendarHeroComponent} from './calendar-hero/calendar-hero';
import {CalendarGridComponent} from './calendar-grid/calendar-grid';
import {CalendarSidebarComponent} from './calendar-sidebar/calendar-sidebar';
import {MatchCardComponent} from './match-card/match-card';

// Interfaces
import {CalendarMatch} from './interfaces/calendar.interface';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    CalendarHeroComponent,
    CalendarGridComponent,
    CalendarSidebarComponent,
    MatchCardComponent
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class CalendarComponent implements OnInit, OnDestroy {
  // Popup state
  isPopupOpen = false;
  popupDate: Date | null = null;
  popupMatches: CalendarMatch[] = [];

  private destroy$ = new Subject<void>();

  constructor(private calendarService: CalendarService) {
  }

  // Getters para popup
  get popupDateFormatted(): string {
    if (!this.popupDate) return '';
    return this.popupDate.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  ngOnInit(): void {
    // Configuração inicial se necessário
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Handlers para eventos dos componentes filhos
  onDaySelected(date: Date): void {
    this.calendarService.selectDate(date);
  }

  onMatchesPopup(event: { date: Date, matches: CalendarMatch[] }): void {
    this.popupDate = event.date;
    this.popupMatches = event.matches;
    this.isPopupOpen = true;
  }

  onMatchClick(match: CalendarMatch): void {
    // Implementar navegação para detalhes do jogo
    console.log('Navegar para detalhes do jogo:', match);
  }

  // Popup methods
  closePopup(): void {
    this.isPopupOpen = false;
    this.popupDate = null;
    this.popupMatches = [];
  }

  onPopupBackgroundClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closePopup();
    }
  }

  // TrackBy functions
  trackByMatchId(index: number, match: CalendarMatch): number {
    return match.id;
  }
}
