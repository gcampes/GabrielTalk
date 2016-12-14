let socket = undefined;

const init = () => {
  console.log('Socket Init')

  socket = new WebSocket('wss://rn.blindside-dev.com:8082');

  return new Promise((resolve, reject) => {
    return socket.onopen = () => {
      console.log('Socket Opened');
      resolve();
    };
  })
}

const sendMessage = (message) => {
  console.log('Sending Message to Socket', message);
  socket.send(JSON.stringify(message));

  return new Promise((resolve, reject) => {
    socket.onmessage = (m) => {
      console.log('Received message from socket', m.data);
      resolve(JSON.parse(m.data));
    };
  })
}

export default {
  init,
  sendMessage,
};
