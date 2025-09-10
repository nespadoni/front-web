import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Subject} from 'rxjs';
import {CalendarService} from '../services/calendar.service';
import {CalendarStats} from '../interfaces/calendar.interface';

@Component({
  selector: 'app-calendar-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-hero.html',
  styleUrl: './calendar-hero.scss'
})
export class CalendarHeroComponent implements OnInit, OnDestroy {
  stats: CalendarStats = {
    totalMatchesThisMonth: 0,
    todayMatches: 0,
    upcomingMatches: 0,
    activeTournaments: 0,
    followedTeams: 0
  };

  private destroy$ = new Subject<void>();

  constructor(private calendarService: CalendarService) {
  }

  ngOnInit(): void {
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onGoToToday(): void {
    this.calendarService.goToToday();
  }

  private loadStats(): void {
    this.stats = this.calendarService.getStats();
  }
}
