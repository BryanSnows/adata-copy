import { IOffice } from "../../interfaces/IGlobal";
import Api from "../Api";


export async function getOffice(id: number | undefined) {
  const request = await Api.get(`office/${id}`);

  return request.data as IOffice;
}
