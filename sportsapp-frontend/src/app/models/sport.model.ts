export type SportType = 'FOOTBALL' | 'BASKETBALL' | 'HOCKEY' | 'TENNIS' | 'OTHER';

export interface Sport{
    id?:number;
    name:string;
    iconUrl:string;
    type? : SportType;
}