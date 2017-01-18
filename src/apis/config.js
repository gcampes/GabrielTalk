const BASE_CONFIG = {
  server: 'wss://rn.blindside-dev.com:8082',
  username: 'bbbuser@rn.blindside-dev.com',
  password: 'secret',
  number: '71234-DESKSHARE',
}

let config = BASE_CONFIG;

const get = prop => {
  return config[prop];
};

const set = (prop, value) => {
  config[prop] = value;
  return get(prop);
};

const reset = () => {
  config = BASE_CONFIG;
};

export default {
  set,
  get,
};
