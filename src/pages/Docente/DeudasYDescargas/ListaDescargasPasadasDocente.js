import React, {useState} from 'react'
import { Form } from '../../../components/useForm'
import { Controls } from '../../../components/controls/Controls';
import { Grid, InputAdornment, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchIcon from '@mui/icons-material/Search';
import useTable from '../../../components/useTable';
import moment from 'moment'
import 'moment/locale/es'
import { DT } from '../../../components/DreamTeam/DT';
moment.locale('es');

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
      id: 'cantidad',
      label: 'Cantidad',
      numeric: false,
      sortable: true
    }
]

export default function ListaDescargasPasadasDocente(props) {
    const { records, setRecordForEdit, setOpenPopup,setOpenPopupDetalle } = props
    const [row, setRow] = React.useState(false)
    const [filterFn, setFilterFn] = React.useState({ fn: items => { return items; } })
    const [confirmDialog, setConfirmDialog] = useState(
        { isOpen: false, title: '', subtitle: '' })
    

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting,
        BoxTbl
    } = useTable(records,tableHeaders, filterFn);
    
    
    function getRow ({...props}){
        //setOpenDetalle(true)
        setRow(props)
        console.log("Get rowww?", row)
    }

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
    return (
        <Form>
           <div style={{display: "flex", paddingRight: "5px", marginTop:20}}>
                {/* <Toolbar> */}
                <div style={{ width: "600px", marginRight: "50px" }}>
                    <Controls.Input
                        label="Buscar Solicitud por Nombre"
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
                </div>
            </div>
            { records.length?
             <>
                <BoxTbl>
                    <TblContainer>
                        {/* <TblHead />  */}
                        <TableBody>
                        {
                        recordsAfterPagingAndSorting().map((item, index) => (
                                <Item key={index} item={item} getRow= {getRow}
                                    setOpenPopup={setOpenPopup}
                                    setRecordForEdit={setRecordForEdit}
                                    setConfirmDialog={setConfirmDialog}
                                    setOpenPopupDetalle={setOpenPopupDetalle}
                                />
                            ))
                        }
                        </TableBody>
                    </TblContainer>
                    <TblPagination />
                </BoxTbl>
             </>
             :
                <BoxTbl>
                    <Grid item xs= {12} rowSpacing={20} align = "center">
                        <Typography variant="h4" color = "secondary">
                                Aún no ha generado Solicitudes de Descarga
                        </Typography>
                    </Grid>
                </BoxTbl>

            } 
        </Form>
    )
}


function Item(props){
    const {item,getRow, setRecordForEdit, setConfirmDialog, onDelete, setOpenPopupDetalle} = props
    function formatoFecha(fecha){
        if(fecha!=null){
            return (moment(fecha).format('DD MMM YYYY [-] h:mm a'))
        }
    }
    return (
        <>
        
            <TableRow>
                <TableCell sx={{maxWidth:"400px"}}>
                    <Typography display="inline" fontWeight="550"  sx={{color:"primary.light"}}>
                        Fecha: {'\u00A0'}
                    </Typography>
                    <Typography display="inline" sx={{color:"primary.light"}}>
                        {formatoFecha(item.fecha_creacion)}
                    </Typography>
                    <div/>
                    <Typography fontWeight='bold' fontSize={18}>
                         Solicitud de Descarga - {item.procesoDescarga.nombre}
                    </Typography>
                    <Typography display="inline" fontWeight="550"  sx={{color:"primary.light"}}>
                        Autor: {'\u00A0'} 
                    </Typography>
                    <Typography display="inline" sx={{color:"primary.light"}}>
                        {item.solicitador.nombres + " " + item.solicitador.apellidos} 
                    </Typography>
                </TableCell>
                <TableCell >
                    <Typography fontWeight="550" sx={{color:"primary.light"}}>
                        Resultado de la solicitud:{'\u00A0'}
                    </Typography>
                    <DT.Etiqueta
                        type={item.resultado === 0 ? "pendiente" :
                        item.resultado === 1 ? "aprobado" :
                        "desaprobado"}
                        sx={{ marginBottom:"4px"}}
                    />
                </TableCell>
                <TableCell>
                    <Controls.Button
                        text="Ver Solicitud"
                        type="submit"
                        onClick={() => { getRow(item); setOpenPopupDetalle(true) }}
                        />
                </TableCell>
            </TableRow>
        </>
    );
}


