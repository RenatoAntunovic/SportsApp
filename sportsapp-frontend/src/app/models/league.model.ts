import { Sport } from "./sport.model";

export interface League{
    id?:number;
    name: string;
    country:string;
    logoUrl:string;
    sport? : Sport;
}