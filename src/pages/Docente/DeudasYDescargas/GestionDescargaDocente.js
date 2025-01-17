import React, {useState} from 'react'
/* ICONS */

import { Controls } from '../../../components/controls/Controls';
import { Grid, Typography, Divider } from '@mui/material';
import NuevaDescargaDocente from './NuevaDescargaDocente';
import Notification from '../../../components/util/Notification';
import Popup from '../../../components/util/Popup';
import ContentHeader from '../../../components/AppMain/ContentHeader';
import ListaDescargasPasadasDocente from './ListaDescargasPasadasDocente';
import ItemDescargaActualDocente from './ItemDecargaActualDocente'
import ItemDecargaVaciaDocente from './ItemDecargaVaciaDocente'
import { DT } from '../../../components/DreamTeam/DT';
import ResumenDocente from '../../../components/DreamTeam/ResumenDocente';
import { UserContext } from '../../../constants/UserContext';
import SolicitudDescargaForm from './SolicitudDescargaForm';

import procesoDescargaService from '../../../services/procesoDescargaService';
import tramiteDescargaService from '../../../services/tramiteDescargaService';
import ItemSinProcesoDocente from './ItemSinProcesoDocente';

export default function GestionDescargaDocente() {
    const [openPopup, setOpenPopup] = useState(false)
    const [openPopupDetalle, setOpenPopupDetalle] = useState(false)
    const [records, setRecords] = useState([])
    const [descargaActual, setDescargaActual] = useState(null)
    const [deleteData, setDeleteData] = useState(false)
    const [createData, setCreateData] = useState(false);
    const [updateData, setUpdateData] = useState(false);
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [notify, setNotify] = useState({isOpen: false, message: '', type: ''})
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subtitle: '' })
        
    const { user } = React.useContext(UserContext)
    const [procesoActivo, setProcesoActivo] = useState([])
    let procesoActivoNew

    const addOrEdit = async(values, resetForm) => {
        //Service
        let resultado, newTramite, editTramite;
        if(!recordForEdit){
            newTramite = {
                "ciclo": {
                    "id": window.localStorage.getItem("ciclo"),
                },
                "observacion": values.observacion,
                "procesoDescarga": {
                    "id": procesoActivo[procesoActivo.length - 1].id,
                },
                "tipo_bono": values.tipo_bono,
                "persona_seccion": null,
                "persona_departamento": null,
                "departamento": {
                    "id": user.persona.departamento.id,
                },
                "solicitador": {
                    "id": user.persona.id,
                }
            }
            await tramiteDescargaService.registerTramiteDescarga(newTramite)
        }else{
            editTramite = {
                "id": values.id,
                "ciclo": {
                    "id": window.localStorage.getItem("ciclo"),
                },
                "observacion": values.observacion,
                "procesoDescarga": {
                    "id": procesoActivo[procesoActivo.length - 1].id,
                },
                "tipo_bono": values.tipo_bono,
                "persona_seccion": null,
                "persona_departamento": null,
                "departamento": {
                    "id": user.persona.departamento.id,
                },
                "seccion":{
                    "id": user.persona.seccion.id,
                },
                "solicitador": {
                    "id": user.persona.id,
                    "tipo_bono": values.tipo_bono
                }
            }
            await tramiteDescargaService.updateTramiteDescarga(editTramite)
        }
        resetForm()
        setRecordForEdit(null)
        setOpenPopup(false)    
        setNotify({
          isOpen: true,
          message: recordForEdit ? 'Se ha editado exitosamente' : 'Se ha añadido exitosamente',
          type: 'success'
        })
    }
    const onDelete = (idTramite) => {
        //Serviceeee
        setConfirmDialog({
          ...confirmDialog,
          isOpen: false
        })
        
        const nuevaTabla = records.filter(tramitePorEliminar => tramitePorEliminar.id !== idTramite)
        setRecords(nuevaTabla)
        setDescargaActual(null)
        tramiteDescargaService.deleteTramiteDescarga(idTramite);
        setDeleteData(true);
        setRecordForEdit(null)
        setNotify({
          isOpen: true,
          message: 'Borrado Exitoso',
          type: 'success'
        })
    }

    const filtrarTramites = (tramites) =>{
        const filtered = []
        for(let i = 0; i < tramites.length; i++){
            if(tramites[i].procesoDescarga){
                filtered.push(tramites[i])
            }
            console.log("tramites[i].procesoDescarga ", tramites[i].procesoDescarga)
        }
        return filtered
    }

    const getTramitesDescargasDocente = async() => {
        procesoActivoNew = await procesoDescargaService.getProcesoDescargaActivoxDepartamento(user.persona.departamento.id)
        const tramites = await tramiteDescargaService.getTramitesDescargaHistoricoxDocente(user.persona.id);
        let now = new Date()
        console.log("tramites ", tramites)
        const tramitesFiltrados = filtrarTramites(tramites)
        /*const tramitesFiltrados = tramites.filter(x => {
            return tramites.procesoDescarga
        })*/
        console.log("Proceso Activo", procesoActivoNew)
        console.log("Tramites Descarga", tramitesFiltrados)
        if(procesoActivoNew.length > 0){
            setRecords(tramitesFiltrados.filter(x => {
                const sinplazo= new Date(x.procesoDescarga.fecha_fin)
                return sinplazo.setDate(sinplazo.getDate()+2) < now 
            })) 
            const desc =  tramitesFiltrados.find(({procesoDescarga}) =>
                procesoDescarga.id === procesoActivoNew[procesoActivoNew.length - 1].id
            )
            console.log(desc)
            setDescargaActual(desc)
            await setProcesoActivo(procesoActivoNew)
        }    
    }

    React.useEffect(() => {
        getTramitesDescargasDocente()
    }, [recordForEdit, createData, confirmDialog, openPopup])
    
    return (
        <>
            <ContentHeader text={"Solicitudes de Descarga"} cbo={false} />
            {/* Solicitud actual del año */}
            <Grid container>
                <Grid item xs={8}>
                    {   procesoActivo?.length===0? 
                        <ItemSinProcesoDocente/>:                    
                        descargaActual? 
                        <>
                            <DT.Title size="medium" text="Solicitud de Descarga Actual"/>
                            <ItemDescargaActualDocente
                                item={descargaActual} setRecordForEdit={setRecordForEdit}
                                setOpenPopup={setOpenPopup} setOpenPopupDetalle={setOpenPopupDetalle} 
                                onDelete={onDelete} procesoActivo={procesoActivo[procesoActivo.length - 1]}
                                setConfirmDialog={setConfirmDialog} confirmDialog={confirmDialog}
                            /> 
                        </>
                        :<ItemDecargaVaciaDocente
                            proceso={procesoActivo[procesoActivo.length - 1]}
                            addOrEdit={addOrEdit}
                            setOpenPopup={setOpenPopup}
                        />
                    }
                
                    {/* Solicitud Pasada */}
                    <DT.Title size="medium" text="Histórico de Solicitudes de Descarga Pasadas"/>
                    <ListaDescargasPasadasDocente 
                        records={records}
                        setRecordForEdit={setRecordForEdit}
                        setOpenPopup={setOpenPopup}
                        onDelete={onDelete}
                        setOpenPopupDetalle={setOpenPopupDetalle}
                    />
                </Grid>
                <Divider orientation="vertical" flexItem sx={{mx:2}} />
                <Grid item xs={3}>
                    <ResumenDocente docente={user}/>
                </Grid>
            </Grid>
            <Popup
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
                title= {recordForEdit ? "Editar Solicitud de Descarga": "Nueva Solicitud de Descarga"}
                size="sm"
            >
                <NuevaDescargaDocente 
                    recordForEdit={recordForEdit}
                    addOrEdit={addOrEdit}
                />
            </Popup>
            <Popup
                openPopup={openPopupDetalle}
                setOpenPopup={setOpenPopupDetalle}
                title= {"Solicitud de Descarga"}
                size="md"
            >
                <SolicitudDescargaForm recordForView = {recordForEdit}/>
            </Popup>
            <Notification
              notify={notify}
              setNotify={setNotify}
            />
        </>
    )
}

