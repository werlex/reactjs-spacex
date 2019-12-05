import axios from 'axios';

const api = async (meta) => {
  const {
    path,
  } = meta;

  const url = 'https://api.spacexdata.com/v3/' + path;

  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.log({error});
  }
};

export default api;
