/* Author: Gabriela
 * 
 * Se muestran "Mis Solicitudes".  Desde aqui se puede:
 * - Generar una nueva solicitud.
 * - Ver detalle de una solicitud.
 * "/doc/misSolicitudes"
 */
import React, { useState } from 'react'
import * as MesaPartesService from '../../services/mesaPartesService'
//Iconos Mesa de Partes
import DashboardSoli from './DashboardSoli'

/* function createData(id, asunto, descripcion, fecha, autorNombre, estado) {
    return {
        id, asunto, descripcion, fecha, autorNombre, estado
    }
}
const usuarios2 = [
    createData('0', 'Solicitud Descarga 2019', 'Se estima los siguientes docentes ...', '2021-09-30 01:14 pm', 'Caceres', '0'),
    createData('1', 'Solicitud Descarga 2021', 'Se estima los siguientes docentes ...', '2021-09-30 01:14 pm', 'Caceres', '1'),
    createData('2', 'Solicitud Descarga 2020', 'Se estima los siguientes docentes ...', '2021-09-30 01:14 pm', 'Caceres', '2'),
    createData('3', 'Solicitud Descarga 2020', 'Se estima los siguientes docentes ...', '2021-09-30 01:14 pm', 'Caceres', '3'),
    createData('4', 'Solicitud Descarga 2020', 'Se estima los siguientes docentes ...', '2021-09-30 01:14 pm', 'Caceres', '3'),
]
 */

function getSolicitudes(setRecords, departamentoID) {
            //FUNCIONES
    //MesaPartesService.getSolicitudesByDep(3) 
    //MesaPartesService.getSolicitudesByIdDel(44) 
    //MesaPartesService.getSolicitud(33)
    //MesaPartesService.getSolicitudesByIdSol(user.id)
    //MesaPartesService.getSolicitudes() 
    // console.log(user)
    MesaPartesService.getSolicitudesByDep(departamentoID) 
        .then(data => {
            data = data ?? []       // fixes el error raro de mala conexion
            data.sort((x1, x2) => 
                0 - (new Date(x1.tracking.fecha_enviado) - new Date(x2.tracking.fecha_enviado)))
            setRecords(data)
        })
}

//Para todos los usuarios (excepto Secretaria con ROL = 6)
export default function MisSolicitudes() {
    const [records, setRecords] = useState([])

    React.useEffect(() => {
        /* se deberia mandar user.departamento.id */
        getSolicitudes(setRecords, 3)
    }, [])

    return (
        <DashboardSoli title={"Solicitudes Generales a Mesa de Partes"} 
            delegado={true} 
            records={records} setRecords={setRecords} getSolicitudes={getSolicitudes}
            // user={user}    /* FIXME */
        />
    )
}

