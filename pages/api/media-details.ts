import type { NextApiRequest, NextApiResponse } from 'next'
import { Keyword, MovieDb, MovieKeywordResponse, MovieRecommendationsResponse, MovieResponse, ShowResponse, TrendingRequest, TvKeywordsResponse, TvResultsResponse, WatchProviderListResponse } from 'moviedb-promise'
import { getImages } from '@/helpers/mediaHelpers'

const moviedb = new MovieDb(process.env.TMDB_KEY || '')



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
  const aiResponse: any = {}
  try {

    const details = await (media_type === 'tv' ? moviedb.tvInfo({id, 'language': 'en-US'}) : moviedb.movieInfo({id, 'language': 'en-US'}) )   
    const keywordResults = await (media_type === 'tv' ? moviedb.tvKeywords({id}) : moviedb.movieKeywords({id}) )
    // @ts-ignore TODO: look into this
    const keywords = keywordResults['results' in keywordResults ? 'results' : 'keywords'] as Keyword[]
    const similar= await  getMediaSuggestions(details, keywords) 
    const resultsWithImages  
      = similar?.results?.map((r) => ({
      ...r,
      backdrop_path: getImages(r.backdrop_path || ''),
      poster_path: getImages(r.poster_path || '')
    }))

    const results = { aiResponse, details, keywords, similar: {...similar, results: resultsWithImages}, error: undefined }
    // @ts-ignore TODO: look into this
    res.status(200).json(results)
  } catch (e) {
    res.status(500).send({ error: e })
  }
}

async function getMediaSuggestions(mediaDetails: MovieResponse | ShowResponse, keywords: Keyword[]) {
  try {
    const isMovie = 'release_date' in mediaDetails
    let releaseKey = 'first_air_date' 
    if(isMovie) {
      releaseKey = 'release_date'
    }
    const genres = mediaDetails?.genres?.map(genre => genre.id).join(',');
    const language = mediaDetails.original_language;
    
    //  @ts-ignore typescript doesn't like this
    const releaseYear = new Date(mediaDetails[releaseKey] || '').getFullYear();
    const releaseDateGTE = `${releaseYear - 5}-01-01`;  // 5 years before
    const releaseDateLTE = `${releaseYear + 5}-12-31`;  // 5 years after
    moviedb.listInfo
    // Using the extracted attributes to fetch movie suggestions
    const release = isMovie ? { 
      "release_date.gte": releaseDateGTE,
    "release_date.lte": releaseDateLTE,
  } : { 
    "first_air_date.gte": releaseDateGTE,
  }
    const suggestionsResponse = await moviedb[isMovie ? 'discoverMovie' : 'discoverTv']({
      sort_by: 'popularity.desc',
      with_genres: genres,
      'with_keywords': keywords?.map((k) => k.id).join('|'),
      with_original_language: language,
      ...release
    });
    // @ts-ignore TODO: look into this
    const uniqueResults = suggestionsResponse.results = suggestionsResponse?.results?.filter?.((r) => r.id !== mediaDetails.id) as MovieResponse[] | ShowResponse[]
    return {...suggestionsResponse, results: uniqueResults};

  } catch (error) {
    console.error('Error fetching media suggestions:', error);
  }
}

