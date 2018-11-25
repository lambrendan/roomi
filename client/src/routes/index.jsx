import Dashboard from "layouts/Dashboard/Dashboard.jsx";
import Initial from "layouts/Initial/Initial.jsx";
import Login from "layouts/Login/Login.jsx";
import Signup from "layouts/Signup/Signup.jsx"
import BillsAndPayments from "../views/BillsAndPayments/BillsAndPayments";
import ParkingSchedule from "../views/ParkingSchedule/ParkingSchedule";
import Rules from "../views/Rules/Rules";
import Chores from "../views/Chores/Chores";
import ShoppingList from "../views/ShoppingList/ShoppingList";
import Polls from "../views/Polls/Polls";

const indexRoutes = [
    { path: "/dashboard", name: "Home", component: Dashboard }, 
    { path: "/billsandpayments", name: "Bills and Payments", component: BillsAndPayments},
    { path: "/parkingschedule", name: "Parking Schedule", component: ParkingSchedule },
    { path: "/rules", name: "Rules", component: Rules },
    { path: "/chores", name: "Chores", component: Chores },
    { path: "/shoppinglist", name: "Shopping List", component: ShoppingList, },
    { path: "/polls", name: "Polls", component: Polls, },
    { path: "/login", name: "Login", component: Login },
    { path: "/signup", name: "Signup", component: Signup}
];

export default indexRoutes;
