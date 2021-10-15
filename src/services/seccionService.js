import axios from 'axios';
import url from '../config.js';
import tokenService from './tokens.js';

const getSecciones = async () => {
  try{
    //debugger;
    const request= await axios.get(`${url}/seccion/`, tokenService.getToken()) //Todas las secciones
    return request.data;  
  }catch(exception){
    console.error(exception);
  }
}

const getSeccionxDepartamento = async ({id_departamento}) => {
  try{
    const request = await axios.get(`${url}/seccion/porDepartamento=${id_departamento}`, tokenService.getToken(), id_departamento);  //Es un entero que se pasa
    return request.data;
  }catch(exception){
    console.error(exception);
  }
}

const getSeccion = async ({id}) => {
  try{
    const request = await axios.get(`${url}/seccion/${id}`, tokenService.getToken(),id);
    return request.data;  //Es un dato.
  }catch(exception){
    console.error(exception);
  }
}

const registerSeccion = async newObject => {
  try{
    const request = await axios.post(`${url}/seccion/`, tokenService.getToken(),newObject);
    return request.data; //Es un valor de true o no
  }catch(exception){
    console.error(exception);
  }
}

const updateSeccion = async (newObject, {id}) => {
  try{
    const request = await axios.put(`${url}/seccion/${id}`,tokenService.getToken(), newObject, id);
    return request.data; //Es un valor de true o no
  }catch(exception){
    console.error(exception);
  }
}

const deleteSeccion = async ({id}) => {
  try{
    const request = await axios.delete(`${url}/seccion/${id}`, id);
    return request.data; //Es un valor de true o no
  }catch(exception){
    console.error(exception);
  }
}

export default {getSecciones, getSeccionxDepartamento, getSeccion, registerSeccion, updateSeccion, deleteSeccion}