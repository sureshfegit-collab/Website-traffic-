
export interface TrafficStats {
  url: string;
  monthlyVisits: string;
  bounceRate?: string;
  avgDuration?: string;
  countries: Array<{
    name: string;
    percentage: number;
    color?: string;
  }>;
  summary: string;
  sources: Array<{
    title: string;
    uri: string;
  }>;
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  data: TrafficStats | null;
}
