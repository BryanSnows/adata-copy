export interface IFpy {
  firstApproved: number;
  fpy: number;
  mst: string;
  totalTested: number;
  history: IHistory[] | null;
}

export interface IHistory {
  day: string;
  firstApproved: number;
  fpy: number;
  mst: string;
  totalTested: number;
}

export interface ITry {
  name: string;
  data: IData[];

}

export interface IData {
  day: string;
  fpy: number;

}