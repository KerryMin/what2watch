import { MovieDb, SearchMultiResponse } from 'moviedb-promise';
import { NextApiRequest, NextApiResponse } from 'next';

const moviedb = new MovieDb(process.env.TMDB_KEY || '');

export interface SearchResponse {
  multiResults?: SearchMultiResponse;
  error: any;
}
export interface SearchNextApiRequest extends NextApiRequest {
  body: {
    page?: number | string | null;
    query: string;
  };
}
export default async function handler(
  req: SearchNextApiRequest,
  res: NextApiResponse<SearchResponse>
) {
  try {
    const { body } = req;
    const page = Number(body.page) || 1;
    console.log('QUERY', body.query);
    const multiResults = await moviedb.searchMulti({ page, query: body.query });

    res.status(200).send({ multiResults, error: undefined });
  } catch (error) {
    res.status(500).send({ multiResults: undefined, error });
  }
}
