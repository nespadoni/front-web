export interface Tournament {
  id: number;
  name: string;
  sport: string;
  sportIcon: string;
  sportColor: string;
  logo: string;
  university: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'finished';
  description: string;
  location: string;
  participants: number;
  maxParticipants: number;
  prize: string;
  category: string;
  registrationDeadline?: Date;
}

export interface TournamentFilters {
  sport: number;
  university: number;
  status: string;
}
