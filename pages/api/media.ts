// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { DiscoverMovieResponse, DiscoverTvResponse, MovieDb, MovieResult, TvResult } from 'moviedb-promise'
import { getImages } from '@/helpers/mediaHelpers'
import { combineAndOrder } from '@/helpers/arrayHelpers'
import { GenreItem, separateGenres } from '@/config/mediaData'
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
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
    userInput?:string
  }
}
export default async function handler(
  req: MediaNextApiRequest,
  res: NextApiResponse<MediaResponse> 
) {
  const { genres = [], mediaTypes, userInput, ...rest } = req.body
  const aiResponse: any = {}
  if(!!userInput) {
    // If no ID is provided but a user input is, try to find the movie using OpenAI extracted keywords.
    const keywordsFromInput = await extractKeywordsUsingOpenAI(userInput);
    console.log('keywordsFromInput', {keywords: keywordsFromInput.keywords})
    const movieSuggestions = await searchMoviesByKeywords(keywordsFromInput.keywords);
    console.log('movieSuggestions', {movieSuggestions})
    aiResponse.ai = movieSuggestions
  }

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
async function extractKeywordsUsingOpenAI(text: string) {
  try {
      const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
              {"role": "system", "content": "You are a helpful assistant focused on movies and TV shows. Extract relevant keywords that can be used to filter movies or tv shows and provide a title."},
              {"role": "user", "content": `From this text: "${text}", provide a response in JSON valid format (besure not to include white space in the keywords string): { "keywords": "keyword1,keyword2,keyword3", "title": "Some title"}`}
          ],
      });

      const assistantMessage = response.choices[0].message.content;
      // Assuming the assistant message will be a stringified JSON
      const jsonResponse = JSON.parse(assistantMessage || "");

      return jsonResponse;
  } catch (error) {
      console.error("Error extracting keywords:", error);
      return { keywords: "", title: "Error" };
  }
};
