import MovieCard from './MovieCard'

export default function MovieList({ movies }) {
  if (!movies || movies.length === 0) {
    return <p className="infoText">Ingen filmer å vise.</p>
  }

  return (
    <ul className="movieList" role="list">
      {movies.map((movie) => (
        <MovieCard key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  )
}
