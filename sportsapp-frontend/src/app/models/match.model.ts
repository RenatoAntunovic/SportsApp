import { Team } from './team.model';
import { League } from './league.model';

export interface Match {
  id?: number;
  homeTeam?: Team;
  awayTeam?: Team;
  league?: League;
  matchDate: string;
  homeScore: number;
  awayScore: number;
  status: string;
}
