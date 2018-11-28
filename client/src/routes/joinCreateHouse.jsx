import InitHousehold from "layouts/InitHousehold/InitHousehold.jsx";
import JoinHousehold from "layouts/JoinHousehold/JoinHousehold.jsx";


var initHouseIndexRoutes = [
    { path: "/initHouse/createHouse", name: "Init", component: InitHousehold},
    { path: "/initHouse/joinHouse", name: "Join", component: JoinHousehold}
];

export default initHouseIndexRoutes;
