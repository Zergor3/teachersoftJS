/* Author: Mitsuo
 * 
 * Desc.:  Lista de profesores que va dentro del AccordionDetails
 */
import React, { useState } from 'react'
import { Typography, Box, Paper } from '@mui/material'
import { Grid, Divider, Avatar } from '@mui/material'
import { Controls } from '../../../components/controls/Controls'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Popup from '../../../components/util/Popup'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


function generateRow(docente) {
  let tipoDoc = 1;
    switch (docente.tipo_docente){
    case 1:
      tipoDoc = "TC"
      break;  //Se pasa a otro mapeo - ya que no corresponde como profesor
    case 2:
      tipoDoc = "TPC"
      break;
    case 3:
      tipoDoc = "TPA"
      break;
    default:
      tipoDoc = "No asignado";
      break;  //Se pasa a otro mapeo - ya que no corresponde como profesor
    }
    return (
        <Grid >
            <Grid container>
                <Grid item xs={1}>
                  <Avatar>
                      {docente.foto_URL !== ("static/images/avatar/1.jpg" || "")
                        ? <img height = "125%" width = "125%" text-align ="center" alt = "" 
                          src={docente.foto_URL}></img>
                        :  <AccountCircleIcon/>}
                  </Avatar>
                </Grid>
                <Grid item xs={3}>
                    <Typography>
                        {`${docente.nombres}, ${docente.apellidos}`}
                    </Typography>
                    <Typography variant="body2" color="darkGray">
                        {docente.codigo_pucp}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography >
                        {docente.seccion.nombre}
                    </Typography>
                    <Typography variant="body2" color="darkGray">
                        {tipoDoc}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography display="inline">
                        Carga del ciclo: {"\n"}
                    </Typography>
                    <Typography display="inline" color="#41B9E4">
                        {docente.cargaDocente} horas
                    </Typography>
                    <Typography color="red">
                        Deuda horaria: {docente.deuda_docente} horas
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default function AccordionDetailsHorarioProfesor(props) {
    let { sesiones , horario} = props;
    sesiones = horario.sesiones;
    const [openEditarClasesPopup, setOpenEditarClasesPopup] = useState(false)
    const [openEditarPracticasPopup, setOpenEditarPracticasPopup] = useState(false)
    const [actHorario, setActHorario] = useState(horario);

    const seleccionarDocentesP = seleccionadosP => {
        console.log(seleccionadosP)
    }

    const clase = sesiones.filter((ses)=>ses.secuencia===0)
    //if(!clase.sesion_docentes) clase.sesion_docentes = []
    const laboratorio = sesiones.filter((ses)=>ses.secuencia===1)
    //if(!laboratorio.sesion_docentes) laboratorio.sesion_docentes = []
      //console.log("clase: ", clase, "laboratorio: ", laboratorio);
    return (
        <>
            <Paper elevation={1} sx={{p: 1}}>
              {clase[0] ?
                <Grid container>
                    <Grid item xs={10}>
                        <Typography
                            variant="h4"
                            py="4px"
                            color="primary"
                        >
                            Lista de Docentes de Clases
                        </Typography>
                    </Grid>
                </Grid>
              : <Grid container></Grid> }
              {clase[0] ? clase[0].sesion_docentes.map(sesion_dic => generateRow(sesion_dic.docente)): []}
                {laboratorio[0] ?
                  <Grid container>
                      <Grid item xs={10}>
                          <Typography
                              variant="h4"
                              py="4px"
                              color="primary"
                          >
                              Lista de Docentes de Laboratorios
                          </Typography>
                      </Grid>
                  </Grid>
                  : <Grid container></Grid> }
                  {laboratorio[0] ? laboratorio[0].sesion_docentes.map(sesion_dic => generateRow(sesion_dic.docente)) : []}
              </Paper>
        </>
    )
}
