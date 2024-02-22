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
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { MovieResult, TvResult } from 'moviedb-promise'
import { createEmptyArray } from '@/helpers/arrayHelpers'
import { useFetchApiLazy } from '@/hooks/useFetchApiLazy'
import { MediaNextApiRequest, MediaResponse } from '../pages/api/media'
import { ListItem } from '@/components/CardList'
import { Media } from '@/types'
import { MediaDescription } from '@/components/MediaDescription'
import { useWindowSize } from '@/hooks/useWindowSize'
import { getImages, getMediaInfo } from '@/helpers/mediaHelpers'
import { useRouter } from 'next/router'
import { GenreItem } from '@/config/mediaData'

const PAGINATED_COUNT = 20
export default function Home() {
  const router = useRouter()
  const page = (router.query.mediaSearchPage as string) || null

  const context = useQuestionnaireContext()
  const paginatedCount = context.state.mediaType.length === 2 ? 2 * PAGINATED_COUNT : PAGINATED_COUNT

  const [filteredMovies, setFilteredMovies] = useState<(MovieResult | TvResult | undefined)[]>([])
  const [aiSuggestions, setAiSuggestions] = useState<MediaResponse['aiMediaSuggestions']>()
  const [selectedMedia, setSelectedMedia] = useState<Media>()
  const [currentPage, setCurrentPage] = useState(Number(page) || 1);
  const [total, setTotal] = useState(0);

  const trendingMovies = useFetchApi<MediaResponse>('/api/trending', { variables: { media_type: 'movie' } })
  const trendingTvShows = useFetchApi<MediaResponse>('/api/trending', { variables: { media_type: 'tv' } })
  const [getMedia, getMediaReq] = useFetchApiLazy<MediaResponse, MediaNextApiRequest['body']>('/api/media')
  // const [getAiSuggestion, getAiSuggestionReq] = useFetchApiLazy<MediaResponse>('/api/media')
  const { width } = useWindowSize()

  const isWidthBreak = (width || 500) < 450
  const filteredTitle = 'Moves & Tv Shows that match your asks'
  const allFilters = getFilteredMovieTitle(context.state.mediaType, context.state.genre)
  const displayedMedia = (
    filteredMovies && filteredMovies?.length < paginatedCount
      ? filteredMovies : createEmptyArray(paginatedCount)
  )

  async function goToPage(page: number) {
    const movies = await getMedia({
      mediaTypes: context.state.mediaType.map((l) => l.id),
      genres: context.state.genre as unknown as GenreItem[],
      page,
    })
    router.push({
      query: { mediaSearchPage: page },
    }, undefined, { scroll: false })
    setCurrentPage(page)
    if (movies?.results) {
      setFilteredMovies(movies?.results)
    }
  }

  async function handleCardPress(media: Media) {
    setSelectedMedia(media)
    router.push({
      query: { id: media?.id, mediaType: media && 'name' in media ? "tv" : 'movie' },
    }, undefined, { scroll: false })
  }

  function handleModalClose() {
    router.push('/', undefined, { scroll: false })
    setSelectedMedia(undefined)
  }

  async function handleDataInitialization() {
    // TODO: add tv shows support
    const media = await getMedia({
      mediaTypes: context.state.mediaType.map((l) => l.id),
      genres: context.state.genre as unknown as GenreItem[],
      userInput: context.state.aiPrompt,
      page
    })
    if (media?.results) {
      // TODO: total_pages issue
      setTotal(media?.total_pages || 0)
      setFilteredMovies(media?.results)
      setAiSuggestions(media?.aiMediaSuggestions)
    }
  }

  useEffect(() => {
    if (!context.questionsModalDisclosure.isOpen) {
      handleDataInitialization()
    }
  }, [context.questionsModalDisclosure.isOpen, router.query.mediaSearchPage])

  return (
    <>
      <div>
        <RowContainer isScrollable title='Trending: Movies'>
          {createEmptyArray(20).map((_, i) => {
            const media = trendingMovies.data?.results?.[i]
            // const { title } = getMediaInfo(media)

            return (
              <MainCard
                key={`trending-${media?.id || i}`}
                onPress={() => handleCardPress(media)}
                width={200}
                // title={title}
                image={getImages(media?.poster_path || '')}
              />
            )
          })}
        </RowContainer>

        <RowContainer isScrollable title='Trending: Tv Shows'>
          {createEmptyArray(20).map((_, i) => {
            const media = trendingTvShows.data?.results?.[i]
            // const { title } = getMediaInfo(media)
            return (
              <MainCard
                key={`trending-${media?.id || i}`}
                onPress={() => handleCardPress(media)}
                width={200}
                // title={title}
                image={getImages(media?.poster_path || '')}
              />
            )
          })}
        </RowContainer>
        {!!aiSuggestions?.title && <RowContainer
          isScrollable
          title={<>
            <>
              <Accordion>
                <AccordionItem
                  key='1'
                  aria-label='ai-suggested-media'
                  subtitle='Press to see prompt'
                  title={aiSuggestions.title}
                >
                  {context.state.aiPrompt}
                </AccordionItem>
              </Accordion>

            </>
          </>}
        >
          {createEmptyArray(20).map((_, i) => {
            const media = aiSuggestions.query.results?.[i]
            return (
              <MainCard
                key={`aiSuggestions-${media?.id || i}`}
                onPress={() => handleCardPress(media)}
                width={200}
                // TODO: decide if this should be on server or not
                image={getImages(media?.poster_path || '')}
              />
            )
          })}
        </RowContainer>}
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
            const { title } = getMediaInfo(media)
            const key = `filtered-${title + media?.id || ''}`
            return (
              <MainCard
                isLoading={getMediaReq.loading}
                key={key}
                isTv={media && 'name' in media}
                onPress={() => handleCardPress(media)}
                // title={title}
                image={getImages(media?.poster_path || '')}
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
        isOpen={!!router.query.id}
        onClose={handleModalClose}
        style={{ height: '100%', overflow: 'scroll' }}
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'></ModalHeader>
          <ModalBody>
            <MediaDescription media={selectedMedia} />
            <ModalFooter>
              <Button color='danger' variant='light' onPress={handleModalClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal >
    </>

  )
}

function getFilteredMovieTitle(mediaType: ListItem[], genre: ListItem[]) {
  const movieTitle = !!mediaType.find(m => m.id === 'movie') ? 'Movies' : ''
  const tvShowTitle = !!mediaType.find(m => m.id === 'tv') ? 'Tv Shows' : ''
  const arrowSign = movieTitle && tvShowTitle ? ' & ' : ''
  const mediaTypeTitle = movieTitle + arrowSign + tvShowTitle
  const allFilters = `${mediaTypeTitle} > ${genre.map((l) => l.label).join(' | ')}`

  return allFilters
}