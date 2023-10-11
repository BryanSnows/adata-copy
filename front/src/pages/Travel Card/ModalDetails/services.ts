import Api from "../../../services/Api";
import { IFilter } from "./types";

export async function TravelCardSituation(serial: number | undefined) {
  const request = await Api.get(`travel-card/situation/${serial}`);

  return request?.data as IFilter[];
}

