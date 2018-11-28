import Dashboard from "layouts/Dashboard/Dashboard.jsx";
import Initial from "layouts/Initial/Initial.jsx";
import Login from "layouts/Login/Login.jsx";
import Signup from "layouts/Signup/Signup.jsx"
import Chores from "../views/Chores/Chores";
import ParkingSchedule from "../views/ParkingSchedule/ParkingSchedule.jsx";

var indexRoutes = [
    { path: "/dashboard", name: "Home", component: Dashboard}, 
    { path: "/login", name: "Login", component: Login },
    { path: "/signup", name: "Signup", component: Signup},
    { path: "/chores", name: "Chores", component: Chores },
    { path: "/parkingschedule", name: "Parking Schedule", component: ParkingSchedule }
];

export default indexRoutes;
