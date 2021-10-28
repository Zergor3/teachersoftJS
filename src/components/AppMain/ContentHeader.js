import { Grid,Typography,Box } from '@mui/material'
import React from 'react'
import { Controls } from '../controls/Controls';
/* fake BackEnd */
import * as employeeService from '../../services/employeeService';
import * as DTLocalServices from '../../services/DTLocalServices';
import { Form, useForm } from '../useForm'
import { useTheme } from '@mui/material/styles'

const initialFieldValues = {
    id: 0,
    text: '',
    gender: 'male',
    departmentID: '',
    date: new Date(),
    isPermanent: false
}

function CboCiclo(props) {
    const cbo = props.cbo;
    const theme= useTheme();
    const {
        values,
        // setValues,
        handleInputChange
    } = useForm(initialFieldValues);
    if (cbo) {
        return (<Grid item sx={{marginRight: theme.spacing(3)}}>
            <Box  sx={{width: "10vw", align: "Right"}}> 
                <Controls.Select
                    name="title"
                    label="Ciclo"
                    value={values.title}
                    onChange={handleInputChange}
                    options={DTLocalServices.getAllCiclos()}
                    type="contained"
                />
            </Box>
        </Grid>
        );
    }else{
        return null;
    }
}

export default function ContentHeader({text, cbo}) {

    console.log("ContentHeader: ")
    console.log(DTLocalServices.getAllCiclos())
    
    return (
        <Form>
            <Grid container >
                <Grid item >
                    <Typography 
                        variant="h3"
                        component="div"
                        paddingTop="5px"
                        paddingBottom="4px"
                        align="center"
                        color="primary"
                    >
                        {text}
                    </Typography>
                </Grid>
                <Grid item sm/>
                <CboCiclo cbo={cbo}/>
            </Grid>
        </Form>
    )
}
