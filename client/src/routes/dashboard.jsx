import Dashboard from "views/Dashboard/Dashboard";
import BillsAndPayments from "../views/BillsAndPayments/BillsAndPayments";
import ParkingSchedule from "../views/ParkingSchedule/ParkingSchedule";
import Rules from "../views/Rules/Rules";
import Chores from "../views/Chores/Chores";
import ShoppingList from "../views/ShoppingList/ShoppingList";
import Polls from "../views/Polls/Polls";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard
  },
  {
    path: "/billsandpayments",
    name: "Bills and Payments",
    component: BillsAndPayments,
  },
  {
    path: "/parkingschedule",
    name: "Parking Schedule",
    component: ParkingSchedule,
  },
  {
    path: "/rules",
    name: "Rules",
    component: Rules,
  },
  {
    path: "/chores",
    name: "Chores",
    component: Chores,
  },
  {
    path: "/shoppinglist",
    name: "Shopping List",
    component: ShoppingList,
  },
  {
    path: "/polls",
    name: "Polls",
    component: Polls,
  },
  { redirect: true, path: "/", to: "/dashboard", name: "Dashboard" }
];

export default dashboardRoutes;
