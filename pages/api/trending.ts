// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {  MovieDb, TrendingRequest } from 'moviedb-promise'
import { getImages } from '@/helpers/mediaHelpers'

// TODO: put in vercel env var
const KEY = '70640e1be8041b3c9b85529a5c2330b2'
const moviedb = new MovieDb(KEY)

type Data = {
  name: string
}
export interface TrendingNextApiRequest extends NextApiRequest {
  body: TrendingRequest
}
export default async function handler(
  req: TrendingNextApiRequest,
  res: NextApiResponse<any>
) {
  const { media_type, time_window = 'day' } = req.body
  try {
    const trending = await moviedb.trending({
      media_type, 
      time_window
    })
    const resultsWithImages =trending.results?.map((r) => ({
      ...r,
      // @ts-ignore will never be "person" type
      backdrop_path: getImages(r?.backdrop_path || ''),
      // @ts-ignore will never be "person" type
      poster_path: getImages(r?.poster_path || '')
    }))
    res.status(200).json({ results: resultsWithImages })
  } catch (e) {
    res.status(500).send({ data: e })
  }
}
