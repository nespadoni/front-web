import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Subject, takeUntil} from 'rxjs';
import {CalendarService} from '../services/calendar.service';
import {CalendarDay, CalendarMatch} from '../interfaces/calendar.interface';

@Component({
  selector: 'app-calendar-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-grid.html',
  styleUrl: './calendar-grid.scss'
})
export class CalendarGridComponent implements OnInit, OnDestroy {
  @Output() daySelected = new EventEmitter<Date>();
  @Output() matchesPopup = new EventEmitter<{ date: Date, matches: CalendarMatch[] }>();

  calendarDays: CalendarDay[] = [];
  currentMonth: Date = new Date();

  dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  private destroy$ = new Subject<void>();

  constructor(private calendarService: CalendarService) {
  }

  get currentMonthYear(): string {
    return `${this.monthNames[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
  }

  ngOnInit(): void {
    this.calendarService.currentMonth$
      .pipe(takeUntil(this.destroy$))
      .subscribe((month: Date) => {
        this.currentMonth = month;
        this.updateCalendarDays();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Gerar classes CSS para o dia
  getDayClasses(day: CalendarDay): string {
    const classes = [];

    if (!day.isCurrentMonth) classes.push('other-month');
    if (day.isToday) classes.push('today');
    if (day.isSelected) classes.push('selected');
    if (day.hasMatches) classes.push('has-matches');
    if (day.isWeekend) classes.push('weekend');
    if (day.isHoliday) classes.push('holiday');

    return classes.join(' ');
  }

  // Tooltip para jogos
  getMatchTooltip(match: CalendarMatch): string {
    return `${match.tournament} - ${match.homeTeam.name} vs ${match.awayTeam.name} às ${match.time}`;
  }

  onDayClick(day: CalendarDay, event: Event): void {
    if (!day.isCurrentMonth) return;

    if (day.hasMatches && day.matchCount > 2) {
      event.stopPropagation();
      this.matchesPopup.emit({date: day.date, matches: day.matches});
    } else {
      this.daySelected.emit(day.date);
      this.calendarService.selectDate(day.date);
    }
  }

  onMoreIndicatorClick(day: CalendarDay, event: Event): void {
    event.stopPropagation();
    this.matchesPopup.emit({date: day.date, matches: day.matches});
  }

  onPreviousMonth(): void {
    this.calendarService.previousMonth();
  }

  onNextMonth(): void {
    this.calendarService.nextMonth();
  }

  onGoToToday(): void {
    this.calendarService.goToToday();
  }

  trackByDay(index: number, day: CalendarDay): string {
    return `${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`;
  }

  trackByMatchId(index: number, match: CalendarMatch): number {
    return match.id;
  }

  private updateCalendarDays(): void {
    this.calendarDays = this.calendarService.getCalendarDays(this.currentMonth);
  }
}
