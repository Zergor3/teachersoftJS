import React, {useState} from 'react'
import { Controls } from '../../../components/controls/Controls'
import Popup from '../../../components/util/Popup'
import useTable from "../../../components/useTable"
import ContentHeader from '../../../components/AppMain/ContentHeader';
import { Box, Paper, TableBody, TableRow, TableCell,InputAdornment } from '@mui/material';
/* ICONS */
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { Typography } from '@mui/material'
import { StyledTableRow, StyledTableCell } from '../../../components/controls/StyledTable';
import AgregarEditarSeccion from './AgregarEditarSeccion'

const tableHeaders = [
    {
      id: 'id',
      label: 'SeccionID',
      numeric: true,
      sortable: true
    },
    {
      id: 'nombre',
      label: 'Nombre Completo',
      numeric: false,
      sortable: true
    },
    {
      id: 'fechaFundacion',
      label: 'Fecha de Fundación',
      numeric: false,
      sortable: true
    },
    {
      id: 'fechaModificacion',
      label: 'Última Modificación',
      numeric: false,
      sortable: true
    },
    {
        id: 'nombreDepartamento',
        label: 'Departamento',
        numeric: false,
        sortable: true
     },
]
function createData(id, nombre, fechaFundacion, fechaModificacion, nombreDepartamento) {
    return {
        id, nombre,  fechaFundacion, fechaModificacion,nombreDepartamento,
    }
  }
  
const usuarios2 = [
    createData('0', 'Seccion Informatica',  '2021-09-30 01:14 pm ', '2021-09-30 01:14 pm ', 'FACI'),
    createData('1', 'Seccion Industrial',  '2021-09-30 01:14 pm ', '2021-09-30 01:14 pm ', 'FACI'),
    createData('2', 'Seccion Electronica',  '2021-09-30 01:14 pm ', '2021-09-30 01:14 pm ', 'FACI'),
]

export default function GestionSeccion() {
    const [openPopup, setOpenPopup] = useState(false)
    const [records, setRecords] = useState(usuarios2)
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const SubtitulosTable={display:"flex"}
    const PaperStyle={ borderRadius: '20px', pb:4,pt:2, px:2, 
    color:"primary.light", elevatio:0}
    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting,
        BoxTbl
    } = useTable(records, tableHeaders, filterFn);

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
        <>
            <ContentHeader
                text="Gestión de Secciones"
                cbo={false}
            />
            <Paper variant="outlined" sx={PaperStyle}>
                <Typography variant="h4" style={SubtitulosTable}> Secciones</Typography>
                <div style={{display: "flex", paddingRight: "5px", marginTop:20}}>
                {/* <Toolbar> */}
                <Controls.Input
                    label="Buscar Secciones por Nombre"
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
                    title="Agregar Nueva Sección"
                    variant="iconoTexto"
                    onClick = {() => setOpenPopup(true)}
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
                            <StyledTableCell
                            align="right"
                            >
                            {item.id}
                            </StyledTableCell>
                            <StyledTableCell>{item.nombre}</StyledTableCell>
                            <StyledTableCell>{item.fechaFundacion}</StyledTableCell>
                            <StyledTableCell>{item.fechaModificacion}</StyledTableCell>
                            <StyledTableCell>{item.nombreDepartamento}</StyledTableCell>
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
                title="Nueva Sección"
            >
               <AgregarEditarSeccion />
              {/*  <AgregarEditarSeccion/> */}
            </Popup>  
        </>
    )
}