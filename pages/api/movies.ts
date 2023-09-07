// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { MovieDb } from 'moviedb-promise'
import { getImages } from '@/helpers/nextHelpers'
import { combineAndOrder } from '@/helpers/arrayHelpers'
import { ListItem } from '@/components/CardList'
import { separateGenres } from '@/config/mediaData'

// TODO: put in vercel env var
const KEY = '70640e1be8041b3c9b85529a5c2330b2'
const moviedb = new MovieDb(KEY)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { page = 1, genres = [], includeTvShows } = req.body
  try {
    const { movieGenres, tvGenres } = separateGenres<ListItem>(genres)
    const data = await moviedb.discoverMovie({
      page,
      with_genres: movieGenres.map((g: ListItem) => g.id).join(',')
    })
    if (includeTvShows && !!tvGenres.length) {
      const tvShows = await moviedb.discoverTv({
        page,
        with_genres: tvGenres.map((g: ListItem) => g.id).join(',')
      })
      data.results = combineAndOrder(data.results || [], tvShows.results || [])
    }
    const resultsWithImages = data.results?.map((r) => ({
      ...r,
      backdrop_path: getImages(r.backdrop_path || ''),
      poster_path: getImages(r.poster_path || '')
    }))
    res.status(200).json({ ...data, results: resultsWithImages })
  } catch (e) {
    console.log(e)
    res.status(500).send({ data: e })
  }
}
