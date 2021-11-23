import React from 'react'
import { AppBar, Avatar, Grid, Paper, Toolbar, Typography, Box } from '@mui/material'
import Header1 from '../../constants/Header1'
import RegistroForm from './RegistroForm'
import HeadNotificationMisSolicitudes from './HeadNotificationMisSolicitudes'
import { Controls } from '../../components/controls/Controls'
import logout from "../../assets/images/log-out.png";
import { useHistory } from 'react-router';
import { makeStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import { useGoogleLogout } from 'react-google-login';
import Divider from '../../components/controls/Divider'
import { UserContext } from '../../constants/UserContext'

const useStyles = makeStyles((themex) => ({
    root: {
        backgroundColor: "#fdfdff",
    },
    pageIcon: {
        display: "inline-block",
        padding: themex.spacing(1),
        color: "#00002b",
    },
}));



const clientId = '626086626141-gclngcarehd8fhpacb2nrfq64mk6qf5o.apps.googleusercontent.com';

export default function Registro() {
    return (
        <>
            <Header1/>
            <Header/>
            <Paper sx={{m: 22, p: 5}}>
                <HeadNotificationMisSolicitudes/>
                <RegistroForm/>
            </Paper>
        </>
    )
}

function Header (){
    const { user, rol } = React.useContext(UserContext);
    const history = useHistory();
    const classes = useStyles();
    const onLogoutSuccess = () => {
        /*  setUser({}); */
        // setRole({});
        localStorage.clear();
        history.push('/')
    }
    const onLogoutFailure = (response) => {
    // console.log(response)
        console.log('Failed to log out')
    }
    const {signOut} = useGoogleLogout({
        clientId,
        onLogoutSuccess,
        onLogoutFailure,
    })
    return(

        <AppBar
            sx={{
                marginTop: "65px",
                bgcolor: "#fff",
                boxShadow: 1,
                transform: "translateZ(0)",
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            position="fixed"
        >
            <Toolbar>
                <Grid
                    container
                    ml={-1}
                    mr={0}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    <Grid item pl={2}>
                        <Avatar alt="profile pic" src={user.persona.foto_URL} />
                    </Grid>
                    <Grid item sm alignItems="right">
                        <div className={classes.pageIcon}>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{ bgcolor: "primary" }}
                            >
                                {user.persona.nombres + ' ' + user.persona.apellidos}
                            </Typography>
                            <Typography variant="body1" component="div">
                                Invitado
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item>
                        <Controls.Button
                            variant="outlined"
                            size='small'
                
                            text="Cerrar sesión"
                            onClick={signOut}
                            endIcon={<img src={logout} />}
                        />
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}