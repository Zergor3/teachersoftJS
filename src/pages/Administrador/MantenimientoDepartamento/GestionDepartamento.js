import React, {useState, useEffect} from 'react'
import { Controls } from '../../../components/controls/Controls'
import Popup from '../../../components/util/Popup'
import useTable from "../../../components/useTable"
import ContentHeader from '../../../components/AppMain/ContentHeader';
import { Box, Paper, TableBody, TableRow, TableCell,InputAdornment } from '@mui/material';
import AgregarEditarDepartamento from './AgregarEditarDepartamento'
import Notification from '../../../components/util/Notification';
import UnidadService from '../../../services/unidadService.js';
import ConfirmDialog from '../../../components/util/ConfirmDialog';
/* ICONS */

import AddIcon from '@mui/icons-material/Add';
import { Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
//import Notification from '../../../components/util/Notification'
//import ConfirmDialog from '../../../components/util/ConfirmDialog'
import DepartamentoService from '../../../services/departamentoService.js';
import { StyledTableRow, StyledTableCell } from '../../../components/controls/StyledTable';
import departamentoService from '../../../services/departamentoService';
import * as employeeService from '../../../services/employeeService'
import { Form } from '../../../components/useForm'
//import AgregarEditarDepartamento from './AgregarEditarDepartamento'
//import departamentoService from '../../../services/departamentoService';
//import * as employeeService from '../../../services/employeeService'
/* ICONS */
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseIcon from '@mui/icons-material/Close';



const getUnidades = async () => {
  
  let dataUni = await UnidadService.getUnidades();
  dataUni = dataUni ?? []  

  const unidades = [];
  if(dataUni){
    dataUni.map(unid => (
      unidades.push({
        id: unid.id.toString(),
        activo: unid.activo,
        nombre: unid.nombre,
        fechaModificacion: unid.fecha_modificacion,
        fechaCreacion:unid.fecha_creacion,
      })
    ));
  }
  else console.log("No existen datos en Unidades");
  window.localStorage.setItem('listUnidades',unidades);
  return unidades;
}


const tableHeaders = [
    /*{
      id: 'id',
      label: 'DepartamentoID',
      numeric: true,
      sortable: true
    },
    */
    {
      id: 'nombre',
      label: 'Nombre Completo',
      numeric: false,
      sortable: true
    },
    {
      id: 'correo',
      label: 'Correo Electrónico',
      numeric: false,
      sortable: true
    },
    /*{
      id: 'fechaFundacion',
      label: 'Fecha de Fundación',
      numeric: false,
      sortable: true
    },*/
    {
      id: 'fechaModificacion',
      label: 'Última Modificación',
      numeric: false,
      sortable: true
    },
    {
      id: 'unidad',
      label: 'Facultad',
      numeric: false,
      sortable: true
    },
    {
      id: 'actions',
      label: 'Acciones',
      numeric: false,
      sortable: false
    }
]
/*
function createData(id, nombre, correo, fechaFundacion, fechaModificacion) {
    return {
        id, nombre, correo, fechaFundacion, fechaModificacion,
    }
  }

const usuarios2 = [
    createData('0', 'Departamento 1', 'dep1@pucp.edu.pe', '2021-09-30 01:14 pm ', '2021-09-30 01:14 pm '),
    createData('1', 'Departamento 2', 'dep1@pucp.edu.pe', '2021-09-30 01:14 pm ', '2021-09-30 01:14 pm '),
    createData('2', 'Departamento 3', 'dep1@pucp.edu.pe', '2021-09-30 01:14 pm ', '2021-09-30 01:14 pm '),
]
*/

const getDepartamentos = async () => {
  //SI USA GET - SI JALA LA DATA - ESTE SI LO JALA BIEN
  let dataDep = await DepartamentoService.getDepartamentos();
  dataDep = dataDep ?? []  /* (mitsuo) deberia avisar salir un mensaje de error */
  //dataSecc → id, nombre,  fechaFundacion, fechaModificacion,nombreDepartamento
  //console.log("AQUI ESTA EL DATASECC")
  //console.log(dataDep)
  
  const departamentos = [];
  if(dataDep){
    dataDep.map(dep => (
      departamentos.push({
        id: dep.id.toString(),
        nombre: dep.nombre,
        correo: dep.correo,
        fechaModificacion: dep.fecha_modificacion,
        fechaCreacion:dep.fecha_creacion,
        fechaFundacion: dep.fechaFundacion,
        idUnidad: dep.unidad ? dep.unidad.id : '',
        nombreUnidad: dep.unidad ? dep.unidad.nombre : '',
      })
    ));
  }
  else console.log("No existen datos en Departamentos");
  //console.log(secciones);
  window.localStorage.setItem('listDeps',JSON.stringify(dataDep));
  return departamentos;
}

export default function GestionDepartamento() {

    const [openPopup, setOpenPopup] = useState(false)
    const [deleteData, setDeleteData] = useState(false)
    const [createData, setCreateData] = useState(false);
    const [updateData, setUpdateData] = useState(false);
    const [records, setRecords] = useState([])
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [notify, setNotify] = useState({isOpen: false, message: '', type: ''})
    //const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

    const SubtitulosTable={display:"flex"}
    const PaperStyle={ borderRadius: '20px', mt: 3,pb:4,pt:2, px:2, color:"primary.light", elevation:0}
    /* notification snackbar */
    //const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    /* confirm dialog */
    const [confirmDialog, setConfirmDialog] = useState(
      { isOpen: false, title: '', subtitle: '' })
    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting,
        BoxTbl
    } = useTable(records, tableHeaders, filterFn);
    //Posible delete
    /*
    const openInPopup = item => {
      setRecordForEdit(item)
      setOpenPopup(true)
    }
    //Fin del delete
    */
    const handleSearch = e => {
      let target = e.target;
      /* React "state object" (useState()) doens't allow functions, only
        * objects.  Thus the function needs to be inside an object. */
      setFilterFn({
        fn: items => {
          if (target.value == "")
            /* no search text */
            return items
          else
            return items.filter(x => x.nombre.toLowerCase()
                .includes(target.value.toLowerCase()))
        }
      })
    }

    /* const addOrEdit = (departamento, resetForm) => {
      if (departamento.id == 0)
        departamentoService.registerDepartamento(departamento)
      else
        departamentoService.updateDepartamento(departamento)
      resetForm()
      setRecordForEdit(null)
      setOpenPopup(false)
      setRecords(getDepartamentos.getAllEmployees())

      setNotify({
        isOpen: true,
        message: 'Submitted Successfully',
        type: 'success'
      })
    } */

    // const addOrEdit = (departamento, resetForm) => {
    //   if (departamento.id === 0)
    //     departamentoService.registerDepartamento(departamento)
    //   else
    //     departamentoService.updateDepartamento(departamento)

    useEffect(() => {
      getDepartamentos()
      .then (newDep =>{
        setRecords(newDep);
        console.log(newDep);
        setDeleteData(false);
        setCreateData(false);
      });
    }, [recordForEdit, deleteData, createData])


    const addOrEdit = (departamento, resetForm) => {

      const dataDep = {
        id: departamento.id,
        nombre: departamento.nombre,
        correo: departamento.correo,
        fecha_modificacion: departamento.fechaModificacion,
        fecha_creacion:departamento.fechaCreacion,
        fecha_fundacion: departamento.fechaFundacion,
        unidad: {
          id: departamento.unidad.id,
          nombre: departamento.unidad.nombre,
        }
      }
      
      recordForEdit
      ? DepartamentoService.updateDepartamento(dataDep,dataDep.id)
      : DepartamentoService.registerDepartamento(dataDep)
      .then(idDepartamento=> {
        if(recordForEdit){
          setRecordForEdit(null);
          setUpdateData(true);}
      })
      //window.location.replace('');
      setOpenPopup(false)
      resetForm()
      setCreateData(true);
      console.log(updateData);
      console.log(createData);
      if(!updateData){
        setNotify({
          isOpen: true,
          message: 'Cambios Guardados Exitosamente',
          type: 'success'
        });
        setUpdateData(false);
      } else {
        setNotify({
          isOpen: true,
          message: 'Registro de Departamento Exitoso',
          type: 'success'
        });
        setUpdateData(false);
      }
    }
    const onDelete = (idDepartamento) => {
      // if (!window.confirm('Are you sure to delete this record?'))
      //   return
      setDeleteData(true);
      setConfirmDialog({
        ...confirmDialog,
        isOpen: false
      })
      console.log(records)
      console.log(idDepartamento)
      //console.log(id)
      const nuevaTabla = records.filter(departamentoPorEliminar => departamentoPorEliminar.id !== idDepartamento)
      console.log(nuevaTabla)
      DepartamentoService.deleteDepartamento(idDepartamento);
      //userService.borrarUsuario(idDepartamento)

      /*DTLocalServices.getUsers().then((response) => {
        setRecords(response.data)
        console.log(response.data);
      });*/
      //setRecords(DTLocalServices.getAllPersonas())

      setNotify({
        isOpen: true,
        message: 'Borrado Exitoso',
        type: 'success'
      })
    }


    return (
        <>
          <ContentHeader
            text="Gestión de Departamentos"
            cbo={false}
          />
 
          <Paper variant="outlined" sx={PaperStyle}>
            <Typography variant="h4" style={SubtitulosTable}>
              Departamentos
            </Typography>
            <div style={{display: "flex", paddingRight: "5px", marginTop:20}}>
              {/* <Toolbar> */}
              <Controls.Input
                label="Buscar Departamentos por Nombre"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                sx={{ width: .75 }}
                onChange={handleSearch}
                type="search"
              />

              <Controls.AddButton
                title="Nuevo Departamento"
                variant="iconoTexto"
                onClick = {() => {setOpenPopup(true); setRecordForEdit(null)}}
              />

              {/* </Toolbar> */}
            </div>
            <BoxTbl>
              <TblContainer>
                <TblHead />
                <TableBody>
                  
                  {
                    recordsAfterPagingAndSorting().map(item => (
                      <StyledTableRow key={item.id}>
                        <StyledTableCell>{item.nombre}</StyledTableCell>
                        <StyledTableCell>{item.correo}</StyledTableCell>
                        {/*//<StyledTableCell>{item.fechaFundacion}</StyledTableCell>*/}
                        <StyledTableCell align="left">
                        {"Hora: "
                        +item.fechaModificacion.slice(11,19)
                        +"   -  Fecha: "
                        +item.fechaModificacion.slice(8,10)
                        +'/'
                        +item.fechaModificacion.slice(5,7)
                        +'/'
                        +item.fechaModificacion.slice(0,4)}</StyledTableCell>
                        <StyledTableCell>{item.nombreUnidad}</StyledTableCell>
                        <StyledTableCell>
                          <Controls.ActionButton
                            color="warning"
                            onClick={ () => {setOpenPopup(true);setRecordForEdit(item)}}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </Controls.ActionButton>
                          <IconButton aria-label="delete">
                            <DeleteIcon
                            color="warning"
                            onClick={() => {
                              // onDelete(item.id)
                              setConfirmDialog({
                                isOpen: true,
                                title: '¿Eliminar departamento permanentemente?',
                                subTitle: 'No es posible deshacer esta accion',
                                onConfirm: () => {onDelete(item.id)}
                              })
                            }}/>
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  }
                </TableBody>
              </TblContainer>
              <TblPagination />
            </BoxTbl>
            </Paper>

            <Popup
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
                size="sm"
                title= {recordForEdit ? "Editar Departamento": "Nuevo Departamento"}
            >
              <AgregarEditarDepartamento
                recordForEdit={recordForEdit}
                addOrEdit={addOrEdit}
                setOpenPopup={setOpenPopup}
              />
              {/*  <GestionUsuariosForm/> */}
              {/*            </Popup>
            <Notification
              notify={notify}
              setNotify={setNotify}
            />
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
              */}
            </Popup>
            <Notification
              notify={notify}
              setNotify={setNotify}
            />
            <ConfirmDialog
              confirmDialog={confirmDialog}
              setConfirmDialog={setConfirmDialog}
            />
        </>
    )
}
