import React, { useEffect, useState } from 'react';
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import fetch from 'cross-fetch';

const RemoteAudio = () => {
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const live = async () => {
      const apiKey = import.meta.env.VITE_DG_API_KEY;
      if (!apiKey) {
        console.error('Deepgram API key is not defined');
        return;
      }

      const deepgram = createClient(apiKey);

      const connection = deepgram.listen.live({
        model: 'nova-2',
        language: 'en-US',
        smart_format: true,
      });

      connection.on(LiveTranscriptionEvents.Open, () => {
        console.log('Connection opened.');

        connection.on(LiveTranscriptionEvents.Close, () => {
          console.log('Connection closed.');
        });

        connection.on(LiveTranscriptionEvents.Transcript, (data) => {
          setTranscript(data.channel.alternatives[0].transcript);
        });

        connection.on(LiveTranscriptionEvents.Metadata, (data) => {
          console.log(data);
        });

        connection.on(LiveTranscriptionEvents.Error, (err) => {
          console.error(err);
        });

        const url = 'public/Toast Funny Story when he & his Friend Met a R_cist Woman.mp3';
        fetch(url)
          .then((r) => r.body)
          .then((res) => {
            res.on('readable', () => {
              connection.send(res.read());
            });
          });
      });
    };

    live();
  }, []);

  return (
    <div className="container">
      <h2>Live Transcript</h2>
      <p>{transcript}</p>
    </div>
  );
};

live()

export default RemoteAudio;
