import React, { useState } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Input,
    Button,
    Pagination,
} from '@nextui-org/react'
import {
    useQuestionnaireContext
} from '@/components/Questionnaire/Context'
import { SearchIcon } from './icons'
import MainCard from './MainCard'
import { RowContainer } from './RowContainer'
import { useFetchApiLazy } from '@/hooks/useFetchApiLazy'
import { SearchNextApiRequest, SearchResponse } from '@/pages/api/search'
import { getMediaInfo } from '@/helpers/mediaHelpers'
import { Media } from '@/types'
import { useRouter } from 'next/router'
import { MovieResult, TvResult } from 'moviedb-promise'

export function SearchModal() {
    const router = useRouter()
    const context = useQuestionnaireContext()
    const {
        searchModalDisclosure
    } = context
    const [query, setQuery] = useState('')
    const [queryResults, setQueryResults] = useState<SearchResponse['multiResults']>()
    const [search] = useFetchApiLazy<{ multiResults: SearchResponse['multiResults'] }, SearchNextApiRequest['body']>('/api/search')

    const handleClose = () => {
        searchModalDisclosure.onClose()
    }

    function handleCardPress(media: Media) {
        router.push({
            query: { id: media?.id, mediaType: media && 'name' in media ? "tv" : 'movie' },
        }, undefined, { scroll: false })
    }

    async function handleSearch(page = 1) {
        const res = await search({ query, page })
        setQueryResults(res?.multiResults)
    }

    return (
        <>
            <Modal
                scrollBehavior={'inside'}
                size='4xl'
                backdrop={'blur'}
                isOpen={searchModalDisclosure.isOpen}
                onClose={handleClose}
            >
                <ModalContent>
                    <>
                        <ModalHeader className='flex flex-col gap-1'>
                            <Input
                                onChange={e => setQuery(e.currentTarget.value)}
                                aria-label="Search"
                                placeholder="Search..."
                                endContent={
                                    <Button onClick={() => handleSearch()}>Execute</Button>
                                }
                                startContent={
                                    <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
                                }
                            />
                        </ModalHeader>
                        <ModalBody>
                            <div className='mt-10'>
                                {!!queryResults?.total_pages && <Pagination
                                    page={1}
                                    onChange={handleSearch}
                                    showControls
                                    total={queryResults.total_pages}
                                    size="lg"
                                />}
                            </div>
                            {!!queryResults?.results && <RowContainer title='Results'>
                                {queryResults?.results?.map((_, i) => {
                                    const media = queryResults?.results?.[i] as MovieResult | TvResult
                                    const { image } = getMediaInfo(media)
                                    return (
                                        <MainCard
                                            key={`search-${media?.id || i}`}
                                            onPress={() => handleCardPress(media)}
                                            width={100}
                                            height={150}
                                            image={image}
                                        />
                                    )
                                })}
                            </RowContainer>}
                        </ModalBody>
                    </>
                </ModalContent>
            </Modal>
        </>
    )
}