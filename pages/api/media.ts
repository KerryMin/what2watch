// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { DiscoverMovieResponse, DiscoverTvResponse, MovieDb, MovieResult, TvResult } from 'moviedb-promise'
import { getImages } from '@/helpers/mediaHelpers'
import { combineAndOrder } from '@/helpers/arrayHelpers'
import { GenreItem, separateGenres } from '@/config/mediaData'

// TODO: put in vercel env var
const moviedb = new MovieDb(process.env.TMDB_KEY || '')

export type MediaResponse =  {
  page: number;
  total_pages: number | undefined;
  total_results: number;
  results: (MovieResult | TvResult | undefined)[];
  errors: {
      moviesResult: unknown;
      tvResults: unknown;
  };
} 

export interface MediaNextApiRequest extends NextApiRequest {
  body: {
    genres: GenreItem[];
    mediaTypes: string[];
    page?: number;
    user_input?:string
  }
}
export default async function handler(
  req: MediaNextApiRequest,
  res: NextApiResponse<MediaResponse> 
) {
  const { genres = [], mediaTypes, user_input, ...rest } = req.body
  const aiResponse: any = {}
  // if(!!user_input) {
  //   // If no ID is provided but a user input is, try to find the movie using OpenAI extracted keywords.
  //   const keywordsFromInput = await extractKeywordsUsingOpenAI(user_input);
  //   console.log('keywordsFromInput', {keywordsFromInput, user_input})
  //   const movieSuggestions = await searchMoviesByKeywords(keywordsFromInput?.[0] || '');
  //   console.log('movieSuggestions', {movieSuggestions})
  //   aiResponse.ai = movieSuggestions
  // }

  const isIncludeTv = mediaTypes?.includes('tv')
  const isIncludeMovie = mediaTypes?.includes('movie')
  try {
    const { movieGenres, tvGenres } = separateGenres(genres)
    const ctx: {moviesResult: DiscoverMovieResponse, tvResults: DiscoverTvResponse} = {moviesResult: {}, tvResults: {}}
    const errors: {moviesResult: unknown, tvResults: unknown} = {moviesResult: undefined, tvResults: undefined}
    if(isIncludeMovie){
      try {
      const data  = await moviedb.discoverMovie({
        page: rest.page || 1,
        with_genres: movieGenres.map((g: GenreItem) => g.id).join(',')
      })
      ctx.moviesResult = data
    } catch (e) {
      errors.moviesResult = e
    }
    }
    if(isIncludeTv){
      try {
      const data = await moviedb.discoverTv({
        page: rest.page || 1,
        with_genres: tvGenres.map((g: GenreItem) => g.id).join(',')
      })
      ctx.tvResults = data
    } catch (e) {
      errors.tvResults = e
    }
    }

    const data = combineAndOrder(ctx.moviesResult.results || [], ctx.tvResults.results || [])
    
    const resultsWithImages: (
      MovieResult | TvResult | undefined)[]  
      = data?.map((r) => ({
      ...r,
      backdrop_path: getImages(r.backdrop_path || ''),
      poster_path: getImages(r.poster_path || '')
    }))

   const total_results = (ctx.moviesResult.total_results || 0) + (ctx.tvResults.total_results || 0) 
   const total_pages = (ctx.moviesResult.total_pages || 0) > (ctx.tvResults.total_pages || 0) ? ctx.moviesResult.total_pages : ctx.tvResults.total_pages
   const page = (ctx.moviesResult.page || 1) || (ctx.tvResults.page || 1)
   const response = { 
    page,
    total_pages,
    total_results,
    results: resultsWithImages ,
    errors,
    aiResponse
  }
   res.status(200).json(response)
  } catch (e) {
    const response = { 
      page: 0,
      total_pages: 0,
      total_results: 0,
      results: [] ,
      errors: {moviesResult: e, tvResults: e},
    }
    console.log(e)
    res.status(500).send(response)
  }
}

async function searchMoviesByKeywords(keyword: string) {
  const response = await moviedb.searchMovie({
    query: keyword
  });
  return response;
}