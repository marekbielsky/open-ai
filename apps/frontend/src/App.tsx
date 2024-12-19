import { useFetch } from './hooks/useFetch'
import './App.css'

function App() {
  const { data, loading, error } = useFetch<string>('/api')

  return (
    <>
      <h1>Vite + React</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Message from backend: {data}</p>}
    </>
  )
}

export default App
