import { ListItem } from '@/components/CardList';
import { MovieResult, TvResult } from 'moviedb-promise';

export const releaseYear = {
  MAX: 2023,
  MIN: 1900,
};
export type MediaType = {
  id: 'movie' | 'tv';
  label: string;
  image: string;
};

export const tvShowGenres = [
  {
    id: 10759,
    image: '/images/action-movie.jpeg',
    type: 'tv',
    name: 'Action & Adventure',
  },
  {
    id: 16,
    image: '/images/action-movie.jpeg',
    type: 'tv',
    name: 'Animation',
  },
  {
    id: 35,
    image: '/images/action-movie.jpeg',
    type: 'tv',
    name: 'Comedy',
  },
  {
    id: 80,
    image: '/images/action-movie.jpeg',
    type: 'tv',
    name: 'Crime',
  },
  {
    id: 99,
    image: '/images/action-movie.jpeg',
    type: 'tv',
    name: 'Documentary',
  },
  {
    id: 18,
    image: '/images/action-movie.jpeg',
    type: 'tv',
    name: 'Drama',
  },
  {
    id: 10751,
    image: '/images/action-movie.jpeg',
    type: 'tv',
    name: 'Family',
  },
  {
    id: 10762,
    image: '/images/action-movie.jpeg',
    type: 'tv',
    name: 'Kids',
  },
  {
    id: 9648,
    image: '/images/action-movie.jpeg',
    type: 'tv',
    name: 'Mystery',
  },
  {
    id: 10763,
    image: '/images/action-movie.jpeg',
    type: 'tv',
    name: 'News',
  },
  {
    id: 10764,
    image: '/images/action-movie.jpeg',
    type: 'tv',
    name: 'Reality',
  },
  {
    id: 10765,
    image: '/images/action-movie.jpeg',
    type: 'tv',
    name: 'Sci-Fi & Fantasy',
  },
  {
    id: 10766,
    image: '/images/action-movie.jpeg',
    type: 'tv',
    name: 'Soap',
  },
  {
    id: 10767,
    image: '/images/action-movie.jpeg',
    type: 'tv',
    name: 'Talk',
  },
  {
    id: 10768,
    image: '/images/action-movie.jpeg',
    type: 'tv',
    name: 'War & Politics',
  },
  {
    id: 37,
    image: '/images/action-movie.jpeg',
    type: 'tv',
    name: 'Western',
  },
];

const movieGenres = [
  {
    id: 28,
    name: 'Action',
    type: 'movie',
    image: '/images/action-movie.jpeg',
  },
  {
    id: 12,
    name: 'Adventure',
    type: 'movie',
    image: '/images/action-movie.jpeg',
  },
  {
    id: 16,
    name: 'Animation',
    type: 'movie',
    image: '/images/action-movie.jpeg',
  },
  {
    id: 35,
    name: 'Comedy',
    type: 'movie',
    image: '/images/action-movie.jpeg',
  },
  {
    id: 80,
    name: 'Crime',
    type: 'movie',
    image: '/images/action-movie.jpeg',
  },
  {
    id: 99,
    name: 'Documentary',
    type: 'movie',
    image: '/images/action-movie.jpeg',
  },
  {
    id: 18,
    name: 'Drama',
    type: 'movie',
    image: '/images/action-movie.jpeg',
  },
  {
    id: 10751,
    name: 'Family',
    type: 'movie',
    image: '/images/action-movie.jpeg',
  },
  {
    id: 14,
    name: 'Fantasy',
    type: 'movie',
    image: '/images/action-movie.jpeg',
  },
  {
    id: 36,
    name: 'History',
    type: 'movie',
    image: '/images/action-movie.jpeg',
  },
  {
    id: 27,
    name: 'Horror',
    type: 'movie',
    image: '/images/action-movie.jpeg',
  },
  {
    id: 10402,
    name: 'Music',
    type: 'movie',
    image: '/images/action-movie.jpeg',
  },
  {
    id: 9648,
    name: 'Mystery',
    type: 'movie',
    image: '/images/action-movie.jpeg',
  },
  {
    id: 10749,
    name: 'Romance',
    type: 'movie',
    image: '/images/action-movie.jpeg',
  },
  {
    id: 878,
    name: 'Science Fiction',
    type: 'movie',
    image: '/images/action-movie.jpeg',
  },
  {
    id: 10770,
    name: 'TV Movie',
    type: 'movie',
    image: '/images/action-movie.jpeg',
  },
  {
    id: 53,
    name: 'Thriller',
    type: 'movie',
    image: '/images/action-movie.jpeg',
  },
  {
    id: 10752,
    name: 'War',
    type: 'movie',
    image: '/images/action-movie.jpeg',
  },
  {
    id: 37,
    name: 'Western',
    type: 'movie',
    image: '/images/action-movie.jpeg',
  },
];
export const allGenres = (isMovie: boolean, isTv: boolean) =>
  [...(isMovie ? movieGenres : []), ...(isTv ? tvShowGenres : [])].filter(
    (obj, index, self) => index === self.findIndex((t) => t.id === obj.id)
  );

export type GenreItem = {
  id: number;
  image: string;
  type: string;
  name: string;
};
export function separateGenres(arr: GenreItem[]) {
  const tvGenres: GenreItem[] = [];
  const movieGenresInternal: GenreItem[] = arr.filter((g: GenreItem) => {
    const isMovieGenre = !!movieGenres.find((m: GenreItem) => m.id === g.id);
    const isTvGenre = !!tvShowGenres.find((m: GenreItem) => m.id === g.id);
    if (isTvGenre) {
      tvGenres.push(g);
    }

    return isMovieGenre;
  });
  return { movieGenres: movieGenresInternal, tvGenres };
}
