
export interface MetricData {
  name: string;
  value: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface SystemAlert {
  id: string;
  level: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
}

export interface SecurityLog {
  id: string;
  location: string;
  event: string;
  time: string;
  status: 'normal' | 'alert';
}

export enum TwinMode {
  OVERVIEW = 'OVERVIEW',
  ENERGY = 'ENERGY',
  SECURITY = 'SECURITY'
}

export interface ChartDataPoint {
  time: string;
  value: number;
  value2?: number;
  name?: string; // Added for category charts
}
