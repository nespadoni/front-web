import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './matches.html',
  styleUrl: './matches.scss'
})
export class MatchesComponent {
  // Filtros disponíveis
  tournaments = [
    {id: 0, name: 'Todos os Torneios'},
    {id: 1, name: 'Copa Universitária de Futebol'},
    {id: 2, name: 'Liga de Basquete Universitário'},
    {id: 3, name: 'Campeonato de Vôlei'},
    {id: 4, name: 'Torneio de Tênis'}
  ];

  sports = [
    {id: 0, name: 'Todos os Esportes', icon: 'fas fa-globe'},
    {id: 1, name: 'Futebol', icon: 'fas fa-futbol'},
    {id: 2, name: 'Basquete', icon: 'fas fa-basketball-ball'},
    {id: 3, name: 'Vôlei', icon: 'fas fa-volleyball-ball'},
    {id: 4, name: 'Tênis', icon: 'fas fa-table-tennis-paddle-ball'}
  ];

  // Filtros selecionados
  selectedTournament = 0;
  selectedSport = 0;

  // Jogos ao vivo em destaque
  liveMatches = [
    {
      id: 1,
      tournament: 'Copa Universitária de Futebol',
      sport: 'Futebol',
      sportIcon: 'fas fa-futbol',
      homeTeam: {
        name: 'USP',
        logo: 'assets/teams/usp.png',
        score: 2
      },
      awayTeam: {
        name: 'UNICAMP',
        logo: 'assets/teams/unicamp.png',
        score: 1
      },
      status: 'live',
      minute: 67,
      period: '2º Tempo',
      venue: 'Estádio Universitário'
    },
    {
      id: 2,
      tournament: 'Liga de Basquete',
      sport: 'Basquete',
      sportIcon: 'fas fa-basketball-ball',
      homeTeam: {
        name: 'PUC-SP',
        logo: 'assets/teams/puc.png',
        score: 78
      },
      awayTeam: {
        name: 'Mackenzie',
        logo: 'assets/teams/mackenzie.png',
        score: 82
      },
      status: 'live',
      minute: 8,
      period: '4º Quarto',
      venue: 'Ginásio Central'
    }
  ];

  // Lista completa de jogos
  allMatches = [
    {
      id: 3,
      tournament: 'Copa Universitária de Futebol',
      sport: 'Futebol',
      sportIcon: 'fas fa-futbol',
      homeTeam: {
        name: 'UNESP',
        logo: 'assets/teams/unesp.png',
        score: null
      },
      awayTeam: {
        name: 'Santos',
        logo: 'assets/teams/santos.png',
        score: null
      },
      status: 'scheduled',
      startTime: new Date('2024-03-15T15:30:00'),
      venue: 'Campo Universitário'
    },
    {
      id: 4,
      tournament: 'Campeonato de Vôlei',
      sport: 'Vôlei',
      sportIcon: 'fas fa-volleyball-ball',
      homeTeam: {
        name: 'USP Feminino',
        logo: 'assets/teams/usp.png',
        score: 3
      },
      awayTeam: {
        name: 'UNICAMP Feminino',
        logo: 'assets/teams/unicamp.png',
        score: 1
      },
      status: 'finished',
      startTime: new Date('2024-03-10T18:00:00'),
      venue: 'Ginásio de Esportes'
    },
    {
      id: 5,
      tournament: 'Liga de Basquete',
      sport: 'Basquete',
      sportIcon: 'fas fa-basketball-ball',
      homeTeam: {
        name: 'FGV',
        logo: 'assets/teams/fgv.png',
        score: null
      },
      awayTeam: {
        name: 'Insper',
        logo: 'assets/teams/insper.png',
        score: null
      },
      status: 'scheduled',
      startTime: new Date('2024-03-16T20:00:00'),
      venue: 'Quadra Coberta'
    },
    {
      id: 6,
      tournament: 'Torneio de Tênis',
      sport: 'Tênis',
      sportIcon: 'fas fa-table-tennis-paddle-ball',
      homeTeam: {
        name: 'Rafael Silva',
        logo: 'assets/players/rafael.png',
        score: 2
      },
      awayTeam: {
        name: 'Carlos Mendes',
        logo: 'assets/players/carlos.png',
        score: 0
      },
      status: 'finished',
      startTime: new Date('2024-03-12T14:00:00'),
      venue: 'Quadra de Tênis 1'
    },
    {
      id: 7,
      tournament: 'Copa Universitária de Futebol',
      sport: 'Futebol',
      sportIcon: 'fas fa-futbol',
      homeTeam: {
        name: 'Corinthians',
        logo: 'assets/teams/corinthians.png',
        score: null
      },
      awayTeam: {
        name: 'Palmeiras',
        logo: 'assets/teams/palmeiras.png',
        score: null
      },
      status: 'scheduled',
      startTime: new Date('2024-03-17T16:00:00'),
      venue: 'Arena Universitária'
    }
  ];

  // Método para obter jogos filtrados
  get filteredMatches() {
    return this.allMatches.filter(match => {
      const tournamentMatch = this.selectedTournament === 0 ||
        this.tournaments.find(t => t.id === this.selectedTournament)?.name === match.tournament;

      const sportMatch = this.selectedSport === 0 ||
        this.sports.find(s => s.id === this.selectedSport)?.name === match.sport;

      return tournamentMatch && sportMatch;
    });
  }

  // Métodos para filtros
  onTournamentChange(tournamentId: number) {
    this.selectedTournament = tournamentId;
  }

  onSportChange(sportId: number) {
    this.selectedSport = sportId;
  }

  // Método para obter classe do status
  getStatusClass(status: string): string {
    switch (status) {
      case 'live':
        return 'status-live';
      case 'scheduled':
        return 'status-scheduled';
      case 'finished':
        return 'status-finished';
      default:
        return '';
    }
  }

  // Método para obter texto do status
  getStatusText(status: string): string {
    switch (status) {
      case 'live':
        return 'AO VIVO';
      case 'scheduled':
        return 'AGENDADO';
      case 'finished':
        return 'FINALIZADO';
      default:
        return '';
    }
  }

  // Método para formatar data e hora
  formatDateTime(date: Date): string {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Método para formatar apenas hora
  formatTime(date: Date): string {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // TrackBy functions para performance
  trackByMatchId(index: number, match: any): number {
    return match.id;
  }
}
