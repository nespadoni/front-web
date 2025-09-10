import {Injectable} from '@angular/core';
import {Tournament} from '../interfaces/tournament.interface';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  private mockTournaments: Tournament[] = [
    {
      id: 1,
      name: 'Copa Universitária de Futebol 2025',
      sport: 'Futebol',
      sportIcon: 'fas fa-futbol',
      sportColor: '#22c55e',
      logo: 'assets/tournaments/copa-futebol.png',
      university: 'Multi-Universidades',
      startDate: new Date('2025-10-15'),
      endDate: new Date('2025-11-30'),
      status: 'upcoming',
      description: 'O maior campeonato de futebol universitário do país',
      location: 'Complexo Esportivo Central',
      participants: 24,
      maxParticipants: 32,
      prize: 'R$ 50.000 + Troféus',
      category: 'Masculino',
      registrationDeadline: new Date('2025-09-30')
    },
    {
      id: 2,
      name: 'Liga de Basquete Universitário',
      sport: 'Basquete',
      sportIcon: 'fas fa-basketball-ball',
      sportColor: '#f97316',
      logo: 'assets/tournaments/liga-basquete.png',
      university: 'UNIC',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-12-15'),
      status: 'active',
      description: 'Campeonato oficial de basquete entre universidades',
      location: 'Ginásio UNIC Arena',
      participants: 16,
      maxParticipants: 16,
      prize: 'R$ 30.000 + Medalhas',
      category: 'Misto'
    },
    {
      id: 3,
      name: 'Campeonato de Vôlei Feminino',
      sport: 'Vôlei',
      sportIcon: 'fas fa-volleyball-ball',
      sportColor: '#a855f7',
      logo: 'assets/tournaments/volei-feminino.png',
      university: 'USP',
      startDate: new Date('2025-08-01'),
      endDate: new Date('2025-08-30'),
      status: 'finished',
      description: 'Torneio exclusivo para equipes femininas',
      location: 'Ginásio USP',
      participants: 12,
      maxParticipants: 12,
      prize: 'R$ 20.000 + Troféus',
      category: 'Feminino'
    }
  ];

  getTournaments(): Tournament[] {
    return this.mockTournaments;
  }

  getFeaturedTournament(): Tournament {
    return this.mockTournaments.find(t => t.status === 'active') || this.mockTournaments[0];
  }

  getFilteredTournaments(filters: any): Tournament[] {
    return this.mockTournaments.filter(tournament => {
      const sportMatch = filters.sport === 0 || tournament.sport === this.getSportName(filters.sport);
      const universityMatch = filters.university === 0 || tournament.university === this.getUniversityName(filters.university);
      const statusMatch = !filters.status || filters.status === 'all' || tournament.status === filters.status;

      return sportMatch && universityMatch && statusMatch;
    });
  }

  private getSportName(sportId: number): string {
    const sports = ['', 'Futebol', 'Basquete', 'Vôlei', 'Tênis'];
    return sports[sportId] || '';
  }

  private getUniversityName(universityId: number): string {
    const universities = ['', 'USP', 'UNIC', 'UNICAMP', 'UNESP'];
    return universities[universityId] || '';
  }
}
