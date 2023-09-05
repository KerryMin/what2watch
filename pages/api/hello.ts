// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { MovieDb } from 'moviedb-promise'
import { fetchCall } from '@/helpers/nextHelpers'
// https://image.tmdb.org/t/p/w200//vAvLQOyFoire5x8AmRNfvgkvrMZ.jpg
// TODO: put in vercel env var
const KEY = '70640e1be8041b3c9b85529a5c2330b2'
const moviedb = new MovieDb(KEY)

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { page = 1, sort_by = 'original_title.asc' } = req.body
  try {
    // original_title.asc
    // primary_release_date.asc
    // revenue.asc
    // const { results } = await moviedb.trending({
    //   time_window: 'week',
    //   media_type: 'all'
    // })
    const { results } = await moviedb.discoverMovie({
      language: 'en-US',
      page,
      region: 'US'
    })
    const genres = await fetchCall(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${KEY}&language=en-US`
    )
    // https://api.themoviedb.org/3/genre/movie/list?api_key=[MY_KEY]&language=en-US
    // const genres = moviedb.genreMovieList({ id: 3, language: 'en-US' })
    res.status(200).json({ data: { results, genres } })
  } catch (e) {
    res.status(500).send({ data: e })
  }
}
