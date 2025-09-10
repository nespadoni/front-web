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

  // Universidades disponíveis com suas imagens reais
  private availableTeams = [
    {
      name: 'PUC-Rio',
      shortName: 'PUC',
      logo: 'assets/images/teams/puc.png',
      colors: {primary: '#1a365d', secondary: '#ffd700'}
    },
    {
      name: 'UERJ',
      shortName: 'UERJ',
      logo: 'assets/images/teams/uerj.jpg',
      colors: {primary: '#dc2626', secondary: '#ffffff'}
    },
    {
      name: 'UFF',
      shortName: 'UFF',
      logo: 'assets/images/teams/uff.png',
      colors: {primary: '#059669', secondary: '#ffffff'}
    },
    {
      name: 'UFRJ',
      shortName: 'UFRJ',
      logo: 'assets/images/teams/ufrj.png',
      colors: {primary: '#0066cc', secondary: '#ffffff'}
    },
    {
      name: 'UNIRIO',
      shortName: 'UNI',
      logo: 'assets/images/teams/unirio.png',
      colors: {primary: '#7c3aed', secondary: '#ffffff'}
    },
    {
      name: 'USP',
      shortName: 'USP',
      logo: 'assets/images/teams/usp.png',
      colors: {primary: '#1e40af', secondary: '#fbbf24'}
    }
  ];

  // Mock data - com datas atuais e imagens reais
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
        name: 'Atlética USP',
        shortName: 'USP',
        logo: 'assets/images/teams/usp.png',
        university: 'USP',
        colors: {primary: '#1e40af', secondary: '#fbbf24'}
      },
      awayTeam: {
        id: 2,
        name: 'Atlética UFRJ',
        shortName: 'UFRJ',
        logo: 'assets/images/teams/ufrj.png',
        university: 'UFRJ',
        colors: {primary: '#0066cc', secondary: '#ffffff'}
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
        name: 'PUC-Rio Tigers',
        shortName: 'PUC',
        logo: 'assets/images/teams/puc.png',
        university: 'PUC-Rio',
        colors: {primary: '#1a365d', secondary: '#ffd700'}
      },
      awayTeam: {
        id: 4,
        name: 'UERJ Lions',
        shortName: 'UERJ',
        logo: 'assets/images/teams/uerj.jpg',
        university: 'UERJ',
        colors: {primary: '#dc2626', secondary: '#ffffff'}
      },
      venue: 'Ginásio Central PUC-Rio',
      status: 'scheduled',
      priority: 'high',
      attendance: 0,
      maxAttendance: 2500,
      description: 'Clássico carioca entre duas potências universitárias'
    },
    {
      id: 3,
      tournament: 'Campeonato Estadual de Vôlei',
      sport: 'Vôlei',
      sportIcon: 'fas fa-volleyball-ball',
      sportColor: '#a855f7',
      date: new Date('2025-09-16T18:00:00'),
      time: '18:00',
      homeTeam: {
        id: 5,
        name: 'UFF Sharks',
        shortName: 'UFF',
        logo: 'assets/images/teams/uff.png',
        university: 'UFF',
        colors: {primary: '#059669', secondary: '#ffffff'}
      },
      awayTeam: {
        id: 6,
        name: 'UNIRIO Eagles',
        shortName: 'UNI',
        logo: 'assets/images/teams/unirio.png',
        university: 'UNIRIO',
        colors: {primary: '#7c3aed', secondary: '#ffffff'}
      },
      venue: 'Ginásio de Esportes UFF',
      status: 'scheduled',
      priority: 'medium',
      description: 'Duelo entre vizinhos de Niterói'
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
      followedTeams: this.availableTeams.length
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
      {name: 'Atletismo', icon: 'fas fa-running', color: '#84cc16'},
      {name: 'Natação', icon: 'fas fa-swimmer', color: '#0891b2'},
      {name: 'Tênis', icon: 'fas fa-table-tennis-paddle-ball', color: '#65a30d'}
    ];

    const venues = [
      'Arena Universitária Central', 'Ginásio Poliesportivo', 'Campo de Futebol Principal',
      'Quadra Coberta', 'Centro Esportivo', 'Complexo Aquático',
      'Estádio João Havelange', 'Ginásio do Maracanãzinho', 'Arena Carioca',
      'Centro de Educação Física', 'Quadra Externa', 'Piscina Olímpica'
    ];

    // Gerar jogos para os próximos 30 dias
    for (let i = 4; i <= 50; i++) {
      const randomDayOffset = Math.floor(Math.random() * 30);
      const randomHour = Math.floor(Math.random() * 12) + 8; // 8h às 20h
      const randomMinute = Math.random() < 0.5 ? 0 : 30;

      const matchDate = new Date();
      matchDate.setDate(matchDate.getDate() + randomDayOffset);
      matchDate.setHours(randomHour, randomMinute, 0, 0);

      const sport = sports[Math.floor(Math.random() * sports.length)];

      // Selecionar times aleatórios das universidades disponíveis
      const homeTeam = this.availableTeams[Math.floor(Math.random() * this.availableTeams.length)];
      let awayTeam = this.availableTeams[Math.floor(Math.random() * this.availableTeams.length)];

      // Garantir que não seja o mesmo time
      while (awayTeam.name === homeTeam.name) {
        awayTeam = this.availableTeams[Math.floor(Math.random() * this.availableTeams.length)];
      }

      // Nomes de modalidades esportivas variadas
      const modalityNames = [
        'Masculino', 'Feminino', 'Misto', 'Sub-21', 'Principal',
        'A', 'B', 'Veteranos', 'Iniciantes', 'Avançado'
      ];

      const homeModalityName = modalityNames[Math.floor(Math.random() * modalityNames.length)];
      const awayModalityName = modalityNames[Math.floor(Math.random() * modalityNames.length)];

      this.mockMatches.push({
        id: i,
        tournament: `${sport.name} Universitário RJ 2025`,
        sport: sport.name,
        sportIcon: sport.icon,
        sportColor: sport.color,
        date: matchDate,
        time: `${randomHour.toString().padStart(2, '0')}:${randomMinute.toString().padStart(2, '0')}`,
        homeTeam: {
          id: i * 2,
          name: `${homeTeam.name} ${homeModalityName}`,
          shortName: homeTeam.shortName,
          logo: homeTeam.logo,
          university: homeTeam.name,
          colors: homeTeam.colors
        },
        awayTeam: {
          id: i * 2 + 1,
          name: `${awayTeam.name} ${awayModalityName}`,
          shortName: awayTeam.shortName,
          logo: awayTeam.logo,
          university: awayTeam.name,
          colors: awayTeam.colors
        },
        venue: venues[Math.floor(Math.random() * venues.length)],
        status: Math.random() > 0.8 ? 'live' : 'scheduled',
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
        attendance: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : undefined,
        maxAttendance: Math.floor(Math.random() * 3000) + 500,
        description: `Confronto entre ${homeTeam.name} e ${awayTeam.name} no ${sport.name}`
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
