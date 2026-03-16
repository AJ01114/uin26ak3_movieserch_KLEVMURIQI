import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getMovieByTitle, getApiKey } from '../lib/omdb'

export default function Movie() {
  const { movie } = useParams()
  const navigate = useNavigate()
  const [details, setDetails] = useState(null)
  const hasApiKey = Boolean(getApiKey())
  const [status, setStatus] = useState(() => (hasApiKey ? 'idle' : 'error'))
  const [error, setError] = useState(() =>
    hasApiKey ? null : new Error('Mangler API-nøkkel. Sett VITE_OMDB_API_KEY i .env.'),
  )

  const title = movie ? decodeURIComponent(movie) : ''

  useEffect(() => {
    if (!hasApiKey) return

    if (!title) {
      navigate('/')
      return
    }

    let cancelled = false

    async function loadDetails() {
      setStatus('loading')
      setError(null)

      try {
        const data = await getMovieByTitle(title)
        if (!cancelled) {
          setDetails(data)
          setStatus('success')
        }
      } catch (err) {
        if (!cancelled) {
          setError(err)
          setStatus('error')
        }
      }
    }

    loadDetails()

    return () => {
      cancelled = true
    }
  }, [title, hasApiKey, navigate])

  return (
    <section className="moviePage">
      <header className="movieHeader">
        <Link className="backLink" to="/">
          ← Tilbake
        </Link>
        <h2>{title}</h2>
      </header>

      {status === 'loading' ? (
        <p className="infoText">Henter informasjon …</p>
      ) : null}

      {status === 'error' ? (
        <p role="alert" className="errorText">
          {error?.message ?? 'Noe gikk galt.'}
        </p>
      ) : null}

      {status === 'success' && details ? (
        <article className="movieDetails">
          <figure className="moviePoster">
            {details.Poster && details.Poster !== 'N/A' ? (
              <img
                src={details.Poster}
                alt={`Plakat for ${details.Title}`}
                width={220}
                height={330}
              />
            ) : (
              <span className="posterFallback" aria-hidden="true">
                Ingen bilde
              </span>
            )}
            <figcaption className="movieMeta">
              <p>
                <strong>År:</strong> {details.Year}
              </p>
              <p>
                <strong>Regissør:</strong> {details.Director}
              </p>
              <p>
                <strong>Skuespillere:</strong> {details.Actors}
              </p>
              <p>
                <strong>Genre:</strong> {details.Genre}
              </p>
              <p>
                <strong>Varighet:</strong> {details.Runtime}
              </p>
            </figcaption>
          </figure>

          <section className="plot">
            <h3>Handling</h3>
            <p>{details.Plot}</p>
          </section>
        </article>
      ) : null}
    </section>
  )
}
