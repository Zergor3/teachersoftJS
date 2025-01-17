import React, {useContext} from 'react'
import { Box } from '@mui/system'
import { Grid, Paper, Typography } from '@mui/material'
import ContentHeader from '../../components/AppMain/ContentHeader'
import { Controls } from '../../components/controls/Controls'
import { DT } from '../../components/DreamTeam/DT'
import Header1 from '../../constants/Header1'
import AtenderSolicitudForm from './AtenderSolicitudForm'
import DetalleSoliOrganism from './DetalleSoliOrganism'
import ResultadoSolicitud from './ResultadoSolicitud'
import HeaderSimple from '../../constants/HeaderSimple'


import * as MesaPartesService from '../../services/mesaPartesService'
import * as DTLocalServices from '../../services/DTLocalServices'
import * as EmailService from '../../services/emailService'
import { UserContext } from '../../constants/UserContext'
import Notification from '../../components/util/Notification'

export default function ExternoAtenderSolicitud(props) {
    const { solicitud, setSolicitud } = props
    
    const { user,rol} = useContext(UserContext);
    const [atender, setAtender]= React.useState(false)
    const PaperStyle = { borderRadius: '20px', pb: 4, pt: 2, px: 2, color: "primary.light", elevatio: 0 }
    
    const [notify, setNotify] = React.useState({ 
        isOpen: false, message: '', type: '' 
    })

    React.useEffect(() => {
        //Hacer el buscar solicitud con el ID del url
    }, [])

    React.useEffect(() => {
        console.log("solicitud actualizada: ", solicitud)
        if (solicitud.estado === '3' && solicitud.cambioEstado) {
            MesaPartesService.updateSolicitud(solicitud)
                .then(id => {
                    setNotify({
                        isOpen: true,
                        message: 'Registro de atencion exitoso',
                        type: 'success'
                    })
                    setAtender(false)
                    /* Send notification to solicitador */
                    // sendEmailNotification(solicitud)
                    EmailService.sendemailMP(solicitud, 'delegado,atiende')
                })
                .catch(err => {
                    /* error :( */
                    console.error(err)
                    console.log("Error: submitAtencion:", 
                        MesaPartesService.f2bSolicitud(solicitud))
                    setNotify({
                        isOpen: true,
                        message: 'Estamos teniendo problemas de conexión.  Consulte a un administrador.',
                        type: 'error'
                    })
                })
        }
    }, [solicitud])
    
    function submitAtencion(atencion) {
        // console.log("submitAtencion", solicitud, atencion)
        setSolicitud(solicitud => ({
            ...solicitud, 
            /* data faltante de la respuesta de soli por Secretario Dpto. */
            delegadoID: user.persona.id,
            /* ANTES DECIA DELGADO!!!!! */
            // delgado: {
            delegado: {
                fullName: user.persona.nombres + " " + user.persona.apellidos,
                foto_URL: user.persona.foto_URL,
                rolName: DTLocalServices.getRolName(rol)
            },
            estado: '3',
            tracking: {
                ...solicitud.tracking,
                fecha_atendido: new Date().toJSON()
            },
            observacion: atencion.observacion,
            resultado: atencion.resultadoID,
            /* only for FrontEnd */
            cambioEstado: true
        }))
    }

    return (
        <>
            <Header1/>
            {/* <HeaderSimple /> */}
            <Paper sx={{my: 20, mx: 10, p: 5}}>
                <DT.Title size="medium" text={"Bienvenido"}/>
                <Typography>
                    Ingrese la respuesta a la solicitud
                </Typography>
            {/* Encabezado y boton de regreso */}
            <ContentHeader
                text="Mesa de Partes - Detalle de la solicitud"
                cbo={false}
            />
            
            <Paper variant="outlined" sx={PaperStyle}>
                {/* Tabla de solicitud y tracking */}
                <DetalleSoliOrganism solicitud={solicitud}/>
                {/* Posibilidades de Atención
                    - Secretaria de Sección(rol=6) -> Boton Atender y Delegar
                    - Usuarios Delegado (rol!=6) -> Boton Atender
                */}
                
                {/* Respuesta */}
                { solicitud.resultado!=0? 
                    <ResultadoSolicitud solicitud={solicitud}/> :
                    atender? 
                        <AtenderSolicitudForm 
                            setAtender={setAtender}
                            solicitud={solicitud}
                            submitAtencion={submitAtencion}
                        /> :
                        /* ACCIONES */
                        <Box  mr={"210px"} mt={2} mb={2} sx={{display: "flex", justifyContent: 'flex-end'}}> 
                            <Controls.Button
                                text="Atender"
                                type="submit"   // html property (not component)
                                onClick={() => {setAtender(true)}}
                            />
                        </Box>
                    
                }
            </Paper>
            <Notification notify={notify} setNotify={setNotify} />
       
            </Paper>
        </>
    )
}
