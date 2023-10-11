import { IShift } from "../../interfaces/IGlobal";
import Api from "../Api";


export async function getShift(id: number | undefined) {
  const request = await Api.get(`shift/${id}`);

  return request.data as IShift;
}
