import axios from 'axios'
const baseUrl = 'http://localhost:1234/ingresos'

//funciones para obtener todos los ingresos
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

//funcion para crear nuevo ingreso
const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

//funcion para eliminar ingreso
const Delete = id => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
} 

//funcion para actualizar ingreso
const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
 
} 
//crear función que encuentre ingresos por mes y año, teniendo en cuenta que la fecha es un string en formato "YYYY-MM-DD"   
const findByMonthYear = (mes, anyo) => {
  const request = axios.get(`${baseUrl}/ingresos/${anyo}/${mes}`)
  console.log(request)
  return request.then(response => response.data)
  
}


export default { getAll, create, Delete, update, findByMonthYear }