import { Settings, OvertimeRate } from '../types';

export const DEFAULT_SETTINGS: Settings = {
  weeklyLegalHours: 35,
  rate25Threshold: 35,
  rate50Threshold: 43,
  hourlyRate: 0,
  companyName: '',
  employeeName: '',
};

export const OVERTIME_RATES: OvertimeRate[] = [
  { label: 'Majoration 25%', threshold: 35, rate: 1.25 },
  { label: 'Majoration 50%', threshold: 43, rate: 1.50 },
];

export const COLORS = {
  primary: '#1565C0',
  primaryLight: '#42A5F5',
  primaryDark: '#0D47A1',
  accent: '#FF6F00',
  success: '#2E7D32',
  warning: '#F57F17',
  error: '#C62828',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
};

export const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
