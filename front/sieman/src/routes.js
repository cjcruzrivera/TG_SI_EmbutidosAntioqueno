/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in Administrador copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Tables from "layouts/tables";

// Implemented pages
import Dashboard from "pages/dashboard";

// Usuarios pages
import Usuarios from "pages/usuarios";
import CreateUsuarios from "pages/usuarios/create";
import EditUsuarios from "pages/usuarios/edit";

// Materias Primas pages
import MateriasPrimas from "pages/materias-primas";
import CreateMateriasPrimas from "pages/materias-primas/create";
import EditMateriasPrimas from "pages/materias-primas/edit";

// Productos pages
import Productos from "pages/productos";
import CreateProductos from "pages/productos/create";
import EditProductos from "pages/productos/edit";

//Ordenes de Compra pages
import OrdenesCompra from "pages/ordenes-compra";
import CreateOrdenCompra from "pages/ordenes-compra/create";

//Compras pages
import Compras from "pages/compras";
import CreateCompras from "pages/compras/create";

//Recepciones pages
import Recepciones from "pages/recepciones";
import CreateRecepcion from "pages/recepciones/create";

//Modulo de Produccion Pages
import OrdenesTrabajo from "pages/ordenes-trabajo";
import CreateOrdenTrabajo from "pages/ordenes-trabajo/create";
import Producciones from "pages/producciones";

//Modulo de Ventas Pages
import Ventas from "pages/ventas";
import Remisiones from "pages/remisiones";
import CreateRemision from "pages/remisiones/create";

//Reportes pages
import Inventario from "pages/reportes/inventario";
import ReporteProducciones from "pages/reportes/producciones";
import ReporteVentas from "pages/reportes/ventas";

// @mui icons
import Icon from "@mui/material/Icon";

const allRoles = [
  "Administrador",
  "Secretaria Administrativa",
  "Auxiliar Contable",
  "Operario de Produccion",
  "Operario de Alistamiento",
  "Operario de Ventas",
];
// TODO: define routes and roles by module and make parametrizable
const routes = [
  //DASHBOARD
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    roles: allRoles,
    component: <Dashboard />,
  },
  //MODULO DE CONFIGURACION
  {
    type: "divider",
    key: "divider-config",
    roles: ["Administrador", "Auxiliar Contable"],
  },
  {
    type: "title",
    key: "title-config",
    title: "Configuración",
    roles: ["Administrador", "Auxiliar Contable"],
  },
  {
    type: "collapse",
    name: "Usuarios",
    key: "usuarios",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/usuarios",
    roles: ["Administrador", "Auxiliar Contable"],
    component: <Usuarios />,
  },
  {
    type: "collapse",
    name: "Materias Primas",
    key: "materias-primas",
    icon: <Icon fontSize="small">bento</Icon>,
    route: "/materias-primas",
    roles: ["Administrador", "Auxiliar Contable"],
    component: <MateriasPrimas />,
  },
  {
    type: "collapse",
    name: "Productos",
    key: "productos",
    icon: <Icon fontSize="small">all_inbox</Icon>,
    route: "/productos",
    roles: ["Administrador", "Auxiliar Contable"],
    component: <Productos />,
  },
  //MODULO DE COMPRAS
  {
    type: "divider",
    key: "divider-compras",
    roles: [
      "Administrador",
      "Auxiliar Contable",
      "Secretaria Administrativa",
      "Operario de Alistamiento",
    ],
  },
  {
    type: "title",
    key: "title-compras",
    title: "Módulo de Compras",
    roles: [
      "Administrador",
      "Auxiliar Contable",
      "Secretaria Administrativa",
      "Operario de Alistamiento",
    ],
  },
  {
    type: "collapse",
    name: "Ordenes de Compra",
    key: "ordenes-compra",
    icon: <Icon fontSize="small">shopping_cart</Icon>,
    route: "/ordenes-compra",
    roles: ["Administrador", "Auxiliar Contable", "Secretaria Administrativa"],
    component: <OrdenesCompra />,
  },
  {
    type: "collapse",
    name: "Compras",
    key: "compras",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/compras",
    roles: [
      "Administrador",
      "Auxiliar Contable",
      "Secretaria Administrativa",
      "Operario de Alistamiento",
    ],
    component: <Compras />,
  },
  {
    type: "collapse",
    name: "Recepciones",
    key: "recepciones",
    icon: <Icon fontSize="small">move_to_inbox</Icon>,
    route: "/recepciones",
    roles: [
      "Administrador",
      "Auxiliar Contable",
      "Secretaria Administrativa",
      "Operario de Alistamiento",
    ],
    component: <Recepciones />,
  },
  //MODULO DE PRODUCCION
  {
    type: "divider",
    key: "divider-produccion",
    roles: ["Administrador", "Operario de Produccion", "Secretaria Administrativa"],
  },
  {
    type: "title",
    key: "title-produccion",
    title: "Módulo de Producción",
    roles: ["Administrador", "Operario de Produccion", "Secretaria Administrativa"],
  },
  {
    type: "collapse",
    name: "Ordenes de Trabajo",
    key: "ordenes-trabajo",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/ordenes-trabajo",
    roles: ["Administrador", "Operario de Produccion", "Secretaria Administrativa"],
    component: <OrdenesTrabajo />,
  },
  {
    type: "collapse",
    name: "Producciones",
    key: "producciones",
    icon: <Icon fontSize="small">engineering</Icon>,
    route: "/producciones",
    roles: ["Administrador", "Operario de Produccion", "Secretaria Administrativa"],
    component: <Producciones />,
  },
  //MODULO DE VENTAS
  {
    type: "divider",
    key: "divider-ventas",
    roles: [
      "Administrador",
      "Auxiliar Contable",
      "Secretaria Administrativa",
      "Operario de Ventas",
    ],
  },
  {
    type: "title",
    key: "title-ventas",
    title: "Módulo de Ventas",
    roles: [
      "Administrador",
      "Auxiliar Contable",
      "Secretaria Administrativa",
      "Operario de Ventas",
    ],
  },
  {
    type: "collapse",
    name: "Remisiones",
    key: "remisiones",
    icon: <Icon fontSize="small">assignment_turned_in</Icon>,
    route: "/remisiones",
    roles: [
      "Administrador",
      "Auxiliar Contable",
      "Secretaria Administrativa",
      "Operario de Ventas",
    ],
    component: <Remisiones />,
  },
  {
    type: "collapse",
    name: "Ventas",
    key: "ventas",
    icon: <Icon fontSize="small">attach_money</Icon>,
    route: "/ventas",
    roles: [
      "Administrador",
      "Auxiliar Contable",
      "Secretaria Administrativa",
      "Operario de Ventas",
    ],
    component: <Ventas />,
  },
  //MODULO DE REPORTES
  {
    type: "divider",
    key: "divider-reportes",
    roles: allRoles,
  },
  {
    type: "title",
    key: "title-reportes",
    title: "Reportes",
    roles: allRoles,
  },
  {
    type: "collapse",
    name: "Inventario",
    key: "inventario",
    icon: <Icon fontSize="small">inventory</Icon>,
    route: "/inventario",
    roles: allRoles,
    component: <Inventario />,
  },
  {
    type: "collapse",
    name: "Ventas por Producto",
    key: "reporte-ventas",
    icon: <Icon fontSize="small">bar_chart</Icon>,
    route: "/reporte-ventas",
    roles: ["Administrador", "Auxiliar Contable", "Operario de Ventas"],
    component: <ReporteVentas />,
  },
  {
    type: "collapse",
    name: "Prods por Producto",
    key: "reporte-producciones",
    icon: <Icon fontSize="small">trending_up</Icon>,
    route: "/reporte-producciones",
    roles: ["Administrador", "Auxiliar Contable", "Operario de Produccion"],
    component: <ReporteProducciones />,
  },
  // RUTAS SIN MENU, SOLO PARA ACCESO POR URL
  {
    type: "route",
    key: "edicion-usuario",
    route: "/usuarios/editar/:id",
    roles: ["Administrador", "Auxiliar Contable"],
    component: <EditUsuarios />,
  },
  {
    type: "route",
    key: "creacion-usuario",
    route: "/usuarios/crear",
    roles: ["Administrador", "Auxiliar Contable"],
    component: <CreateUsuarios />,
  },
  {
    type: "route",
    key: "edicion-materias-primas",
    route: "/materias-primas/editar/:id",
    roles: ["Administrador", "Auxiliar Contable"],
    component: <EditMateriasPrimas />,
  },
  {
    type: "route",
    key: "creacion-materias-primas",
    route: "/materias-primas/crear",
    roles: ["Administrador", "Auxiliar Contable"],
    component: <CreateMateriasPrimas />,
  },
  {
    type: "route",
    key: "edicion-productos",
    route: "/productos/editar/:id",
    roles: ["Administrador", "Auxiliar Contable"],
    component: <EditProductos />,
  },
  {
    type: "route",
    key: "creacion-productos",
    route: "/productos/crear",
    roles: ["Administrador", "Auxiliar Contable"],
    component: <CreateProductos />,
  },
  {
    type: "route",
    key: "creacion-orden-compra",
    route: "/ordenes-compra/crear",
    roles: [
      "Administrador",
      "Auxiliar Contable",
      "Secretaria Administrativa",
      "Operario de Alistamiento",
    ],
    component: <CreateOrdenCompra />,
  },
  {
    type: "route",
    key: "creacion-compra",
    route: "/compras/crear/:id_orden",
    roles: [
      "Administrador",
      "Auxiliar Contable",
      "Secretaria Administrativa",
      "Operario de Alistamiento",
    ],
    component: <CreateCompras />,
  },
  {
    type: "route",
    key: "creacion-recepcion",
    route: "/recepciones/crear/:id_compra",
    roles: [
      "Administrador",
      "Auxiliar Contable",
      "Secretaria Administrativa",
      "Operario de Alistamiento",
    ],
    component: <CreateRecepcion />,
  },
  {
    type: "route",
    key: "creacion-orden-trabajo",
    route: "/ordenes-trabajo/crear",
    roles: ["Administrador", "Operario de produccion"],
    component: <CreateOrdenTrabajo />,
  },
  {
    type: "route",
    key: "creacion-remision",
    route: "/remisiones/crear",
    roles: ["Administrador", "Auxiliar Contable", "Operario de venta"],
    component: <CreateRemision />,
  },
];

export default routes;
