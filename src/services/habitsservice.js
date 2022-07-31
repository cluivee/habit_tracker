import axios from 'axios'
// this was JSON server
// const baseUrl = 'http://localhost:3000/habits'
// This is with node express local server
// const baseUrl = 'http://localhost:3001/api/notes'
// const baseUrl = 'https://agile-badlands-55487.herokuapp.com/api/notes'
const baseUrl = '/api/notes'
// const config = { headers: {'Content-Type': 'application/json'} };

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

// const requestOptions = {
//   method: 'PUT',
//   headers: { 'Content-Type': 'application/json' },
// };


// const update = (id, newObject) => {
//   const request = axios.put(`${baseUrl}/${id}`, newObject, config)
//   return request.then(response => response.data)
// }

export default { getAll, create, update }