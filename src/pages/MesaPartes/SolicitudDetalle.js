/* Author: Manuel
 *
 * Detalle de una solicitud.
 * URL: localhost:3000/doc/solicitudDetalle
 */
import { Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import React, {useContext} from 'react'
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import ContentHeader from '../../components/AppMain/ContentHeader';
import { Controls } from '../../components/controls/Controls';
import { UserContext } from '../../constants/UserContext';
import DetalleSoliOrganism from './DetalleSoliOrganism';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box } from '@mui/system';
import { DT } from '../../components/DreamTeam/DT';
import ResultadoSolicitud from './ResultadoSolicitud';


export default function SolicitudDetalle() {
    const location= useLocation()
    const {solicitud}=location.state
    const { rol} = useContext(UserContext);
    const PaperStyle = { borderRadius: '20px', pb: 4, pt: 2, px: 2, color: "primary.light", elevatio: 0 }

    return (
        <>
            {/* Encabezado y boton de regreso */}
            <ContentHeader
                text="Mesa de Partes - Detalle de la solicitud"
                cbo={false}
            />
            <Grid
                container
                ml={-1}
                mr={0}
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
            >
            <Grid item xs={6} md={1} mb={3}>
                <Link to={'/doc/misSolicitudes'}  style={{ textDecoration: 'none' }}> 
                    <Controls.Button
                        variant="outlined"
                        text="Regresar"
                        size="small"
                        startIcon={<ArrowBackIcon />}
                    />
                </Link>
            </Grid>
            </Grid>
            <Paper variant="outlined" sx={PaperStyle}>
                {/* Tabla de solicitud y tracking */}
                <DetalleSoliOrganism solicitud={solicitud}/>
                {/* Respuesta */}
                { solicitud.resultado==0? <> </>:
                    <ResultadoSolicitud solicitud={solicitud}/>
                }
            </Paper>
        </>
    )
}
