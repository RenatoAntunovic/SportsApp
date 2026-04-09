import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class LandingComponent {

  liveMatches = [
    { league: 'Premier League', live: true, minute: 67, home: 'Man City', homeAbbr: 'MC', homeScore: 2, homeColor: '#1e3a5f', homeTextColor: '#4a9eff', away: 'Arsenal', awayAbbr: 'AR', awayScore: 1, awayColor: '#3d1a1a', awayTextColor: '#ff4444' },
    { league: 'La Liga', live: true, minute: 34, home: 'Real Madrid', homeAbbr: 'RM', homeScore: 0, homeColor: '#1a2d5a', homeTextColor: '#4466ff', away: 'Barcelona', awayAbbr: 'BA', awayScore: 0, awayColor: '#2a1a3a', awayTextColor: '#aa44ff' },
    { league: 'NBA', live: false, minute: null, home: 'LA Lakers', homeAbbr: 'LAL', homeScore: 112, homeColor: '#1a2a4a', homeTextColor: '#4488ff', away: 'Boston', awayAbbr: 'BOS', awayScore: 98, awayColor: '#1a3a2a', awayTextColor: '#44cc88' },
  ];

 sports = [
  {
    name: 'Fudbal', count: '24 lige', active: true,
    bg: 'rgba(0,212,170,0.1)', color: '#00d4aa',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.45 14.25l-2.1-2.1-1.4 1.4-1.05-1.05 1.4-1.4-1.05-1.05 2.1-2.1 1.05 1.05-1.4 1.4 1.05 1.05 1.4-1.4 2.1 2.1-2.1 2.1zm5.15-8.5l-2.1 2.1 1.05 1.05 1.4-1.4 1.05 1.05-1.4 1.4 1.05 1.05-2.1 2.1-2.1-2.1 1.05-1.05-1.4-1.4-1.05 1.05-2.1-2.1 2.1-2.1 1.05 1.05 1.4-1.4-1.05-1.05 2.1-2.1 2.1 2.1z'
  },
  {
    name: 'Košarka', count: '8 liga', active: false,
    bg: 'rgba(68,136,255,0.1)', color: '#4488ff',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4.07 12.5h3.5c.07 1.38.35 2.7.8 3.9C6.1 15.5 4.5 14.17 4.07 12.5zm0-1c.43-1.67 2.03-3 4.3-3.9-.45 1.2-.73 2.52-.8 3.9h-3.5zm7.43 5.43c-.7-.9-1.18-2.16-1.45-3.43h2.9c-.27 1.27-.75 2.53-1.45 3.43zm-1.45-4.43c.07-1.3.38-2.53.93-3.55.17-.03.35-.05.52-.05s.35.02.52.05c.55 1.02.86 2.25.93 3.55H10.05zm4.4 4.43c-.7-.9-1.18-2.16-1.45-3.43h2.9c-.27 1.27-.75 2.53-1.45 3.43zm1.68-4.43c-.07-1.38-.35-2.7-.8-3.9 2.27.9 3.87 2.23 4.3 3.9h-3.5zm-.88-4.9c-.45 1.2-.73 2.52-.8 3.9h-3.5c.07-1.38.35-2.7.8-3.9 1.1-.43 2.3-.6 3.5-.6-.34.18-.67.38-1 .6z'
  },
  {
    name: 'Tenis', count: '12 turnira', active: false,
    bg: 'rgba(255,170,44,0.1)', color: '#ffaa2c',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-8c0-1.1.4-2.1 1.05-2.87C8.72 9.84 9.35 10.5 10 11.13c-.6.6-1 1.38-1 2.25 0 .87.4 1.65 1 2.25-.65.63-1.28 1.29-1.95 2C8.4 16.89 7 15.1 7 12zm5.29 4.71L11 16.41c-.78-.78-.78-2.05 0-2.83L12.29 12l-1.29-1.59c-.78-.78-.78-2.05 0-2.83L12.29 6.3c.78-.78 2.05-.78 2.83 0l1.29 1.58c.78.78.78 2.05 0 2.83L15.12 12l1.29 1.58c.78.78.78 2.05 0 2.83l-1.29 1.59c-.39.39-.9.58-1.41.58s-1.03-.2-1.42-.59z'
  },
  {
    name: 'Boks', count: '5 liga', active: false,
    bg: 'rgba(255,68,68,0.1)', color: '#ff4444',
    icon: 'M18 8h-1V6c0-1.1-.9-2-2-2H8C6.9 4 6 4.9 6 6v2H5c-1.1 0-2 .9-2 2v3c0 1.66 1.34 3 3 3h1v2c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2h1c1.66 0 3-1.34 3-3v-3c0-1.1-.9-2-2-2zM8 6h8v2H8V6zm8 12H8v-2h8v2zm2-5c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-3h2v2h8v-2h2v3z'
  },
  {
    name: 'Hokej', count: '6 liga', active: false,
    bg: 'rgba(170,68,255,0.1)', color: '#aa44ff',
    icon: 'M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z'
  },
];

  tabs = [
    { label: 'Svi', active: true },
    { label: 'LIVE', active: false },
    { label: 'Predstojeći', active: false },
    { label: 'Završeni', active: false },
  ];

  todayMatches = [
    { league: 'Premier League', home: 'Man City', homeAbbr: 'MC', homeScore: 2, homeColor: '#1e3a5f', homeTextColor: '#4a9eff', away: 'Arsenal', awayAbbr: 'AR', awayScore: 1, awayColor: '#3d1a1a', awayTextColor: '#ff4444', live: true, minute: 67, finished: false, time: '' },
    { league: 'La Liga', home: 'Real Madrid', homeAbbr: 'RM', homeScore: 0, homeColor: '#1a2d5a', homeTextColor: '#4466ff', away: 'Barcelona', awayAbbr: 'BA', awayScore: 0, awayColor: '#2a1a3a', awayTextColor: '#aa44ff', live: true, minute: 34, finished: false, time: '' },
    { league: 'Bundesliga', home: 'Bayern', homeAbbr: 'BAY', homeScore: null, homeColor: '#2a1a1a', homeTextColor: '#ff6644', away: 'Dortmund', awayAbbr: 'BVB', awayScore: null, awayColor: '#1a2a1a', awayTextColor: '#44cc44', live: false, minute: null, finished: false, time: '20:45' },
    { league: 'NBA', home: 'LA Lakers', homeAbbr: 'LAL', homeScore: 112, homeColor: '#1a2a4a', homeTextColor: '#4488ff', away: 'Boston', awayAbbr: 'BOS', awayScore: 98, awayColor: '#1a3a2a', awayTextColor: '#44cc88', live: false, minute: null, finished: true, time: '' },
  ];

  setTab(selected: any) {
    this.tabs.forEach(t => t.active = false);
    selected.active = true;
  }
}