import { useEffect, useMemo, useState } from 'react'
import SearchForm from '../components/SearchForm'
import MovieList from '../components/MovieList'
import { searchMoviesByTitle, getApiKey, } from '../lib/omdb'

const DEFAULT_QUERY = 'James Bond'

export default function Home() {
  const hasApiKey = Boolean(getApiKey())

  const [searchTerm, setSearchTerm] = useState('')

  const [defaultMovies, setDefaultMovies] = useState([])
  const [defaultStatus, setDefaultStatus] = useState(() => (hasApiKey ? 'loading' : 'error'))
  const [defaultError, setDefaultError] = useState(() =>
    hasApiKey ? null : new Error('OMDb API-nøkkel mangler. Legg til i .env.local og start på nytt.'),
  )

  const [searchResults, setSearchResults] = useState([])
  const [searchStatus, setSearchStatus] = useState('idle')
  const [searchError, setSearchError] = useState(null)

  const isSearching = searchTerm.trim().length >= 3
  const movies = isSearching ? searchResults : defaultMovies
  const status = isSearching ? searchStatus : defaultStatus
  const error = isSearching ? searchError : defaultError

  useEffect(() => {
    if (!hasApiKey) return

    let cancelled = false

    async function loadDefault() {
      setDefaultStatus('loading')
      setDefaultError(null)

      try {
        const result = await searchMoviesByTitle(DEFAULT_QUERY)
        if (cancelled) return

        const firstTen = result.slice(0, 10)
        setDefaultMovies(firstTen)
        setDefaultStatus('success')
      } catch (err) {
        if (cancelled) return
        setDefaultError(err)
        setDefaultStatus('error')
      }
    }

    loadDefault()

    return () => {
      cancelled = true
    }
  }, [hasApiKey])

  useEffect(() => {
    if (!hasApiKey) return
    if (!isSearching) return

    let cancelled = false
    const timer = window.setTimeout(async () => {
      setSearchStatus('loading')
      setSearchError(null)

      try {
        const result = await searchMoviesByTitle(searchTerm.trim())
        if (cancelled) return

        setSearchResults(result.slice(0, 10))
        setSearchStatus('success')
      } catch (err) {
        if (cancelled) return
        setSearchError(err)
        setSearchStatus('error')
      }
    }, 400)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [searchTerm, isSearching, hasApiKey])

  const hintText = useMemo(() => {
    if (!hasApiKey) return null
    if (searchTerm.trim().length === 0) return 'Søk i filmkatalogen. Standardliste vises før søk.'
    if (searchTerm.trim().length < 3)
      return 'Skriv minst 3 tegn for å starte søket.'
    return null
  }, [searchTerm, hasApiKey])

  return (
    <section className="homePage">
      <header className="homeHeader">        
        <SearchForm value={searchTerm} onChange={setSearchTerm} />
        {hintText ? <p className="hintText">{hintText}</p> : null}
      </header>

      <section aria-label="Resultater" className="resultsSection">
        {status === 'loading' ? (
          <p className="infoText">Henter filmer …</p>
        ) : null}
        {status === 'error' ? (
          <p role="alert" className="errorText">
            {error?.message ?? 'Noe gikk galt. Prøv igjen.'}
          </p>
        ) : null}
        {status === 'success' && <MovieList movies={movies} />}
      </section>
    </section>
  )
}
