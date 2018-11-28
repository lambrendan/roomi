import InitHousehold from "layouts/InitHousehold/InitHousehold.jsx";
import JoinHousehold from "layouts/JoinHousehold/JoinHousehold.jsx";


var initHouseIndexRoutes = [
    { path: "/createHouse", name: "Init", component: InitHousehold},
    { path: "/joinHouse", name: "Join", component: JoinHousehold},
];

export default initHouseIndexRoutes;
