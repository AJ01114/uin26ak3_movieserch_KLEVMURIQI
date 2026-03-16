import { Link } from 'react-router-dom'

export default function MovieCard({ movie }) {
  const slug = encodeURIComponent(movie.Title)
  const hasPoster = movie.Poster && movie.Poster !== 'N/A'

  return (
    <li className="movieCardItem">
      <article className="movieCard" aria-label={movie.Title}>
        <Link className="movieCardLink" to={`/${slug}`}> 
          <figure className="poster">
            {hasPoster ? (
              <img
                className="posterImage"
                src={movie.Poster}
                alt={`Omslag til ${movie.Title}`}
                width={200}
                height={300}
              />
            ) : (
              <span className="posterFallback" role="img" aria-label={`Ingen bilde tilgjengelig for ${movie.Title}`}>
                Ingen bilde
              </span>
            )}
            <figcaption className="posterCaption">
              <span className="movieTitle">{movie.Title}</span>
              <span className="movieYear">{movie.Year}</span>
            </figcaption>
          </figure>
        </Link>
      </article>
    </li>
  )
}
