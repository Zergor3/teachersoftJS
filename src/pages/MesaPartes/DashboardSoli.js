/* Author: Gabriela
 * 
 * Se muestran "Mis Solicitudes".  Desde aqui se puede:
 * - Generar una nueva solicitud.
 * - Ver detalle de una solicitud.
 * "/doc/misSolicitudes"
 */
import React, { useState, useContext } from 'react'
import { Avatar, Grid, InputAdornment, Box, TableBody, TableCell, TableRow, Typography, Divider } from '@mui/material'
import { Controls } from '../../components/controls/Controls'
import useTable from '../../components/useTable'
import Notification from '../../components/util/Notification'


/* ICONS */
import SearchIcon from '@mui/icons-material/Search';
import { maxWidth } from '@mui/system';
import Popup from '../../components/util/Popup';
import ContentHeader from '../../components/AppMain/ContentHeader';
import NuevaSolicitudForm from './NuevaSolicitudForm';
import { DT } from '../../components/DreamTeam/DT';
import { Form, useForm } from '../../components/useForm';
import * as MesaPartesService from '../../services/mesaPartesService'
//Iconos Mesa de Partes
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { Link, Redirect } from 'react-router-dom';
import DashboardSoliOrganism from './DashboardSoliOrganism'
import { UserContext } from '../../constants/UserContext'


const tableHeaders = [
    {
        id: 'asunto',
        label: 'Asunto',
        numeric: false,
        sortable: true
    },
    {
        id: 'descripcion',
        label: 'Descripcion',
        numeric: false,
        sortable: false
    },
    {
        id: 'estado',
        label: 'Estado',
        numeric: true,
        sortable: true
    }, {
        id: 'detalle',
        label: 'Detalle',
        numeric: false,
        sortable: true
    },
]

const initialFieldValues = {
    temaTramiteID: 0,
    estadoID: 4
}

// export const getTemaTramites = () => ([
//     { id: 0, title: 'Todos los temas' },
//     { id: 1, title: 'Tema 1' },
//     { id: 2, title: 'Tema 2' },
//     { id: 3, title: 'Tema 3' },
// ])

function getEstadoSolicitud() {
    return ([
        { id: 4, title: 'Todos los estados', icon: <div style={{ mr: 2 }} /> },
        { id: 0, title: 'Enviado', icon: <NearMeOutlinedIcon sx={{ color: "#3B4A81", mr: 2, }} /> },
        { id: 1, title: 'En Revisión', icon: <AccessTimeOutlinedIcon sx={{ color: "#E9D630", mr: 2 }} /> },
        { id: 2, title: 'Delegado', icon: <HowToRegOutlinedIcon sx={{ color: "#FF7A00", mr: 2 }} /> },
        { id: 3, title: 'Atendido', icon: <TaskAltOutlinedIcon sx={{ color: "#43DB7F", mr: 2 }} /> },
    ])
}

export default function DashboardSoli(props) {
    const {
      title,
      records, setRecords, updateRecords, 
      user, 
      comboData } = props
    const { rol} = useContext(UserContext);
    /* Abrir Nueva Solicitud Form (in popup) */
    const [openNuevo, setOpenNuevo] = useState(false)
    
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting,
        BoxTbl
    } = useTable(records, tableHeaders, filterFn);

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFieldValues);

    /* Initial data retrieved */
    // React.useEffect(() => {
    //   console.log("DashBoardSoli: ", comboData)
    // }, [comboData])

    const handleSearch = e => {
        let target = e.target;
        /* React "state object" (useState()) doens't allow functions, only
          * objects.  Thus the function needs to be inside an object. */
        setFilterFn({
           fn: items => {
             if (target.value == "" || items.length === 0)
               /* no search text */
               return items
             else
               return items.filter(x => x.asunto.toLowerCase()
                   .includes(target.value.toLowerCase()))
           }
        })
    }

    const handleSearchEstados = e => {
        let target = e.target;
        /* React "state object" (useState()) doens't allow functions, only
          * objects.  Thus the function needs to be inside an object. */
        handleInputChange(e)
        setFilterFn({
          fn: items => {
             if (target.value == 4 || items.length === 0)
               /* no search text */
               return items
             else
               return items.filter(x => x.estado
                   .includes(target.value))
          }
        })
    }

    /* push data to DB.  Does some error handling. */
    function add (solicitud, resetForm) {
      if (!user || !user.persona || !user.persona.id)
        return 
      
      /* complete data */
      solicitud.solicitadorID = user.persona.id     // required

      MesaPartesService.registerSolicitud(solicitud)
        .then((res) => {
          /* success */
          /* cerrar popup */
          resetForm()
          setOpenNuevo(false)   //setOpenPopup
          /* notify and update table */
          setNotify({
              isOpen: true,
              message: 'Registro de Solicitud Exitosa',
              type: 'success'
          })
          updateRecords(setRecords, user)
        })
        .catch(err => {
          /* error :( */
          setNotify({
              isOpen: true,
              message: 'Estamos teniendo problemas de conexion.  Consulte a un administrador.',
              type: 'error'
          })
          console.log(err)
          console.log("DashboardSoli: add: ", solicitud, MesaPartesService.f2bSolicitud(solicitud))
        })
    }

    return (
      <Form>
        <ContentHeader text={title} cbo={false} />
        {/* Buscador */}
        <div style={{ display: "flex", paddingRight: "5px", marginTop: 20 }}>
          <div style={{ width: "400px", marginRight: "50px" }}>
            <Controls.Input
              label="Buscar Solicitud por Nombre"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onChange={handleSearch}
              type="search"
            />
          </div>
          <div style={{ width: "360px", marginRight: "50px" }}>
            <Controls.RangeTimePicker />
          </div>
        </div>
        {/* Filtrados */}
        <div style={{ display: "flex", paddingRight: "5px", marginTop: 20 }}>
          <div style={{ width: "700px", marginRight: "50px" }}>
            <Controls.Select
              name="temaTramiteID"
              label="Tema de Tramite"
              value={values.temaTramiteID}
              onChange={handleInputChange}
              options={[{id: 0, nombre: "Todos los temas"}]
                .concat(comboData.temaTramite
                  .sort((x1, x2) => x1.nombre - x2.nombre))}
            />
          </div>
          <div style={{ width: "400px", marginRight: "50px" }}>
            <Controls.Select
              name="estadoID"
              label="Estado de Solicitud"
              value={values.estadoID}
              onChange={handleSearchEstados}
              options={getEstadoSolicitud()}
            />
          </div>
          {rol==6? 
            <></>:
            <div style={{ width: "80vw", textAlign: "right" }}>
                <Controls.AddButton
                variant="iconoTexto"
                text="Nueva Solicitud"
                onClick={() => {
                    setOpenNuevo(true);
                }}
                />
            </div>
          }
        </div>
        <DashboardSoliOrganism
          BoxTbl={BoxTbl}
          TblContainer={TblContainer}
          TableBody={TableBody}
          recordsAfterPagingAndSorting={recordsAfterPagingAndSorting}
          TblPagination={TblPagination}
        />
        {/* "MODALS" */}
        {/* Agregar nueva solicitud */}
        <Popup
          openPopup={openNuevo}
          setOpenPopup={setOpenNuevo}
          title="Mesa de Partes"
        >
          <NuevaSolicitudForm add={add} comboData={comboData}/>
        </Popup>
        <Notification notify={notify} setNotify={setNotify} />
      </Form>
    );
}

