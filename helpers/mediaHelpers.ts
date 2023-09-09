import { ListItem } from "@/components/CardList"
import { allGenres } from "@/config/mediaData"
import { Media } from "@/types"
import { MovieResponse, ShowResponse } from "moviedb-promise"

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
