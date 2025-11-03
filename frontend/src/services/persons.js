import axios from "axios";

// const baseUrl = "http://localhost:3001/persons";
const baseUrl = "http://localhost:3001/api/persons";
// const baseUrl = "/api/persons";

const getAll = () => {
  const get = axios.get(baseUrl);
  return get.then((response) => response.data);
};

const addPerson = (addObject) => {
  const add = axios.post(baseUrl, addObject);
  return add.then((response) => response.data); // response.data가 추가한걸 반환하는걸 전제로
};

const removePerson = (id) => {
  const remove = axios.delete(`${baseUrl}/${id}`);
  console.log("원래 remove", remove);
  return remove.then((data) => {
    console.log("remove 데이터:", data);
    console.log("remove 데이터읜 원류?:", data.data);
    return data.data;
  });
};

const modifyPerson = (id, replaceObject) => {
  const modify = axios.put(`${baseUrl}/${id}`, replaceObject);
  return modify.then((response) => response.data);
};

export default {
  getAll,
  addPerson,
  removePerson,
  modifyPerson,
};
