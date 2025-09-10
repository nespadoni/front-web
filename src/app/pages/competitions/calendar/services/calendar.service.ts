import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CalendarDay, CalendarMatch, CalendarStats} from '../interfaces/calendar.interface';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private selectedDateSubject = new BehaviorSubject<Date>(new Date());
  public selectedDate$ = this.selectedDateSubject.asObservable();

  private currentMonthSubject = new BehaviorSubject<Date>(new Date());
  public currentMonth$ = this.currentMonthSubject.asObservable();

  // Mock data - com datas atuais
  private mockMatches: CalendarMatch[] = [
    {
      id: 1,
      tournament: 'Copa Universitária de Futebol 2025',
      sport: 'Futebol',
      sportIcon: 'fas fa-futbol',
      sportColor: '#22c55e',
      date: new Date('2025-09-15T15:30:00'),
      time: '15:30',
      homeTeam: {
        id: 1,
        name: 'Atlética Medicina USP',
        shortName: 'MED',
        logo: 'assets/teams/medicina-usp.png',
        university: 'USP',
        colors: {primary: '#0066cc', secondary: '#ffffff'}
      },
      awayTeam: {
        id: 2,
        name: 'Atlética Engenharia UNICAMP',
        shortName: 'ENG',
        logo: 'assets/teams/engenharia-unicamp.png',
        university: 'UNICAMP',
        colors: {primary: '#cc0000', secondary: '#ffffff'}
      },
      venue: 'Estádio Universitário São Paulo',
      status: 'scheduled',
      priority: 'high',
      attendance: 0,
      maxAttendance: 5000,
      description: 'Final da Copa Universitária - Jogo decisivo!',
      streamUrl: 'https://stream.example.com/match1'
    },
    {
      id: 2,
      tournament: 'Liga Nacional de Basquete Universitário',
      sport: 'Basquete',
      sportIcon: 'fas fa-basketball-ball',
      sportColor: '#f97316',
      date: new Date('2025-09-15T19:00:00'),
      time: '19:00',
      homeTeam: {
        id: 3,
        name: 'PUC-SP Tigers',
        shortName: 'PUC',
        logo: 'assets/teams/puc-sp.png',
        university: 'PUC-SP',
        colors: {primary: '#1a365d', secondary: '#ffd700'}
      },
      awayTeam: {
        id: 4,
        name: 'Mackenzie Wolves',
        shortName: 'MAC',
        logo: 'assets/teams/mackenzie.png',
        university: 'Mackenzie',
        colors: {primary: '#8b0000', secondary: '#ffffff'}
      },
      venue: 'Ginásio Central PUC-SP',
      status: 'scheduled',
      priority: 'high',
      attendance: 0,
      maxAttendance: 2500,
      description: 'Clássico paulista entre duas potências universitárias'
    }
  ];

  constructor() {
    // Gerar mais jogos automaticamente para preencher o mês
    this.generateMoreMatches();
  }

  // Métodos públicos
  getCalendarDays(currentDate: Date): CalendarDay[] {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const currentDateIterator = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const dayMatches = this.getMatchesForDate(currentDateIterator);

      days.push({
        date: new Date(currentDateIterator),
        day: currentDateIterator.getDate(),
        isCurrentMonth: currentDateIterator.getMonth() === month,
        isToday: this.isToday(currentDateIterator),
        isSelected: this.isSameDay(currentDateIterator, this.selectedDateSubject.value),
        hasMatches: dayMatches.length > 0,
        matchCount: dayMatches.length,
        matches: dayMatches,
        isWeekend: currentDateIterator.getDay() === 0 || currentDateIterator.getDay() === 6
      });

      currentDateIterator.setDate(currentDateIterator.getDate() + 1);
    }

    return days;
  }

  getMatchesForDate(date: Date): CalendarMatch[] {
    return this.mockMatches.filter(match =>
      this.isSameDay(match.date, date)
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  getStats(): CalendarStats {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const thisMonthMatches = this.mockMatches.filter(match =>
      match.date.getMonth() === currentMonth &&
      match.date.getFullYear() === currentYear
    );

    const todayMatches = this.mockMatches.filter(match =>
      this.isToday(match.date)
    );

    const upcomingMatches = this.mockMatches.filter(match => {
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      return match.date > today && match.date <= nextWeek;
    });

    const tournaments = new Set(this.mockMatches.map(match => match.tournament));

    return {
      totalMatchesThisMonth: thisMonthMatches.length,
      todayMatches: todayMatches.length,
      upcomingMatches: upcomingMatches.length,
      activeTournaments: tournaments.size,
      followedTeams: 12 // Mock value
    };
  }

  // Métodos de navegação
  selectDate(date: Date): void {
    this.selectedDateSubject.next(date);
  }

  setCurrentMonth(date: Date): void {
    this.currentMonthSubject.next(date);
  }

  nextMonth(): void {
    const current = this.currentMonthSubject.value;
    const next = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    this.setCurrentMonth(next);
  }

  previousMonth(): void {
    const current = this.currentMonthSubject.value;
    const previous = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    this.setCurrentMonth(previous);
  }

  goToToday(): void {
    const today = new Date();
    this.setCurrentMonth(today);
    this.selectDate(today);
  }

  private generateMoreMatches(): void {
    const sports = [
      {name: 'Futebol', icon: 'fas fa-futbol', color: '#22c55e'},
      {name: 'Basquete', icon: 'fas fa-basketball-ball', color: '#f97316'},
      {name: 'Vôlei', icon: 'fas fa-volleyball-ball', color: '#a855f7'},
      {name: 'Handebol', icon: 'fas fa-hand-fist', color: '#ef4444'},
      {name: 'Futsal', icon: 'fas fa-futbol', color: '#06b6d4'},
      {name: 'Atletismo', icon: 'fas fa-running', color: '#84cc16'}
    ];

    const teams = [
      'UNIC', 'UNIVAG', 'UFMT', 'IFMT', 'ANHANGUERA', 'UNIGRAN',
      'CATÓLICA', 'FAAP', 'FAINOR', 'UNIFAS'
    ];

    const venues = [
      'Arena Universitária Central', 'Ginásio Poliesportivo', 'Campo de Futebol Principal',
      'Quadra Coberta', 'Centro Esportivo', 'Complexo Aquático'
    ];

    // Gerar jogos para os próximos 30 dias
    for (let i = 3; i <= 30; i++) {
      const randomDayOffset = Math.floor(Math.random() * 30);
      const randomHour = Math.floor(Math.random() * 12) + 8; // 8h às 20h
      const randomMinute = Math.random() < 0.5 ? 0 : 30;

      const matchDate = new Date();
      matchDate.setDate(matchDate.getDate() + randomDayOffset);
      matchDate.setHours(randomHour, randomMinute, 0, 0);

      const sport = sports[Math.floor(Math.random() * sports.length)];
      const homeTeamName = teams[Math.floor(Math.random() * teams.length)];
      let awayTeamName = teams[Math.floor(Math.random() * teams.length)];
      while (awayTeamName === homeTeamName) {
        awayTeamName = teams[Math.floor(Math.random() * teams.length)];
      }

      this.mockMatches.push({
        id: i,
        tournament: `${sport.name} Universitário 2025`,
        sport: sport.name,
        sportIcon: sport.icon,
        sportColor: sport.color,
        date: matchDate,
        time: `${randomHour.toString().padStart(2, '0')}:${randomMinute.toString().padStart(2, '0')}`,
        homeTeam: {
          id: i * 2,
          name: `Atlética ${homeTeamName}`,
          shortName: homeTeamName.substring(0, 3),
          logo: `assets/teams/${homeTeamName.toLowerCase()}.png`,
          university: homeTeamName,
          colors: {primary: '#0066cc', secondary: '#ffffff'}
        },
        awayTeam: {
          id: i * 2 + 1,
          name: `Atlética ${awayTeamName}`,
          shortName: awayTeamName.substring(0, 3),
          logo: `assets/teams/${awayTeamName.toLowerCase()}.png`,
          university: awayTeamName,
          colors: {primary: '#cc0000', secondary: '#ffffff'}
        },
        venue: venues[Math.floor(Math.random() * venues.length)],
        status: 'scheduled',
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low'
      });
    }
  }

  // Métodos utilitários
  private isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDay(date, today);
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }
}
