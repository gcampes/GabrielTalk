import {
  RTCPeerConnection,
  MediaStreamTrack,
  getUserMedia,
} from 'react-native-webrtc';


const iceServers = {
                      "iceServers": [
                        {url:'stun:stun.l.google.com:19302'},
                        {url:'stun:stun1.l.google.com:19302'},
                        {url:'stun:stun2.l.google.com:19302'},
                        {url:'stun:stun3.l.google.com:19302'},
                        {url:'stun:stun4.l.google.com:19302'},
                      ]
                   };
let videoCandidates = [];
let audioCandidates = [];

const createPeerConnection = (socket, socketId, isOffer, stream) => {
  console.log('Create Peer Connection', socket, socketId, isOffer);
  const pc = new RTCPeerConnection(iceServers);

  function createOffer() {
    console.log('Starting createOffer');
    pc.createOffer(function(desc) {
      console.log('createOffer', desc);
      pc.setLocalDescription(desc, function () {
        console.log('setLocalDescription', pc.localDescription);
      }, err => console.log(err));
    }, err => console.log(err));
  }

  pc.onicecandidate = function (event) {
    console.log(event.candidate);
    console.log('New Ice Candidate')

    const candidate = event.candidate;
    if (candidate && candidate.sdpMid === 'audio') {
      audioCandidates.push(candidate.candidate);
    } else if (candidate && candidate.sdpMid === 'video') {
      videoCandidates.push(candidate.candidate)
    }
    // console.log(pc.localDescription);
    // if (event.candidate) {
    //   candidates = candidates + `a=${event.candidate.candidate}\r\n`;
    // }
    // clearTimeout(candidateTimeout);
    // candidateTimeout = setTimeout(iceCompleted, 1000);
  };

  pc.onnegotiationneeded = function () {
    console.log('onnegotiationneeded', isOffer);
    if (isOffer) {
      createOffer();
    }
  }

  pc.onaddstream = function (event) {
    console.log('EVENT PROPRIO', event);
    // console.log('onaddstream', event.stream);
    // container.setState({info: 'One peer join!'});
    //
    // const remoteList = container.state.remoteList;
    // remoteList[socketId] = event.stream.toURL();
    // console.log(event.stream);
    // console.log('stream to url', remoteList[socketId]);
    // container.setState({ remoteList: remoteList });
  };

  console.log('Stream will be added to Peer Connection', stream);
  pc.addStream(stream);

  return pc;
}

const getLocalStream = (isFront) => {
  return new Promise((resolve, reject) => {
    MediaStreamTrack.getSources(sourceInfos => {
      console.log('Getting Local Stream', sourceInfos);
      let videoSourceId;
      for (const i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
          videoSourceId = sourceInfo.id;
        }
      }
      getUserMedia({
        audio: true,
        // video: {
        //   mandatory: {
        //     minWidth: 500,
        //     minHeight: 300,
        //     minFrameRate: 30
        //   },
        //   facingMode: (isFront ? "user" : "environment"),
        //   optional: [{ sourceId: sourceInfos.id }]
        // }
      }, (stream) => {
        console.log('Got User Media', stream);
        resolve(stream);
      }, err => reject(err));
    })
  })
}

export default {
  createPeerConnection,
  getLocalStream
};
