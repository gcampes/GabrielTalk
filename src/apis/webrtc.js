import {
  RTCPeerConnection,
  MediaStreamTrack,
  getUserMedia,
  RTCSessionDescription,
} from 'react-native-webrtc';

import sdpTransform from 'sdp-transform';


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
let pc = undefined;
let onAddStreamResponse;

const createPeerConnection = (socket, socketId, isOffer, stream) => {
  return new Promise((resolve, reject) => {
    console.log('Create Peer Connection', socket, socketId, isOffer);
    pc = new RTCPeerConnection(iceServers);

    function createOffer() {
      console.log('Starting createOffer');
      pc.createOffer((desc) => {
        console.log('createOffer', desc);
        pc.setLocalDescription(desc, () => {
          console.log('setLocalDescription', pc.localDescription);
        }, err => console.log(err));
      }, err => console.log(err));
    }

    let candidateTimeout;
    pc.onicecandidate = function (event) {
      console.log('New Ice Candidate', event.candidate);

      const candidate = event.candidate;
      if (candidate && candidate.sdpMid === 'audio') {
        console.log('parsed', sdpTransform.parse(candidate.candidate));
        audioCandidates.push(`a=${candidate.candidate}`);
      } else if (candidate && candidate.sdpMid === 'video') {
        videoCandidates.push(`a=${candidate.candidate}`);
      }
      // console.log(pc.localDescription);
      // if (event.candidate) {
      //   candidates = candidates + `a=${event.candidate.candidate}\r\n`;
      // }
      clearTimeout(candidateTimeout);
      candidateTimeout = setTimeout(iceCompleted, 1000);
    };

    const iceCompleted = () => {
      return resolve(pc);
    };

    pc.onnegotiationneeded = function () {
      console.log('onnegotiationneeded', isOffer);
      if (isOffer) {
        createOffer();
      }
    };

    pc.onaddstream = function (event) {
      console.log('on add stream', event);

      onAddStreamResponse = event.stream.toURL();

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
  });
};

const getLocalStream = (isFront) => {
  return new Promise((resolve, reject) => {
    MediaStreamTrack.getSources(sourceInfos => {
      console.log('Getting Local Stream', sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
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
    });
  });
};

const getSdp = () => {
  console.log('Getting Sdp');
  const sdp = pc.localDescription.sdp;

  const splitSdp = sdp.split('m=video');

  const transformedSdp = [
    splitSdp[0],
    audioCandidates.join('\r\n'),
    '\r\nm=video',
    splitSdp[1],
    videoCandidates.join('\r\n')
  ].join('');

  console.log(sdp);
  console.log(transformedSdp);

  return new Promise((resolve, reject) => {
    return resolve(transformedSdp);
  });
}

const setRemoteSdp = (messages) => {
  console.log('Set Remote SDP');
  const answerMessage = messages.find(m => m.method === 'verto.answer');
  let remoteSdp = new RTCSessionDescription({
    sdp: answerMessage.params.sdp,
    type: 'answer'
  });

  return new Promise((resolve, reject) => {
    pc.setRemoteDescription(remoteSdp,
      () => resolve(onAddStreamResponse),
      (err) => reject(err));
  })
}

export default {
  createPeerConnection,
  getLocalStream,
  getSdp,
  setRemoteSdp
};
