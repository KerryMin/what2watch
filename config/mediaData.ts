import { MovieResult, TvResult } from 'moviedb-promise'

export const releaseYear = {
  MAX: 2023,
  MIN: 1900
}
export type MediaType = {
  id: 'movie' | 'tv'
  label: string
  image: string
}

export const tvShowGenres = [
  {
    id: 10759,
    image: '/images/action-movie.jpeg',
    name: 'Action & Adventure'
  },
  {
    id: 16,
    image: '/images/action-movie.jpeg',
    name: 'Animation'
  },
  {
    id: 35,
    image: '/images/action-movie.jpeg',
    name: 'Comedy'
  },
  {
    id: 80,
    image: '/images/action-movie.jpeg',
    name: 'Crime'
  },
  {
    id: 99,
    image: '/images/action-movie.jpeg',
    name: 'Documentary'
  },
  {
    id: 18,
    image: '/images/action-movie.jpeg',
    name: 'Drama'
  },
  {
    id: 10751,
    image: '/images/action-movie.jpeg',
    name: 'Family'
  },
  {
    id: 10762,
    image: '/images/action-movie.jpeg',
    name: 'Kids'
  },
  {
    id: 9648,
    image: '/images/action-movie.jpeg',
    name: 'Mystery'
  },
  {
    id: 10763,
    image: '/images/action-movie.jpeg',
    name: 'News'
  },
  {
    id: 10764,
    image: '/images/action-movie.jpeg',
    name: 'Reality'
  },
  {
    id: 10765,
    image: '/images/action-movie.jpeg',
    name: 'Sci-Fi & Fantasy'
  },
  {
    id: 10766,
    image: '/images/action-movie.jpeg',
    name: 'Soap'
  },
  {
    id: 10767,
    image: '/images/action-movie.jpeg',
    name: 'Talk'
  },
  {
    id: 10768,
    image: '/images/action-movie.jpeg',
    name: 'War & Politics'
  },
  {
    id: 37,
    image: '/images/action-movie.jpeg',
    name: 'Western'
  }
]

const movieGenres = [
  {
    id: 28,
    name: 'Action',
    image: '/images/action-movie.jpeg'
  },
  {
    id: 12,
    name: 'Adventure',
    image: '/images/action-movie.jpeg'
  },
  {
    id: 16,
    name: 'Animation',
    image: '/images/action-movie.jpeg'
  },
  {
    id: 35,
    name: 'Comedy',
    image: '/images/action-movie.jpeg'
  },
  {
    id: 80,
    name: 'Crime',
    image: '/images/action-movie.jpeg'
  },
  {
    id: 99,
    name: 'Documentary',
    image: '/images/action-movie.jpeg'
  },
  {
    id: 18,
    name: 'Drama',
    image: '/images/action-movie.jpeg'
  },
  {
    id: 10751,
    name: 'Family',
    image: '/images/action-movie.jpeg'
  },
  {
    id: 14,
    name: 'Fantasy',
    image: '/images/action-movie.jpeg'
  },
  {
    id: 36,
    name: 'History',
    image: '/images/action-movie.jpeg'
  },
  {
    id: 27,
    name: 'Horror',
    image: '/images/action-movie.jpeg'
  },
  {
    id: 10402,
    name: 'Music',
    image: '/images/action-movie.jpeg'
  },
  {
    id: 9648,
    name: 'Mystery',
    image: '/images/action-movie.jpeg'
  },
  {
    id: 10749,
    name: 'Romance',
    image: '/images/action-movie.jpeg'
  },
  {
    id: 878,
    name: 'Science Fiction',
    image: '/images/action-movie.jpeg'
  },
  {
    id: 10770,
    name: 'TV Movie',
    image: '/images/action-movie.jpeg'
  },
  {
    id: 53,
    name: 'Thriller',
    image: '/images/action-movie.jpeg'
  },
  {
    id: 10752,
    name: 'War',
    image: '/images/action-movie.jpeg'
  },
  {
    id: 37,
    name: 'Western',
    image: '/images/action-movie.jpeg'
  }
]
export const allGenres = (isMovie: boolean, isTv: boolean) =>
  [...(isMovie ? movieGenres : []), ...(isTv ? tvShowGenres : [])].filter(
    (obj, index, self) => index === self.findIndex((t) => t.id === obj.id)
  )
export function separateGenres<T>(arr: T[]) {
  const tvGenres: T[] = []
  const movieGenresInternal: T[] = arr.filter((g: T) => {
    // @ts-ignore this is fine
    const isMovieGenre = !!movieGenres.find((m: T) => m.id === g.id)

    if (!isMovieGenre) {
      tvGenres.push(g)
    }

    return isMovieGenre
  })
  return { movieGenres: movieGenresInternal, tvGenres }
}
