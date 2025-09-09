import {Injectable} from '@angular/core';
import {BehaviorSubject, interval, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Match, MatchFilters, Sport, Tournament} from '../models/match.interface';

@Injectable({
  providedIn: 'root'
})
export class LiveMatchesService {
  private matchesSubject = new BehaviorSubject<Match[]>([]);
  private filtersSubject = new BehaviorSubject<MatchFilters>({});

  // Simulação de dados (substitua por chamadas HTTP)
  private mockMatches: Match[] = [
    {
      id: '1',
      tournament: {id: '1', name: 'Copa Universitária 2024', category: 'cup'},
      sport: {id: 'football', name: 'Futebol', icon: '⚽', color: '#4CAF50'},
      homeTeam: {
        id: '1',
        name: 'Atlética UFRJ',
        shortName: 'UFRJ',
        logo: '/assets/images/teams/ufrj.png',
        university: 'UFRJ',
        atletica: 'Atlética UFRJ'
      },
      awayTeam: {
        id: '2',
        name: 'Atlética USP',
        shortName: 'USP',
        logo: '/assets/images/teams/usp.png',
        university: 'USP',
        atletica: 'Atlética USP'
      },
      score: {home: 2, away: 1},
      status: 'live',
      startTime: new Date(Date.now() - 45 * 60000), // 45min ago
      venue: 'Estádio Universitário',
      period: '2º Tempo',
      minute: 67,
      highlights: [
        {
          id: '1',
          type: 'goal',
          minute: 23,
          team: 'home',
          player: 'João Silva',
          description: 'Gol de João Silva',
          timestamp: new Date(Date.now() - 10000)
        },
        {
          id: '2',
          type: 'goal',
          minute: 34,
          team: 'away',
          player: 'Pedro Santos',
          description: 'Gol de Pedro Santos',
          timestamp: new Date(Date.now() - 5000)
        },
        {
          id: '3',
          type: 'card',
          minute: 58,
          team: 'home',
          player: 'Carlos Lima',
          description: 'Cartão amarelo para Carlos Lima',
          timestamp: new Date()
        }
      ],
      isFollowing: false,
      priority: 'high'
    },
    {
      id: '2',
      tournament: {id: '2', name: 'Liga Universitária Basquete', category: 'league'},
      sport: {id: 'basketball', name: 'Basquete', icon: '🏀', color: '#FF9800'},
      homeTeam: {
        id: '3',
        name: 'Atlética PUC-Rio',
        shortName: 'PUC',
        logo: '/assets/images/teams/puc.png',
        university: 'PUC-Rio',
        atletica: 'Atlética PUC-Rio'
      },
      awayTeam: {
        id: '4',
        name: 'Atlética UFF',
        shortName: 'UFF',
        logo: '/assets/images/teams/uff.png',
        university: 'UFF',
        atletica: 'Atlética UFF'
      },
      score: {home: 78, away: 82},
      status: 'live',
      startTime: new Date(Date.now() - 35 * 60000),
      period: '4º Quarto',
      minute: 8,
      highlights: [
        {
          id: '4',
          type: 'point',
          minute: 5,
          team: 'away',
          player: 'Miguel Oliveira',
          description: 'Cesta de 3 pontos',
          timestamp: new Date()
        }
      ],
      isFollowing: true,
      priority: 'medium'
    },
    {
      id: '3',
      tournament: {id: '3', name: 'Campeonato de Vôlei', category: 'championship'},
      sport: {id: 'volleyball', name: 'Vôlei', icon: '🏐', color: '#2196F3'},
      homeTeam: {
        id: '5',
        name: 'Atlética UERJ',
        shortName: 'UERJ',
        logo: '/assets/images/teams/uerj.jpg',
        university: 'UERJ',
        atletica: 'Atlética UERJ'
      },
      awayTeam: {
        id: '6',
        name: 'Atlética UNIRIO',
        shortName: 'UNIRIO',
        logo: '/assets/images/teams/unirio.png',
        university: 'UNIRIO',
        atletica: 'Atlética UNIRIO'
      },
      score: {home: 2, away: 1, sets: [25, 23, 18]},
      status: 'finished',
      startTime: new Date(Date.now() - 120 * 60000),
      venue: 'Ginásio Central',
      period: 'Final',
      highlights: [],
      isFollowing: false,
      priority: 'low'
    }
  ];

  constructor() {
    this.matchesSubject.next(this.mockMatches);

    // Simula atualizações em tempo real (a cada 30s)
    interval(30000).pipe(
      startWith(0)
    ).subscribe(() => {
      this.updateLiveMatches();
    });
  }

  getMatches(): Observable<Match[]> {
    return this.matchesSubject.asObservable();
  }

  getFilteredMatches(): Observable<Match[]> {
    return this.matchesSubject.pipe(
      map(matches => this.applyFilters(matches))
    );
  }

  setFilters(filters: MatchFilters): void {
    this.filtersSubject.next(filters);
  }

  getFilters(): Observable<MatchFilters> {
    return this.filtersSubject.asObservable();
  }

  toggleFollowMatch(matchId: string): void {
    const matches = this.matchesSubject.value.map(match =>
      match.id === matchId ? {...match, isFollowing: !match.isFollowing} : match
    );
    this.matchesSubject.next(matches);
  }

  getSports(): Observable<Sport[]> {
    const sports: Sport[] = [
      {id: 'football', name: 'Futebol', icon: '⚽', color: '#4CAF50'},
      {id: 'basketball', name: 'Basquete', icon: '🏀', color: '#FF9800'},
      {id: 'volleyball', name: 'Vôlei', icon: '🏐', color: '#2196F3'},
      {id: 'handball', name: 'Handebol', icon: '🤾', color: '#9C27B0'}
    ];
    return new BehaviorSubject(sports).asObservable();
  }

  getTournaments(): Observable<Tournament[]> {
    const tournaments: Tournament[] = [
      {id: '1', name: 'Copa Universitária 2024', category: 'cup'},
      {id: '2', name: 'Liga Universitária Basquete', category: 'league'},
      {id: '3', name: 'Campeonato de Vôlei', category: 'championship'}
    ];
    return new BehaviorSubject(tournaments).asObservable();
  }

  private applyFilters(matches: Match[]): Match[] {
    const filters = this.filtersSubject.value;

    return matches.filter(match => {
      if (filters.sport?.length && !filters.sport.includes(match.sport.id)) {
        return false;
      }

      if (filters.tournament?.length && !filters.tournament.includes(match.tournament.id)) {
        return false;
      }

      if (filters.status?.length && !filters.status.includes(match.status)) {
        return false;
      }

      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const searchableText = `${match.homeTeam.name} ${match.awayTeam.name} ${match.tournament.name}`.toLowerCase();
        if (!searchableText.includes(term)) {
          return false;
        }
      }

      return true;
    });
  }

  private updateLiveMatches(): void {
    const matches = this.matchesSubject.value.map(match => {
      if (match.status === 'live' && match.minute) {
        // Simula progresso do tempo
        const newMinute = Math.min(match.minute + Math.floor(Math.random() * 3), 90);
        return {...match, minute: newMinute};
      }
      return match;
    });

    this.matchesSubject.next(matches);
  }
}
