import { useState } from 'react'
import './App.css'
import DisplayPosts from './components/DisplayPosts';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="display-posts">
        <DisplayPosts/>
    </div>
  )
}

export default App
