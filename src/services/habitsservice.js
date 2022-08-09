import axios from 'axios'
// this was JSON server
// const baseUrl = 'http://localhost:3000/habits'
// This is with node express local server
// const baseUrl = 'http://localhost:3001/api/notes'
// const baseUrl = 'https://agile-badlands-55487.herokuapp.com/api/notes'
const baseUrl = '/api/notes'
// const config = { headers: {'Content-Type': 'application/json'} };

// it appears the token is saved to the backend, and so saving to localstorage does nothing
let token = null;

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

// does this have to be async?
const axiosDelete = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

const update = (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.put(`${baseUrl}/${id}`, newObject, config)
  return request.then(response => response.data)
}

// const requestOptions = {
//   method: 'PUT',
//   headers: { 'Content-Type': 'application/json' },
// };


export default { getAll, create, update, setToken, axiosDelete }