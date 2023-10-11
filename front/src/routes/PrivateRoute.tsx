import { RouteProps, Navigate, Outlet } from 'react-router-dom';
import { getDecodedToken, IAccessToken } from '../utils/auth';

type TPrivateRoute = {
  transactions: number[];
};

type TPrivateRouteExtended = TPrivateRoute & RouteProps;

export function isAllowedTransaction(transactionNumbers?: number[]): boolean {
  if (!transactionNumbers) {
    return true;
  }

  const decoded_access_token: IAccessToken = getDecodedToken();

  if (decoded_access_token?.profile_id === 1) {
    return true;
  }

  const userTransactions: number[] = decoded_access_token?.transactions;

  return userTransactions?.some((userTransaction) =>
    transactionNumbers.includes(userTransaction),
  );
}

export function PrivateRoute({ transactions, element }: TPrivateRouteExtended) {
  if (isAllowedTransaction(transactions)) {
    if (element) {
      return <>{element}</>;
    } else {
      return <Outlet />;
    }
  } else {
    return <Navigate to="/" />;
  }
}
