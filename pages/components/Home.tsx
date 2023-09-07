import MainCard from '@/components/MainCard'
import { useQuestionnaireContext } from '@/components/Questionnaire/Context'
import { RowContainer } from '@/components/RowContainer'
import { tvShowGenres } from '@/config/mediaData'
import { useFetchApi } from '@/hooks/useFetchApi'
import {
  Accordion,
  AccordionItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  useDisclosure
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { MovieDb, DiscoverMovieResponse } from 'moviedb-promise'
import { createEmptyArray } from '@/helpers/arrayHelpers'
import { useFetchApiLazy } from '@/hooks/useFetchApiLazy'

const PAGINATED_COUNT = 20

export default function Home() {
  const context = useQuestionnaireContext()
  const [filteredMovies, setFilteredMovies] = useState<any[]>([])
  const [currentAmount, setCurrentAmount] = useState(PAGINATED_COUNT)
  const [selectedMovie, setSelectedMovie] = useState<any | undefined>()
  const trendingMovies = useFetchApi<DiscoverMovieResponse>('/api/movies')
  const [getMovies, getMovieReq] =
    useFetchApiLazy<DiscoverMovieResponse>('/api/movies')
  const [getTvShows, getTvShowsReq] =
    useFetchApiLazy<DiscoverMovieResponse>('/api/tvShows')
  const mediaModal = useDisclosure()

  const trending = tvShowGenres
  const filteredMedias = tvShowGenres
  const filteredTitle = 'Moves & Tv Shows that match your asks'
  const allFilters = 'Movies & Tv Shows > Action, Horror'

  async function handleCardPress(movie: any, isLoadMore?: boolean) {
    if (isLoadMore) {
      const movies = await getMovies({
        includeTvShows: context.state.mediaType.length === 2,
        genres: context.state.genre,
        page: Math.floor(
          (filteredMovies.length + PAGINATED_COUNT) / PAGINATED_COUNT
        )
      })
      if (movies?.results) {
        setFilteredMovies([...filteredMovies, ...movies?.results])
      }
      setCurrentAmount(currentAmount + PAGINATED_COUNT)
    } else {
      setSelectedMovie(movie)
      mediaModal.onOpen()
    }
  }

  function handleModalClose() {
    setSelectedMovie(undefined)
    mediaModal.onClose()
  }

  async function handleDataInitialization() {
    const movies = await getMovies({
      includeTvShows: context.state.mediaType.length === 2,
      genres: context.state.genre
    })
    console.log(movies)

    if (movies?.results) {
      setFilteredMovies([...filteredMovies, ...movies?.results])
    }
  }

  useEffect(() => {
    handleDataInitialization()
  }, [])
  return (
    <div>
      <RowContainer isScrollable title='Trending'>
        {createEmptyArray(20).map((_, i) => {
          const media = trendingMovies.data?.results?.[i]
          return (
            <MainCard
              key={`trending-${media?.id || i}`}
              onPress={() => handleCardPress(media)}
              width={200}
              title={media?.title || ''}
              image={media?.poster_path}
            />
          )
        })}
      </RowContainer>
      <div>
        <RowContainer
          title={
            <Accordion>
              <AccordionItem
                key='1'
                aria-label='Accordion 1'
                subtitle='Press to see filters'
                title={filteredTitle}
              >
                {allFilters}
              </AccordionItem>
            </Accordion>
          }
        >
          {createEmptyArray(currentAmount + 1).map((_, i) => {
            const media = filteredMovies[i]
            const isLoadMore = !!(filteredMovies.length && !media)
            return (
              <MainCard
                key={`filtered-${media?.id || i}`}
                isLoadMore={isLoadMore}
                isTv={!!media?.name}
                onPress={() => handleCardPress(media, isLoadMore)}
                title={media?.title || media?.name || ''}
                image={media?.poster_path}
                width={200}
              />
            )
          })}
        </RowContainer>
      </div>

      <Modal isOpen={mediaModal.isOpen} onClose={handleModalClose}>
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>Modal Title</ModalHeader>
          <ModalBody></ModalBody>
          <ModalFooter>
            <Button color='danger' variant='light' onPress={handleModalClose}>
              Close
            </Button>
            <Button color='primary' onPress={handleModalClose}>
              Action
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
