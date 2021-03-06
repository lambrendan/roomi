import Dashboard from "views/Dashboard/Dashboard";
import BillsAndPayments from "../views/BillsAndPayments/BillsAndPayments";
import ParkingSchedule from "../views/ParkingSchedule/ParkingSchedule";
import Rules from "../views/Rules/Rules";
import Chores from "../views/Chores/Chores";
import ShoppingList from "../views/ShoppingList/ShoppingList";
import Reminders from "../views/Reminders/Reminders";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard
  },
  {
    path: "/dashboard/billsandpayments",
    name: "Bills and Payments",
    component: BillsAndPayments,
  },
  {
    path: "/dashboard/parkingschedule",
    name: "Parking Schedule",
    component: ParkingSchedule,
  },
  {
    path: "/dashboard/rules",
    name: "Rules",
    component: Rules,
  },
  {
    path: "/dashboard/chores",
    name: "Chores",
    component: Chores,
  },
  {
    path: "/dashboard/shoppinglist",
    name: "Shopping List",
    component: ShoppingList,
  },
  {
    path: "/dashboard/reminders",
    name: "Reminder",
    component: Reminders,
  },
  { redirect: true, path: "/", to: "/dashboard", name: "Dashboard" }
];

export default dashboardRoutes;
