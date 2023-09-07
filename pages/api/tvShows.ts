// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { MovieDb } from 'moviedb-promise'
import { getImages } from '@/helpers/nextHelpers'

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
  const { page = 1, genres } = req.body
  try {
    const data = await moviedb.discoverTv({ page, with_genres: genres })
    const resultsWithImages = data.results?.map((r) => ({
      ...r,
      backdrop_path: getImages(r.backdrop_path || ''),
      poster_path: getImages(r.poster_path || '')
    }))
    res.status(200).json({ ...data, results: resultsWithImages })
  } catch (e) {
    res.status(500).send({ data: e })
  }
}
