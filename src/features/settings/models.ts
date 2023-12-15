export type ColorScheme = 'light' | 'dark';


export interface AllSettings {
  channel?: string;
  colorScheme?: ColorScheme;
  commandPrefix?: string;
  disabledCategory?: string[];

  enabledProviders?: string[];

  clipLimit?: number | null;
  layout?: string;
}
