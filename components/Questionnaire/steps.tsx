import { MediaType, allGenres } from '@/config/mediaData'
import { ReactNode } from 'react'
import { CardsList, convertToListItem, ListItem } from '../CardList'
import { useQuestionnaireContext } from './Context'
import { Input, Textarea } from '@nextui-org/react'

const StepWrapper = ({
  title,
  children
}: {
  title: string
  children: ReactNode
}) => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <h3 className='text-2xl font-semibold leading-tight mb-4'>{title}</h3>
      {children}
    </div>
  )
}

export function SelectMediaType() {
  const context = useQuestionnaireContext()
  const list: MediaType[] = [
    {
      id: 'movie',
      label: 'Movie',
      image: '/images/action-movie.jpeg'
    },
    {
      id: 'tv',
      label: 'Tv Show',
      image: '/images/action-movie.jpeg'
    }
  ]
  function handlePress(item: ListItem) {
    if (!context.state.mediaType.find((s) => s?.id === item.id)) {
      context.addMediaType(item)
    } else {
      context.removeMediaType(item.id)
    }
  }
  return (
    <StepWrapper title='What are you in the mood for?'>
      <CardsList
        selected={context.state.mediaType}
        onPress={handlePress}
        list={list}
        colSpan={'col-span-6'}
      />
    </StepWrapper>
  )
}
export function SelectGenre() {
  const context = useQuestionnaireContext()
  const isMovieGenresIncluded = !!context.state.mediaType.find(
    (g) => g.id === 'movie'
  )
  const isTvGenresIncluded = !!context.state.mediaType.find(
    (g) => g.id === 'tv'
  )
  const desiredGenres = allGenres(isMovieGenresIncluded, isTvGenresIncluded)
  const list = convertToListItem(desiredGenres, {
    id: 'id',
    label: 'name',
    image: 'image'
  })
  function handlePress(item: ListItem) {
    if (!context.state.genre.find((s) => s?.id === item.id)) {
      context.addGenre(item)
    } else {
      context.removeGenre(item.id)
    }
  }
  return (
    <StepWrapper title="Choose a genre or two that you'd like to watch">
      <CardsList
        selected={context.state.genre}
        onPress={handlePress}
        list={list}
        colSpan='col-span-3'
      />
    </StepWrapper>
  )
}

export function AiPrompt() {
  const context = useQuestionnaireContext()
  function handleChange(str: string) {
    context.updateAiPrompt(str)
  }
  return (
    <StepWrapper title='Tell our AI what you wana watch (*Optional & not yet implemented)'>
      <Textarea
        value={context.state.aiPrompt}
        onValueChange={handleChange}
        placeholder="'I'm in the mood for a sad movie that has a happy ending'"
      />
    </StepWrapper>
  )
}
