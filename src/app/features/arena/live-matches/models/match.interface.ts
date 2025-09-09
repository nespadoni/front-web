export interface Match {
  id: string;
  tournament: Tournament;
  sport: Sport;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
  status: MatchStatus;
  startTime: Date;
  venue?: string;
  period: string; // "1º Tempo", "2º Set", "3º Quarto", etc.
  minute?: number;
  highlights: Highlight[];
  isFollowing: boolean;
  priority: MatchPriority;
}

export interface Tournament {
  id: string;
  name: string;
  logo?: string;
  category: 'championship' | 'cup' | 'league' | 'friendly';
}

export interface Sport {
  id: string;
  name: string;
  icon: string; // emoji ou classe CSS
  color: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  university: string;
  atletica: string;
}

export interface Score {
  home: number;
  away: number;
  sets?: number[]; // Para esportes com sets
  quarters?: number[]; // Para esportes com quarters
}

export interface Highlight {
  id: string;
  type: 'goal' | 'card' | 'substitution' | 'point' | 'timeout';
  minute: number;
  team: 'home' | 'away';
  player?: string;
  description: string;
  timestamp: Date;
}

export type MatchStatus = 'scheduled' | 'live' | 'halftime' | 'finished' | 'postponed';
export type MatchPriority = 'high' | 'medium' | 'low';

export interface MatchFilters {
  sport?: string[];
  tournament?: string[];
  university?: string[];
  status?: MatchStatus[];
  searchTerm?: string;
}
