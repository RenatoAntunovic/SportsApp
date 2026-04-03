import { Team } from './team.model';

export interface Player {
  id?: number;
  name: string;
  position: string;
  age: number;
  nationality: string;
  photoUrl: string;
  team?: Team;
}
