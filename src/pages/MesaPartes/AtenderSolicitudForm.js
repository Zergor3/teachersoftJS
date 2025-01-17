import React from 'react'
import { Grid, Stack, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Controls } from '../../components/controls/Controls'
import { DT } from '../../components/DreamTeam/DT'
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import { Form, useForm } from '../../components/useForm'

// icons
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ClearIcon from '@mui/icons-material/Clear';

const initialFieldValues = {
    observacion: '',        // (antes se llamaba `descripcion`)
    resultadoID: 0
}

function getColorIcon(resultado){
    if(resultado==1)
        return {color:"#43DB7F"} //Verde de aceptado
    return {color:"#DC395F"} //Rojo de rechazado

}

/* solo se utiliza en DelegadasAMi */
// function obtenerResultadoBox(resultado){
//     return (
//         <Box
//             sx={{
//                 width:"180px",
//                 height: "40px",
//                 boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
//                 borderRadius: "50px",
//                 padding:"2px"
//             }}
//         >
//             <Stack direction="row" spacing={2} p={1} ml={2}>
//                 <PanoramaFishEyeIcon sx={getColorIcon(resultado)}/>
//                 <Typography variant="body2" style={{pt:"20px"}}>
//                     {resultado==1? "Aprobado":"Rechazado"}
//                 </Typography> 
//             </Stack>
//         </Box> 
//     )
// }

function getEstadoResultado() {
    return ([
        { id: 0, title: 'Seleccionar', icon: <div style={{ mr: 2 }} /> },
        { id: 1, title: 'Aprobado', icon: <PanoramaFishEyeIcon sx={{ color: "#43DB7F", mr: 2, }} /> },
        { id: 2, title: 'Rechazado', icon: <PanoramaFishEyeIcon sx={{ color: "#DC395F", mr: 2 }} /> },
    ])
}


export default function AtenderSolicitudForm(props) {
    const { setAtender, solicitud, submitAtencion }=props
    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFieldValues);

    function validate() {
        let temp = {...errors}
        let defaultError = "Este campo es requerido"
        temp.resultadoID = values.resultadoID !== 0 ? "" : defaultError

        temp.observacion = values.observacion ? "" : defaultError
        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x === "")
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (validate()) {
            submitAtencion(values)
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <div style={{marginTop:"40px"}}>
                <Controls.Divider/>
                <Grid container mt={3}> 
                    <Grid item md={4}>
                        <Typography variant="h5" mx={2} >
                            Atención de Solicitud
                        </Typography>
                    </Grid>
                    <Grid item xs/>
                    <Grid item mr={5}>
                        <Controls.Button
                            variant="outlined"
                            text="Cancelar"
                            onClick={() => {setAtender(false)}}
                            endIcon={<ClearIcon />}
                        />
                        <Controls.Button
                            text="Enviar"
                            type="submit"
                            endIcon={<SendOutlinedIcon />}
                        />
                    </Grid>
                </Grid>
                <Box pl="95px" width="62.5%">
                    <Stack direction="column" spacing={2} sx={{width:"250px"}} >
                        <Controls.Select
                            name="resultadoID"
                            label="Resultado"
                            value={values.resultadoID}
                            onChange={handleInputChange}
                            options={getEstadoResultado()}
                            error={errors.resultadoID}
                        />
                    </Stack>
                    <Typography fontWeight={"500"} fontSize= {17}>
                        Observación de la Solicitud
                    </Typography>
                    <Controls.Input
                        name="observacion"
                        label=""
                        value={values.observacion}
                        onChange={handleInputChange}
                        multiline
                        rows={6}
                        error={errors.observacion}
                    />
                </Box>
            </div>
        </Form>
    )
}

