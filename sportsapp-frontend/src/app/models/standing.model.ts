import { Team } from './team.model';
import { League } from './league.model';

export interface Standing {
  id?: number;
  team?: Team;
  league?: League;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  position: number;
}
