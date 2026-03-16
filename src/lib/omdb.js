const BASE_URL = 'https://www.omdbapi.com/'
const API_KEY = import.meta.env.VITE_OMDB_API_KEY

function buildUrl(params) {
  const url = new URL(BASE_URL)
  url.searchParams.set('apikey', API_KEY ?? '')

  Object.entries(params).forEach(([key, value]) => {
    if (value != null) {
      url.searchParams.set(key, value)
    }
  })

  return url.toString()
}

export function getApiKey() {
  return API_KEY
}

export async function searchMoviesByTitle(title) {
  if (!API_KEY) {
    throw new Error('Missing OMDb API key. Add VITE_OMDB_API_KEY to your environment.')
  }

  const url = buildUrl({ s: title, type: 'movie', page: '1' })
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Network error while fetching movies.')
  }

  const data = await response.json()
  if (data.Response === 'False') {
    throw new Error(data.Error ?? 'No results')
  }

  return data.Search ?? []
}

export async function getMovieByTitle(title) {
  if (!API_KEY) {
    throw new Error('Missing OMDb API key. Add VITE_OMDB_API_KEY to your environment.')
  }

  const url = buildUrl({ t: title, plot: 'full' })
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Network error while fetching movie details.')
  }

  const data = await response.json()
  if (data.Response === 'False') {
    throw new Error(data.Error ?? 'Movie not found')
  }

  return data
  
}


