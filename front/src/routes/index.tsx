import {
  Routes as RoutesWrapper,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { Layout } from '../components/Layout';
import { AccessControl } from '../pages/AcessControl';
import { Dashboard } from '../pages/Dashboard';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { NotFound } from '../pages/NotFound';
import { Occupation } from '../pages/Occupation';
import { Productivity } from '../pages/Productivity';
import { Cabinet } from '../pages/Register/Cabinet';
import { NewCabinet } from '../pages/Register/Cabinet/NewCabinet';
import { Mst } from '../pages/Register/Mst';
import { SNList } from '../pages/SNList';
import { TravelCard } from '../pages/Travel Card';
import { Office } from '../pages/UserManagement/Office';
import { NewOffice } from '../pages/UserManagement/Office/NewOffice';
import { Shift } from '../pages/UserManagement/Shift';
import { NewShift } from '../pages/UserManagement/Shift/NewShift';
import { Users } from '../pages/UserManagement/Users';
import { NewUser } from '../pages/UserManagement/Users/NewUser';
import { PrivateRoute } from './PrivateRoute';
import { AccessControlTransactions } from './transaction-enums/access-control.transaction';
import { DashboardTransactions } from './transaction-enums/dashboard.transaction';
import { FpyMstTransactions } from './transaction-enums/fpy-chamber.transactions';
import { OccupationTransactions } from './transaction-enums/occupation.transactions';
import { ProductivityTransactions } from './transaction-enums/productivity.transactions';
import { RegisterTransactions } from './transaction-enums/register.transaction';
import { SNListTransactions } from './transaction-enums/sn-list.transaction copy';
import { TravelCardTransactions } from './transaction-enums/travel-card.transactions';
import { NewMst } from '../pages/Register/Mst/NewMst';
import { FPYMst } from '../pages/FPY-Mst';
import { FaultySlots } from '../pages/FaultySlots';
import { NewDefect } from '../pages/FaultySlots/NewDefect';
import { DetailCabinet } from '../pages/FaultySlots/DetailCabinet';
import { ResendSerials } from '../pages/Serials/ResendSerials';
import { SlotsDefectTransactions } from './transaction-enums/slots-defect.transaction';
import { SerialTransactions } from './transaction-enums/resend-serials.transaction';
import { FailureCollection } from '../pages/Serials/FailureCollection';

export function Routes() {
  const SidebarLayout = () => (
    <>
      <Layout>
        <Outlet />
      </Layout>
    </>
  );
  return (
    <>
      <RoutesWrapper>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route element={<SidebarLayout />}>
          <Route path="/home" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute transactions={[DashboardTransactions.RESOURCE]} />
            }
          >
            <Route path="" element={<Dashboard />} />
          </Route>
          <Route
            path="/travel-card"
            element={
              <PrivateRoute transactions={[TravelCardTransactions.RESOURCE]} />
            }
          >
            <Route path="" element={<TravelCard />} />
          </Route>
          <Route
            path="/fpy-mst"
            element={
              <PrivateRoute transactions={[FpyMstTransactions.RESOURCE]} />
            }
          >
            <Route path="" element={<FPYMst />} />
          </Route>
          <Route
            path="/productivity"
            element={
              <PrivateRoute
                transactions={[ProductivityTransactions.RESOURCE]}
              />
            }
          >
            <Route path="" element={<Productivity />} />
          </Route>
          <Route
            path="/occupation"
            element={
              <PrivateRoute transactions={[OccupationTransactions.RESOURCE]} />
            }
          >
            <Route path="" element={<Occupation />} />
          </Route>

          <Route
            path="/faulty-slots"
            element={
              <PrivateRoute transactions={[SlotsDefectTransactions.RESOURCE]} />
            }
          >
            <Route path="" element={<FaultySlots />} />
            <Route path="new" element={<NewDefect />} />
            <Route path=":id" element={<DetailCabinet />} />
          </Route>
          <Route
            path="/snlist"
            element={
              <PrivateRoute transactions={[SNListTransactions.RESOURCE]} />
            }
          >
            <Route path="" element={<SNList />} />
          </Route>
          <Route
            path="/register"
            element={
              <PrivateRoute transactions={[RegisterTransactions.RESOURCE]} />
            }
          >
            <Route path="/register/cabinet">
              <Route path="" element={<Cabinet />} />
              <Route path="new" element={<NewCabinet />} />
            </Route>

            <Route path="/register/Mst">
              <Route path="" element={<Mst />} />
              <Route path="new" element={<NewMst />} />
            </Route>

            {/* <Route path="/register/fixtures" element={<Fixtures />} /> */}
          </Route>
          <Route
            path="/user-management"
            element={
              <PrivateRoute
                transactions={[AccessControlTransactions.RESOURCE]}
              />
            }
          >
            <Route path="users">
              <Route path="" element={<Users />} />
              <Route path="new" element={<NewUser />} />
            </Route>

            <Route path="shift">
              <Route path="" element={<Shift />} />
              <Route path="new-shift" element={<NewShift />} />
            </Route>

            <Route path="office">
              <Route path="" element={<Office />} />
              <Route path="new-office" element={<NewOffice />} />
            </Route>
          </Route>
          <Route
            path="/access-control"
            element={
              <PrivateRoute
                transactions={[AccessControlTransactions.RESOURCE]}
              />
            }
          >
            <Route path="" element={<AccessControl />} />
          </Route>
          <Route
            path="/serials"
            element={
              <PrivateRoute transactions={[SerialTransactions.RESOURCE]} />
            }
          >
            <Route path="resend-serials" element={<ResendSerials />} />
            <Route path="failure-collection" element={<FailureCollection />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </RoutesWrapper>
    </>
  );
}
