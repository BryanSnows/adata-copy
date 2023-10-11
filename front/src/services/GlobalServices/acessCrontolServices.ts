import { IControlProfile } from "../../interfaces/IControlProfile";
import Api from "../Api";

export const fetchAccess = async () => {
  const request = await Api.get('access-control/profiles');

  return request.data as IControlProfile[];
};