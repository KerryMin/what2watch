import { ListItem } from "@/components/CardList"
import { allGenres } from "@/config/mediaData"
import { Media } from "@/types"
import { MovieResponse, ShowResponse } from "moviedb-promise"

import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export function getMediaTitle(media: Media | ShowResponse | MovieResponse) {
    let title = ``
    if (media && 'title' in media) {
      title = `${media.title}`
    }
    if (media && 'name' in media) {
      title = `${media.name}`
    }
    return title
  }
  export function getFilteredMovieTitle(mediaType: ListItem[], genre: ListItem[]) {
    const movieTitle = !!mediaType.find(m => m.id === 'movie') ? 'Movies' : ''
    const tvShowTitle = !!mediaType.find(m => m.id === 'tv') ? 'Tv Shows' : ''
    const arrowSign = movieTitle && tvShowTitle ? ' & ' : ''
    const mediaTypeTitle = movieTitle + arrowSign + tvShowTitle
    const allFilters = `${mediaTypeTitle} > ${genre.map((l) => l.label).join(' | ')}`
  
    return allFilters
  }

  export function getGenres(ids?: number[]){
    if (!ids) return []
    return ids.map((id) => {
      const genre = allGenres(true, true).find((g) => g.id === id)
      return genre ? genre.name : ''
    })
  }

export function getImages(imagePath: string) {
  return `https://image.tmdb.org/t/p/w400/${imagePath}`
}

export function getFeasibleDate(releaseYear: number) {
  const currentYear = new Date().getFullYear();

  let upperDifference = releaseYear + 5 - currentYear;
  let lowerDifference = releaseYear - 1900;

  if (releaseYear + 5 > currentYear) {
      return currentYear - releaseYear; // amount of years between the current and release year
  }
  
  if (releaseYear - 5 < 1900) {
      return releaseYear - 1900; // amount of years between the release and 1900
  }
  
  // If neither condition is met, then return a default of 5 (based on your original criteria)
  return 5; 
}
export const extractKeywordsUsingOpenAI = async (text:string) => {
  try {
      const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
              {"role": "system", "content": "You are a helpful assistant that extracts main keywords from given text."},
              {"role": "user", "content": `Extract the main keywords from the following text: "${text}"`}
          ],
      });

      const assistantMessage = response.choices[0].message.content;
      // Assuming the response from the assistant will be a comma-separated list of keywords
      return assistantMessage?.trim().split(", ");
  } catch (error) {
      console.error("Error extracting keywords:", error);
      return [];
  }
};
