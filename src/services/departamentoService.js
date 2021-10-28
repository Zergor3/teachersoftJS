import axios from 'axios'
import url from '../config'
import tokenService from './tokens.js';

const getDepartamentos = async () => {
    try{
        const request = await axios.get(`${url}/departamento/`);
        return request.data;
    } catch(except){
        console.error(except);
    }
}
const getDepartamento = async ({id}) => {
    try{
        //const request = await axios.get(`${url}/departamento/${id}`, id, tokenService.getToken());
        const request = await axios.get(`${url}/departamento/${id}`, id);
        if(!request)
          return request.data;
    } catch (except){
        console.error(except);
    }
}
const registerDepartamento = async newObject => {
    try {
        //const request = await axios.post(`${url}/departamento/`,tokenService.getToken(), newObject);
        const request = await axios.post(`${url}/departamento/`, newObject);
        return request.data;
    } catch(except) {
        console.error(except)
    }
}

const updateDepartamento = async (newObject,{id}) => {
    try{
        //const request = await axios.put(`${url}/departamento/${id}`, tokenService.getToken(),id);
        const request = await axios.put(`${url}/departamento/${id}`,newObject, id);
        return request.data;
    } catch(exception){
        console.error(exception)
    }
}
const deleteDepartamento = async (id) => {
    try{
        //const request = await axios.delete(`${url}/departamento/${id}`,tokenService.getToken(),id);
        const request = await axios.delete(`${url}/departamento/${id}`,id);
        return request.data;
    } catch(exception) {
        console.error(exception);
    }
}

export default { getDepartamentos, getDepartamento, registerDepartamento, deleteDepartamento, updateDepartamento };
