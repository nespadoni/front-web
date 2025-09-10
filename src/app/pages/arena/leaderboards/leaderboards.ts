import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-leaderboards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboards.html',
  styleUrl: './leaderboards.scss'
})
export class LeaderboardsComponent {
  // Filtros disponíveis
  tournaments = [
    {id: 1, name: 'Brasileirão 2024'},
    {id: 2, name: 'Champions League'},
    {id: 3, name: 'Copa do Mundo'}
  ];

  sports = [
    {id: 1, name: 'Futebol', icon: 'fas fa-futbol'},
    {id: 2, name: 'Basquete', icon: 'fas fa-basketball-ball'},
    {id: 3, name: 'Vôlei', icon: 'fas fa-volleyball-ball'}
  ];

  // Filtros selecionados
  selectedTournament = 1;
  selectedSport = 1;

  // Dados simulados para ranking de times
  teamsRanking = [
    {
      position: 1,
      name: 'Palmeiras',
      logo: 'assets/logos/palmeiras.png',
      points: 78,
      wins: 24,
      draws: 6,
      losses: 4,
      goalBalance: 45
    },
    {
      position: 2,
      name: 'Flamengo',
      logo: 'assets/logos/flamengo.png',
      points: 74,
      wins: 22,
      draws: 8,
      losses: 4,
      goalBalance: 38
    },
    {
      position: 3,
      name: 'São Paulo',
      logo: 'assets/logos/saopaulo.png',
      points: 68,
      wins: 20,
      draws: 8,
      losses: 6,
      goalBalance: 25
    },
    {
      position: 4,
      name: 'Corinthians',
      logo: 'assets/logos/corinthians.png',
      points: 65,
      wins: 19,
      draws: 8,
      losses: 7,
      goalBalance: 20
    },
    {
      position: 5,
      name: 'Santos',
      logo: 'assets/logos/santos.png',
      points: 62,
      wins: 18,
      draws: 8,
      losses: 8,
      goalBalance: 15
    }
  ];

  // Dados simulados para ranking de jogadores
  playersRanking = [
    {
      position: 1,
      name: 'Cristiano Silva',
      avatar: 'assets/avatars/player1.jpg',
      team: 'Palmeiras',
      goals: 28,
      assists: 12,
      points: 156
    },
    {
      position: 2,
      name: 'Gabriel Santos',
      avatar: 'assets/avatars/player2.jpg',
      team: 'Flamengo',
      goals: 24,
      assists: 15,
      points: 147
    },
    {
      position: 3,
      name: 'João Pedro',
      avatar: 'assets/avatars/player3.jpg',
      team: 'São Paulo',
      goals: 22,
      assists: 10,
      points: 132
    },
    {
      position: 4,
      name: 'Rafael Costa',
      avatar: 'assets/avatars/player4.jpg',
      team: 'Corinthians',
      goals: 20,
      assists: 14,
      points: 128
    },
    {
      position: 5,
      name: 'Lucas Oliveira',
      avatar: 'assets/avatars/player5.jpg',
      team: 'Santos',
      goals: 19,
      assists: 11,
      points: 119
    }
  ];

  // Métodos para filtros
  onTournamentChange(tournamentId: number) {
    this.selectedTournament = tournamentId;
    // Aqui você atualizaria os dados baseado no torneio selecionado
  }

  onSportChange(sportId: number) {
    this.selectedSport = sportId;
    // Aqui você atualizaria os dados baseado no esporte selecionado
  }

  // Método para obter classe de posição (medalhas)
  getPositionClass(position: number): string {
    switch (position) {
      case 1:
        return 'gold';
      case 2:
        return 'silver';
      case 3:
        return 'bronze';
      default:
        return '';
    }
  }

  // TrackBy functions para performance
  trackByTeamId(index: number, team: any): number {
    return team.position;
  }

  trackByPlayerId(index: number, player: any): number {
    return player.position;
  }
}
