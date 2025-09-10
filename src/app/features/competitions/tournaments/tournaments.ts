import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-tournaments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tournaments.html',
  styleUrl: './tournaments.scss'
})
export class TournamentsComponent {
  // Filtros disponíveis
  sports = [
    {id: 0, name: 'Todos os Esportes', icon: 'fas fa-globe'},
    {id: 1, name: 'Futebol', icon: 'fas fa-futbol'},
    {id: 2, name: 'Basquete', icon: 'fas fa-basketball-ball'},
    {id: 3, name: 'Vôlei', icon: 'fas fa-volleyball-ball'},
    {id: 4, name: 'Tênis', icon: 'fas fa-table-tennis-paddle-ball'}
  ];

  universities = [
    {id: 0, name: 'Todas as Universidades'},
    {id: 1, name: 'USP'},
    {id: 2, name: 'UNESP'},
    {id: 3, name: 'UNICAMP'},
    {id: 4, name: 'PUC-SP'},
    {id: 5, name: 'Mackenzie'}
  ];

  // Filtros selecionados
  selectedSport = 0;
  selectedUniversity = 0;

  // Torneio em destaque
  featuredTournament = {
    id: 1,
    name: 'Copa Universitária de Futebol 2024',
    description: 'O maior campeonato universitário de futebol do Brasil está de volta! Participe da competição mais emocionante do ano.',
    sport: 'Futebol',
    sportIcon: 'fas fa-futbol',
    logo: 'assets/tournaments/copa-universitaria.png',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-06-30'),
    status: 'active',
    participants: 32,
    universities: 16,
    prize: 'R$ 50.000',
    banner: 'assets/banners/copa-universitaria-banner.jpg'
  };

  // Lista de torneios
  tournaments = [
    {
      id: 2,
      name: 'Liga Brasileira de Basquete Universitário',
      sport: 'Basquete',
      sportIcon: 'fas fa-basketball-ball',
      logo: 'assets/tournaments/liga-basquete.png',
      university: 'USP',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-07-15'),
      status: 'upcoming',
      participants: 24,
      description: 'Campeonato nacional de basquete entre universidades.'
    },
    {
      id: 3,
      name: 'Torneio de Vôlei Feminino',
      sport: 'Vôlei',
      sportIcon: 'fas fa-volleyball-ball',
      logo: 'assets/tournaments/volei-feminino.png',
      university: 'UNICAMP',
      startDate: new Date('2024-02-10'),
      endDate: new Date('2024-03-10'),
      status: 'finished',
      participants: 16,
      description: 'Competição exclusiva para equipes femininas de vôlei.'
    },
    {
      id: 4,
      name: 'Copa de Tênis Individual',
      sport: 'Tênis',
      sportIcon: 'fas fa-table-tennis-paddle-ball',
      logo: 'assets/tournaments/tenis-copa.png',
      university: 'PUC-SP',
      startDate: new Date('2024-05-20'),
      endDate: new Date('2024-06-20'),
      status: 'upcoming',
      participants: 64,
      description: 'Torneio individual de tênis para atletas universitários.'
    },
    {
      id: 5,
      name: 'Campeonato Paulista Universitário',
      sport: 'Futebol',
      sportIcon: 'fas fa-futbol',
      logo: 'assets/tournaments/paulista.png',
      university: 'UNESP',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-04-30'),
      status: 'active',
      participants: 20,
      description: 'Tradicional campeonato de futebol do estado de São Paulo.'
    },
    {
      id: 6,
      name: 'Liga de Basquete 3x3',
      sport: 'Basquete',
      sportIcon: 'fas fa-basketball-ball',
      logo: 'assets/tournaments/basquete-3x3.png',
      university: 'Mackenzie',
      startDate: new Date('2024-04-15'),
      endDate: new Date('2024-05-15'),
      status: 'upcoming',
      participants: 32,
      description: 'Modalidade street basketball com equipes de 3 jogadores.'
    }
  ];

  // Método para obter torneios filtrados
  get filteredTournaments() {
    return this.tournaments.filter(tournament => {
      const sportMatch = this.selectedSport === 0 ||
        this.sports.find(s => s.id === this.selectedSport)?.name === tournament.sport;

      const universityMatch = this.selectedUniversity === 0 ||
        this.universities.find(u => u.id === this.selectedUniversity)?.name === tournament.university;

      return sportMatch && universityMatch;
    });
  }

  // Métodos para filtros
  onSportChange(sportId: number) {
    this.selectedSport = sportId;
    // Aqui você filtraria os torneios baseado no esporte
  }

  onUniversityChange(universityId: number) {
    this.selectedUniversity = universityId;
    // Aqui você filtraria os torneios baseado na universidade
  }

  // Método para obter classe do status
  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'upcoming':
        return 'status-upcoming';
      case 'finished':
        return 'status-finished';
      default:
        return '';
    }
  }

  // Método para obter texto do status
  getStatusText(status: string): string {
    switch (status) {
      case 'active':
        return 'Em Andamento';
      case 'upcoming':
        return 'Em Breve';
      case 'finished':
        return 'Finalizado';
      default:
        return '';
    }
  }

  // Método para formatar data
  formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // TrackBy function para performance
  trackByTournamentId(index: number, tournament: any): number {
    return tournament.id;
  }
}
