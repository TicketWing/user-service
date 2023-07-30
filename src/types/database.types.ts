export type Options = {
  key?: string;
  cacheable?: boolean;
  conditions?: {
    [key: string]: string;
  };
  select?: string[];
  exclude?: string[];
} & ({ cacheable: boolean; key?: string } | { cacheable?: never; key?: never });
