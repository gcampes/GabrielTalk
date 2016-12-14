const loginMessage = () => {
  const message = {
    "jsonrpc":"2.0",
    "method":"login",
    "params": {
      "login":"bbbuser@rn.blindside-dev.com",
      "passwd":"secret",
      "loginParams":{},
      "userVariables":{},
      "sessid": `native-${Date.now()}`
    },
    "id": 3
  }

  return message;
}

export default {
  loginMessage,
}
