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

const sdpMessage = (sdp) => {
  const message = {
    "jsonrpc": "2.0",
      "method": "verto.invite",
      "params": {
        "sdp": sdp,
        "dialogParams": {
          "useVideo": true,
          "screenShare": false,
          "useCamera": "default",
          "useMic": "default",
          "useSpeak": "default",
          "tag": "deskshareVideo",
          "localTag": null,
          "login": "bbbuser",
          "videoParams": {
            "minFrameRate": 5
          },
        "destination_number": "71234-DESKSHARE",
        "caller_id_name": "Test",
        "caller_id_number": "a@b.c",
        "dedEnc": false,
        "mirrorInput": false,
        "callID": `xubirabirovovski-${Date.now()}`,
        "remote_caller_id_name": "Outbound Call",
        "remote_caller_id_number": "71234-DESKSHARE"
        },
        "sessid": `native-${Date.now()}`
      },
      "id": 11
  }

  return message;
}

export default {
  loginMessage,
  sdpMessage,
}
