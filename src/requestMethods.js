import axios from "axios";

const BASE_URL = "https://mern-bukkuzon.herokuapp.com/api/";
const TOKEN = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
// const TOKEN ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNGU3ZTYxNWEzOWRhYTA2ZTJlOGUzMSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY0OTUyODU5NywiZXhwIjoxNjQ5Nzg3Nzk3fQ.5SAJ0ZMLFn9OFi7Pe3tgwLxLyk6eW_symrNzPsXy0nE";


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNGU3ZTYxNWEzOWRhYTA2ZTJlOGUzMSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY0OTUyODU5NywiZXhwIjoxNjQ5Nzg3Nzk3fQ.5SAJ0ZMLFn9OFi7Pe3tgwLxLyk6eW_symrNzPsXy0nE

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${TOKEN}` },
});
