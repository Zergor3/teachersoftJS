import React from "react";
import { Box } from "@mui/material";

import { MenuAdministrador } from "./MenuAdministrador";
import UserPage from "../../pages/General/UserPage";
import { MenuAsistenteSeccion } from "./MenuAsistenteSeccion";
import { styled } from "@mui/material/styles";

import Header1 from '../../constants/Header1'
import Header2 from '../../constants/Header2'
import DrawerAdmin from '../../constants/DrawerAdmin'

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(8.2, 8),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

/* esto antes estaba en el UserPage */
function BoxPadding(props) {
  return (
    /* Content Body (aka. AppMain) (lo que tiene el fondito de la ardillita) */
    <Box
      component="main"
      /* fill remainder of body */
      width={1}
      // flexGrow={1}   // unnecessary
      // bottom="0px"
      p={2}
      overflow="auto"   // grow with content
      /* fondo y ardillita loca */
      // transform='translateZ(0)'
      sx={{
        backgroundColor: "#ffffff",
        // backgroundImage:'url("assets/img/ardillaloca.svg"), url("assets/img/rayaslocas.svg")',
        backgroundImage: 'url("assets/img/fondoDT.svg")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom right',
        // backgroundSize:'30%',
        backgroundSize: 'contain',
      }}
    >
      <DrawerHeader />  {/* SOLAMENTE UN DIV PARA HACER MARGIN TOP, 
                            codigo repetido en HeaderUser */}
      {props.children}
    </Box>
  )
}

export default function HeaderUser(props) {
  /* Del usuario logueado */
  const { nombre, idRol, foto } = props
  /* estado del Drawer */
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  let rol     // rolname
  let listaMenu = [];
  if (idRol == 0) {
    rol = "Administrador"
    listaMenu = MenuAdministrador
  }
  if (idRol == 1) {
    rol = "Asistente de Sección"
    listaMenu = MenuAsistenteSeccion
  }
  if (idRol == 2) {
    rol = "Coordinador de Sección"
    listaMenu = MenuAsistenteSeccion
  }

  return (
    /* Box principal de toda la aplicacion */
    <Box
      display="flex"
      top="0px"
      bottom="0px"
      width="100%"
    >
      {/*Header Azul*/}
      <Header1 />
      {/*Header de Información de usuario*/}
      <Header2 foto={foto} nombre={nombre} idRol={idRol} 
        rol={rol}
        handleDrawerOpen={handleDrawerOpen}
      />
      {/* SideBar (aka. Navbar, aka. Drawer) */}
      <DrawerAdmin 
        open={open} listaMenu={listaMenu}
      />
      {/* Router de Paginas pasa el prop */}
      <BoxPadding>
        {props.pagina}
      </BoxPadding>
    </Box>
  );
};
