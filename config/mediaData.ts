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
    image: '/images/action-tvshow.jpg',
    name: 'Action & Adventure'
  },
  {
    id: 16,
    image: '/images/animated-tvshow.jpg',
    name: 'Animation'
  },
  {
    id: 35,
    image: '/images/comedy-tvshow.jpg',
    name: 'Comedy'
  },
  {
    id: 80,
    image: '/images/crime-tvshow.jpeg',
    name: 'Crime'
  },
  {
    id: 99,
    image: '/images/documentary-tvshows.jpg',
    name: 'Documentary'
  },
  {
    id: 18,
    image: '/images/drama-tvshow.jpg',
    name: 'Drama'
  },
  {
    id: 10751,
    image: '/images/family-tvshow.jpg',
    name: 'Family'
  },
  {
    id: 10762,
    image: '/images/kids-tvshow.jpg',
    name: 'Kids'
  },
  {
    id: 9648,
    image: '/images/mystery-tvshow.jpg',
    name: 'Mystery'
  },
  {
    id: 10763,
    image: '/images/news-tvshow.jpeg',
    name: 'News'
  },
  {
    id: 10764,
    image: '/images/reality-tvshow.jpg',
    name: 'Reality'
  },
  {
    id: 10765,
    image: '/images/scifi-tvshow.jpg',
    name: 'Sci-Fi & Fantasy'
  },
  {
    id: 10766,
    image: '/images/soap-tvshow.jpg',
    name: 'Soap'
  },
  {
    id: 10767,
    image: '/images/talk-tvshow.jpeg',
    name: 'Talk'
  },
  {
    id: 10768,
    image: '/images/war-tvshow.jpg',
    name: 'War & Politics'
  },
  {
    id: 37,
    image: '/images/western-tvshow.jpg',
    name: 'Western'
  }
]

const movieGenres = [
  {
    id: 28,
    name: 'Action',
    image: '/images/actionmovie.jpg'
  },
  {
    id: 12,
    name: 'Adventure',
    image: '/images/adventure-movie.png'
  },
  {
    id: 16,
    name: 'Animation',
    image: '/images/animated-movie.jpg'
  },
  {
    id: 35,
    name: 'Comedy',
    image: '/images/comedy-movie.jpg'
  },
  {
    id: 80,
    name: 'Crime',
    image: '/images/crime-movie.jpg'
  },
  {
    id: 99,
    name: 'Documentary',
    image: '/images/docu-movie.png'
  },
  {
    id: 18,
    name: 'Drama',
    image: '/images/drama-movie.jpg'
  },
  {
    id: 10751,
    name: 'Family',
    image: '/images/family-movie.png'
  },
  {
    id: 14,
    name: 'Fantasy',
    image: '/images/fantasy-movie.jpeg'
  },
  {
    id: 36,
    name: 'History',
    image: '/images/history-movie.jpg'
  },
  {
    id: 27,
    name: 'Horror',
    image: '/images/horror-movie.jpg'
  },
  {
    id: 10402,
    name: 'Music',
    image: '/images/musical-movie.jpg'
  },
  {
    id: 9648,
    name: 'Mystery',
    image: '/images/mystery-movie.jpeg'
  },
  {
    id: 10749,
    name: 'Romance',
    image: '/images/romance-movie.jpg'
  },
  {
    id: 878,
    name: 'Science Fiction',
    image: '/images/scifi-movie.jpg'
  },
  {
    id: 10770,
    name: 'TV Movie',
    image: '/images/tvmovie-movie.jpeg'
  },
  {
    id: 53,
    name: 'Thriller',
    image: '/images/thriller-movie.jpg'
  },
  {
    id: 10752,
    name: 'War',
    image: '/images/war-movie.jpg'
  },
  {
    id: 37,
    name: 'Western',
    image: '/images/western-movie.jpg'
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
