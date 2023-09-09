// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ExternalId, MovieDb, MovieKeywordResponse, MovieRecommendationsResponse, MovieResponse, ShowResponse, TrendingRequest, TvKeywordsResponse, TvResultsResponse, WatchProviderListResponse } from 'moviedb-promise'
import { getImages } from '@/helpers/mediaHelpers'
import { Media } from '@/types'

// TODO: put in vercel env var
const KEY = '70640e1be8041b3c9b85529a5c2330b2'
const Authorization = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MDY0MGUxYmU4MDQxYjNjOWI4NTUyOWE1YzIzMzBiMiIsInN1YiI6IjY0ZjZjNjExMTIxOTdlMDBlMWI1NzJhOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.W7fWRx-Xslonp-ZHc-aqv7ljF7fBcJNqqFlKBXfsL0I'
const moviedb = new MovieDb(KEY)
const url = (media_type: 'tv' | 'movie', id:number)=>{
  return `https://api.themoviedb.org/3/${media_type}/${id}?api_key=70640e1be8041b3c9b85529a5c2330b2&language=en-US`;
}

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization
  }
};
const urlMovie = 'https://api.themoviedb.org/3/movie/968051?language=en-US';

async function getMediaDetails(id: number, media_type: 'tv' | 'movie') {
  console.log('url', url(media_type, id))
  const response = await fetch(url(media_type, id), options);
  const json = await response.json();
  return json;
}
export type DetailsNextApiResponse = {
    details?: ShowResponse | MovieResponse;
    watchProviders?: WatchProviderListResponse;
    similar?: TvResultsResponse | MovieRecommendationsResponse;
    keywords?: TvKeywordsResponse | MovieKeywordResponse
    error: any
}
export interface TrendingNextApiRequest extends NextApiRequest {
  body: { id:number, media_type:  "movie" | "tv" }
}
export default async function handler(
  req: TrendingNextApiRequest,
  res: NextApiResponse<DetailsNextApiResponse>
) {
  const { id, media_type } = req.body
  try {
    const similar= await (media_type === 'tv' ? moviedb.discoverMovie({id}) : moviedb.movieSimilar({id}) )
    const keywords = await (media_type === 'tv' ? moviedb.tvKeywords({id}) : moviedb.movieKeywords({id}) )
    const details = await (media_type === 'tv' ? moviedb.tvInfo({id, 'language': 'en-US'}) : moviedb.movieInfo({id, 'language': 'en-US'}) )   
    const resultsWithImages  
      = similar.results?.map((r) => ({
      ...r,
      backdrop_path: getImages(r.backdrop_path || ''),
      poster_path: getImages(r.poster_path || '')
    }))

    const results = { details, keywords, similar: {...similar, results: resultsWithImages}, error: undefined }
    // @ts-ignore TODO: look into this
    res.status(200).json(results)
  } catch (e) {
    res.status(500).send({ error: e })
  }
}
