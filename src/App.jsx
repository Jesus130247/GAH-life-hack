import './App.css'
import RecAudio from './utils/RecordAudio/recordAudio'; 
import RemoteAudio from './utils/RemoteAudio/remoteAudio';

function App() {
  console.log('hello world');

  return (
    <>
    
    <div className="container">
      <RecAudio />
    </div>

    </>
  )
}

export default App
