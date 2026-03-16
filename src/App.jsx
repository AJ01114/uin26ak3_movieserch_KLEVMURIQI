import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Movie from './pages/Movie'
import './style.css'

export default function App() {
  return (
    <BrowserRouter>
      <header className="appHeader">
        <h1>Film­søk</h1>
        <p className="appTagline">Søk i filmer via OMDb og åpne detaljer for hver film.</p>
      </header>

      <main className="appMain">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:movie" element={<Movie />} />
        </Routes>
      </main>

      <footer className="appFooter">
        <p>
          Data fra <a href="https://www.omdbapi.com/" target="_blank" rel="noreferrer">OMDb</a>.
        </p>
      </footer>
    </BrowserRouter>
  )

}
