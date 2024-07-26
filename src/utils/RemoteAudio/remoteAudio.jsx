// Example filename: index.js

// const { createClient, LiveTranscriptionEvents } = require("@deepgram/sdk");
// const fetch = require("cross-fetch");
// const dotenv = require("dotenv");
// dotenv.config();


// utils/RemoteAudio.jsx
import React, { useEffect, useState } from 'react';
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import fetch from 'cross-fetch';

const RAudio = () => {
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const live = async () => {
      // Use the environment variable directly
      const deepgram = createClient(process.env.REACT_APP_DG_API_KEY);

      const connection = deepgram.listen.live({
        model: "nova-2",
        language: "en-US",
        smart_format: true,
      });

      connection.on(LiveTranscriptionEvents.Open, () => {
        console.log("Connection opened.");

        connection.on(LiveTranscriptionEvents.Close, () => {
          console.log("Connection closed.");
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

        const url = "https://www.youtube.com/watch?v=BTb7JLXJVIs&t=3713s";
        fetch(url)
          .then((r) => r.body)
          .then((res) => {
            res.on("readable", () => {
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


export default RAudio;

// // URL for the realtime streaming audio you would like to transcribe
// const url = "https://www.youtube.com/watch?v=BTb7JLXJVIs&t=3713s";

// const live =  () => {
//   // STEP 1: Create a Deepgram client using the API key
//   const deepgram = createClient(process.env.DG_API_KEY);

//   // STEP 2: Create a live transcription connection
//   const connection = deepgram.listen.live({
//     model: "nova-2",
//     language: "en-US",
//     smart_format: true,
//   });

//   // STEP 3: Listen for events from the live transcription connection
//   connection.on(LiveTranscriptionEvents.Open, () => {
//     connection.on(LiveTranscriptionEvents.Close, () => {
//       console.log("Connection closed.");
//     });

//     connection.on(LiveTranscriptionEvents.Transcript, (data) => {
//       console.log(data.channel.alternatives[0].transcript);
//     });

//     connection.on(LiveTranscriptionEvents.Metadata, (data) => {
//       console.log(data);
//     });

//     connection.on(LiveTranscriptionEvents.Error, (err) => {
//       console.error(err);
//     });

//     // STEP 4: Fetch the audio stream and send it to the live transcription connection
//     fetch(url)
//       .then((r) => r.body)
//       .then((res) => {
//         res.on("readable", () => {
//           connection.send(res.read());
//         });
//       });
//   });
// };

// live()