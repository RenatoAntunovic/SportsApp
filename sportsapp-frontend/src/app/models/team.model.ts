import { League } from "./league.model";
import { Sport } from "./sport.model";

export interface Team{
     id?:number;
     name:string;
     logoUrl:string;
     country:string;
     league?:League;
     sport?:Sport;
}