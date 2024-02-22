// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  DiscoverMovieResponse,
  DiscoverTvResponse,
  MovieDb,
  MovieResult,
  TvResult,
} from 'moviedb-promise';
import { getImages } from '@/helpers/mediaHelpers';
import { combineAndOrder } from '@/helpers/arrayHelpers';
import { GenreItem, separateGenres } from '@/config/mediaData';
import OpenAI from 'openai';
import pluralize from 'pluralize';

// TODO: put in vercel env var
const moviedb = new MovieDb(process.env.TMDB_KEY || '');
type AiMediaSuggestionType = { title: string; query: DiscoverMovieResponse };
export type MediaResponse = {
  page: number;
  total_pages: number | undefined;
  total_results: number;
  results: (MovieResult | TvResult | undefined)[];
  aiMediaSuggestions: AiMediaSuggestionType;
  errors: {
    moviesResult: unknown;
    tvResults: unknown;
    aiMediaSuggestions: unknown;
  };
};

export interface MediaNextApiRequest extends NextApiRequest {
  body: {
    genres: GenreItem[];
    mediaTypes: string[];
    page?: number | string | null;
    userInput?: string;
    openAiKey?: string;
  };
}
export default async function handler(
  req: MediaNextApiRequest,
  res: NextApiResponse<MediaResponse>
) {
  const { genres = [], mediaTypes, userInput, openAiKey, ...rest } = req.body;
  const aiMediaSuggestions: AiMediaSuggestionType = {
    title: '',
    query: {},
  };

  const isIncludeTv = mediaTypes?.includes('tv');
  const isIncludeMovie = mediaTypes?.includes('movie');
  const isIncludeAiSuggestion = false;
  // const isIncludeAiSuggestion = !!userInput && !!(openAiKey || process.env.OPENAI_API_KEY);
  const errors: {
    moviesResult: unknown;
    tvResults: unknown;
    aiMediaSuggestions: unknown;
  } = {
    moviesResult: undefined,
    aiMediaSuggestions: undefined,
    tvResults: undefined,
  };
  try {
    const { movieGenres, tvGenres } = separateGenres(genres);
    if (isIncludeAiSuggestion) {
      try {
        // If no ID is provided but a user input is, try to find the movie using OpenAI extracted keywords.
        const keywordsFromInput = await extractKeywordsUsingOpenAI(userInput || '', openAiKey);
        aiMediaSuggestions.query = await getMediaByKeywords(keywordsFromInput.keywords.split(','));
        aiMediaSuggestions.title = keywordsFromInput.title;
      } catch (e) {
        errors.aiMediaSuggestions = e;
      }
    }
    const ctx: {
      moviesResult: DiscoverMovieResponse;
      tvResults: DiscoverTvResponse;
    } = {
      moviesResult: {},
      tvResults: {},
    };

    if (isIncludeMovie) {
      try {
        const data = await moviedb.discoverMovie({
          page: Number(rest.page) || 1,
          with_genres: movieGenres.map((g: GenreItem) => g.id).join(','),
        });
        ctx.moviesResult = data;
      } catch (e) {
        errors.moviesResult = e;
      }
    }
    if (isIncludeTv) {
      try {
        const data = await moviedb.discoverTv({
          page: Number(rest.page) || 1,
          with_genres: tvGenres.map((g: GenreItem) => g.id).join(','),
        });
        ctx.tvResults = data;
      } catch (e) {
        errors.tvResults = e;
      }
    }

    const data = combineAndOrder(ctx.moviesResult.results || [], ctx.tvResults.results || []);

    const resultsWithImages: (MovieResult | TvResult | undefined)[] = data?.map((r) => ({
      ...r,
      backdrop_path: getImages(r.backdrop_path || ''),
      poster_path: getImages(r.poster_path || ''),
    }));

    const total_results =
      (ctx.moviesResult.total_results || 0) + (ctx.tvResults.total_results || 0);
    const total_pages =
      (ctx.moviesResult.total_pages || 0) > (ctx.tvResults.total_pages || 0)
        ? ctx.moviesResult.total_pages
        : ctx.tvResults.total_pages;
    const page = ctx.moviesResult.page || 1 || ctx.tvResults.page || 1;
    const response = {
      page,
      total_pages,
      total_results,
      results: resultsWithImages,
      errors,
      aiMediaSuggestions,
    };
    res.status(200).json(response);
  } catch (e) {
    const response = {
      page: 0,
      total_pages: 0,
      total_results: 0,
      results: [],
      errors: {
        moviesResult: e,
        tvResults: e,
        aiMediaSuggestions: e,
      },
      aiMediaSuggestions: { title: '', query: {} },
    };
    console.log(e);
    res.status(500).send(response);
  }
}

async function getKeywordsByQuery(query: string) {
  const response = await moviedb.searchKeyword({
    query,
  });
  return response;
}

async function getMediaByKeywords(keywords: string[], mediaType?: 'movie' | 'tv') {
  const keywordIds = await Promise.all(
    keywords.map(async (keyword) => {
      const keywordResponse = await getKeywordsByQuery(pluralize.singular(keyword).trim());
      return keywordResponse.results?.[0]?.id;
    })
  );
  const response = await moviedb.discoverMovie({
    with_keywords: keywordIds.filter((id) => !!id).join('|'),
  });
  return response;
}

async function extractKeywordsUsingOpenAI(
  text: string,
  openAiKey?: string
): Promise<{ keywords: string; title: string }> {
  const openai = new OpenAI({
    apiKey: openAiKey || process.env.OPENAI_API_KEY,
  });
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            "You are an expert on movies and TV shows. From the provided description, identify and extract the three most singular pertinent keywords that can be used to filter movies or TV shows. Exclude keywords such as 'movie'. Additionally, suggest a title based on those keywords. For instance, if the description is 'I want to watch an action movie where the main character has super power with a happy ending', the keywords would be: action, super power, happy ending. Now, based on the following input, identify the keywords and suggest a title:",
        },
        {
          role: 'user',
          content: `From this text: "${text}", provide a response in JSON valid format (besure not to include white space in the keywords string): { "keywords": "keyword1,keyword2,keyword3", "title": "Some title"}`,
        },
      ],
    });

    const assistantMessage = response.choices[0].message.content;
    const jsonResponse = JSON.parse(assistantMessage || '');

    return jsonResponse;
  } catch (error) {
    console.error('Error extracting keywords:', error);
    return {
      keywords: '',
      title: 'Error',
    };
  }
}
