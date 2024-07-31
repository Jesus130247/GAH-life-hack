import React, { useEffect, useState } from 'react';

const RecordAudio = () => {
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // console.log({ stream });

        const mediaRecorder = new MediaRecorder(stream);

        const socket = new WebSocket('wss://api.deepgram.com/v1/listen', [
          'token', '7a022fdecfba5b581d63987b434ba69318699182'
        ]);

        socket.onopen = () => {
          console.log({ event: 'onopen' });

          mediaRecorder.addEventListener('dataavailable', event => {
            if (event.data.size > 0 && socket.readyState === 1) {
              socket.send(event.data);
            }
          });

          mediaRecorder.start(2000);
        };

        socket.onmessage = (message) => {
          const received = JSON.parse(message.data);
          const incoming = received.channel.alternatives[0].transcript;
          if (incoming && incoming.trim() && received.is_final) {
            setTranscript((prev) => `${prev} ${incoming}`.trim());
          }
          console.log(received);
        };

        socket.onclose = () => {
          console.log({ event: 'onclose' });
        };

        socket.onerror = (error) => {
          console.log({ event: 'onerror', error });
        };

      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    startRecording();
  }, []);

  return (
    <div className="container">
      <h2>Live Transcript</h2>
      <p>{transcript}</p>
    </div>
  );
};

export default RecordAudio;
