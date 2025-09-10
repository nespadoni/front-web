export interface CalendarMatch {
  id: number;
  tournament: string;
  sport: string;
  sportIcon: string;
  sportColor: string;
  date: Date;
  time: string;
  homeTeam: Team;
  awayTeam: Team;
  venue: string;
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
  priority: 'high' | 'medium' | 'low';
  attendance?: number;
  maxAttendance?: number;
  description?: string;
  streamUrl?: string;
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  university: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  hasMatches: boolean;
  matchCount: number;
  matches: CalendarMatch[];
  isWeekend: boolean;
  isHoliday?: boolean;
  holidayName?: string;
}

export interface CalendarStats {
  totalMatchesThisMonth: number;
  todayMatches: number;
  upcomingMatches: number;
  activeTournaments: number;
  followedTeams: number;
}
