import axios from "axios";
// this was JSON server
// const baseUrl = 'http://localhost:3000/habits'

// const baseUrl = 'https://agile-badlands-55487.herokuapp.com/api/notes'
const baseUrl = "/api/users";

// const config = { headers: {'Content-Type': 'application/json'} };

let token = null;
let refreshToken = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

// setting the refreshtoken in case we want to use it in the future
const setRefreshToken = (newToken) => {
    refreshToken = newToken;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

// does this have to be async?
const axiosDelete = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

const update = (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.put(`${baseUrl}/${id}`, newObject, config);
  return request.then((response) => response.data);
};

export default { getAll, create, update, setToken, setRefreshToken, axiosDelete };
