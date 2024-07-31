import React, { useEffect, useState } from 'react';
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import fetch from 'cross-fetch';

const RecordAudio = () => {
  const [transcript, setTranscript] = useState('');
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    console.log({ stream })

    const mediaRecorder = new MediaRecorder(stream)

    const socket = new WebSocket('wss://api.deepgram.com/v1/listen', [ 'token', '7a022fdecfba5b581d63987b434ba69318699182' ])

    socket.onopen = () => {
        console.log({ event: 'onopen' })

        mediaRecorder.addEventListener('dataavailable', event => {
            if (event.data.size > 0 && socket.readyState == 1) {
              socket.send(event.data)
            }
          })

        mediaRecorder.start(250)

        // document.querySelector('#status').textContent = 'Connected'
      }
      
    socket.onmessage = (message) => {
        // console.log({ event: 'onmessage', message })
        const received = JSON.parse(message.data)
        const incoming = received.channel.alternatives[0].transcript
        if (incoming && received.is_final) {
            setTranscript((prev) => prev + ' ' + incoming)
        }
        console.log(incoming);

        // document.querySelector('#transcript').textContent += transcript + ' '
    }
      
    socket.onclose = () => {
        console.log({ event: 'onclose' })
    }
    
    socket.onerror = (error) => {
        console.log({ event: 'onerror', error })
    }
})


  return (
    <div className="container">
      <h2>Live Transcript</h2>
      <p>{transcript}</p>
    </div>
  );
};



export default RecordAudio;
