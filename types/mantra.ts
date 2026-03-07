export interface MantraLine {
  line: string;
  indent: number;
}

export type Mantra = MantraLine[];

export interface MantraPageItem {
  id: string;
  pageNumber: number;
  mantra: Mantra;
}
