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

  let responseTimeout;
  let responses = [];

  const resolvePromise = (resolve) => {
    console.log('ResolvePromise', responses);
    if (responses.length === 1) {
      resolve(responses[0]);
      return;
    }
    resolve(responses);
  }

  return new Promise((resolve, reject) => {
    socket.onmessage = (m) => {
      console.log('Received message from socket', m.data);

      responses.push(JSON.parse(m.data));

      clearTimeout(responseTimeout);
      responseTimeout = setTimeout(resolvePromise.bind(this, resolve, m.data), 500);
    };
  })
}

export default {
  init,
  sendMessage,
};
