import MainCard from '@/components/MainCard'
import { useQuestionnaireContext } from '@/components/Questionnaire/Context'
import { RowContainer } from '@/components/RowContainer'
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
import { MovieResult, TvResult } from 'moviedb-promise'
import { createEmptyArray } from '@/helpers/arrayHelpers'
import { useFetchApiLazy } from '@/hooks/useFetchApiLazy'
import { MediaResponse } from '../api/media'
import { ListItem } from '@/components/CardList'
import { Media } from '@/types'
import { MediaDescription } from '@/components/MediaDescription'
import { useWindowSize } from '@/hooks/useWindowSize'

const PAGINATED_COUNT = 20
export default function Home() {
  const context = useQuestionnaireContext()
  const paginatedCount = context.state.mediaType.length === 2 ? 2 * PAGINATED_COUNT : PAGINATED_COUNT

  const [filteredMovies, setFilteredMovies] = useState<(MovieResult | TvResult | undefined)[]>([])
  const [selectedMedia, setSelectedMedia] = useState<Media>()
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const trendingMovies = useFetchApi<MediaResponse>('/api/trending', { variables: { media_type: 'movie' } })
  const trendingTvShows = useFetchApi<MediaResponse>('/api/trending', { variables: { media_type: 'tv' } })
  const [getMovies, getMovieReq] = useFetchApiLazy<MediaResponse>('/api/media')
  const mediaModal = useDisclosure()
  const { width } = useWindowSize()

  const isWidthBreak = (width || 500) < 450
  const filteredTitle = 'Moves & Tv Shows that match your asks'
  const allFilters = getFilteredMovieTitle(context.state.mediaType, context.state.genre)
  const displayedMedia = (
    filteredMovies && filteredMovies?.length < paginatedCount
      ? filteredMovies : createEmptyArray(paginatedCount)
  )

  async function goToPage(page: number) {
    const movies = await getMovies({
      mediaTypes: context.state.mediaType.map((l) => l.id),
      genres: context.state.genre,
      page
    })
    setCurrentPage(page)
    if (movies?.results) {
      setFilteredMovies(movies?.results)
    }
  }

  async function handleCardPress(movie: any, isLoadMore?: boolean) {
    setSelectedMedia(movie)
    mediaModal.onOpen()
  }

  function handleModalClose() {
    setSelectedMedia(undefined)
    mediaModal.onClose()
  }

  async function handleDataInitialization() {
    // TODO: add tv shows support
    const media = await getMovies({
      mediaTypes: context.state.mediaType.map((l) => l.id),
      genres: context.state.genre,
    })

    if (media?.results) {
      // TODO: total_pages issue
      setTotal(media?.total_pages || 0)
      setFilteredMovies(media?.results)
    }
  }

  useEffect(() => {
    if (!context.questionsModalDisclosure.isOpen) {
      handleDataInitialization()
    }
  }, [context.questionsModalDisclosure.isOpen])
  return (
    <>
      <div>
        <RowContainer isScrollable title='Trending: Movies'>
          {createEmptyArray(20).map((_, i) => {
            const media = trendingMovies.data?.results?.[i]
            return (
              <MainCard
                key={`trending-${media?.id || i}`}
                onPress={() => handleCardPress(media)}
                width={200}
                // title={media?.title || ''}
                image={media?.poster_path}
              />
            )
          })}
        </RowContainer>

        <RowContainer isScrollable title='Trending: Tv Shows'>
          {createEmptyArray(20).map((_, i) => {
            const media = trendingTvShows.data?.results?.[i]
            return (
              <MainCard
                key={`trending-${media?.id || i}`}
                onPress={() => handleCardPress(media)}
                width={200}
                // title={media?.title || ''}
                image={media?.poster_path}
              />
            )
          })}
        </RowContainer>
        <RowContainer
          title={
            <>
              <Accordion>
                <AccordionItem
                  key='1'
                  aria-label='filtered-media'
                  subtitle='Press to see filters'
                  title={filteredTitle}
                >
                  {allFilters}
                </AccordionItem>
              </Accordion>
              {!!total && <Pagination
                page={currentPage}
                onChange={goToPage}
                showControls
                total={total}
                size="lg"
              />}
            </>
          }
        >
          {displayedMedia.map((_, i) => {
            const media = filteredMovies?.[i]
            const title = getMediaTitle(media)
            const key = `filtered-${title + media?.id || ''}`
            return (
              <MainCard
                isLoading={getMovieReq.loading}
                key={key}
                isTv={media && 'name' in media}
                onPress={() => handleCardPress(media)}
                // title={title}
                image={media?.poster_path}
                width={isWidthBreak ? 170 : 200}
              />
            )
          })}
        </RowContainer>
        <div className='mt-10'>
          {!!total && <Pagination
            page={currentPage}
            onChange={goToPage}
            showControls
            total={total}
            size="lg"
          />}
        </div>

      </div>
      <Modal
        placement='top-center'
        size='full'
        isOpen={mediaModal.isOpen}
        onClose={handleModalClose}
        style={{ height: '100%', overflow: 'scroll' }}
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>{getMediaTitle(selectedMedia)}</ModalHeader>
          <ModalBody>
            <MediaDescription media={selectedMedia} />
            <ModalFooter>
              <Button color='danger' variant='light' onPress={handleModalClose}>
                Close
              </Button>
              <Button color='primary' onPress={handleModalClose}>
                Action
              </Button>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal >
    </>

  )
}
function getMediaTitle(media: Media) {
  let title = ``
  if (media && 'title' in media) {
    title = `${media.title}`
  }
  if (media && 'name' in media) {
    title = `${media.name}`
  }
  return title
}
function getFilteredMovieTitle(mediaType: ListItem[], genre: ListItem[]) {
  const movieTitle = !!mediaType.find(m => m.id === 'movie') ? 'Movies' : ''
  const tvShowTitle = !!mediaType.find(m => m.id === 'tv') ? 'Tv Shows' : ''
  const arrowSign = movieTitle && tvShowTitle ? ' & ' : ''
  const mediaTypeTitle = movieTitle + arrowSign + tvShowTitle
  const allFilters = `${mediaTypeTitle} > ${genre.map((l) => l.label).join(' | ')}`

  return allFilters
}