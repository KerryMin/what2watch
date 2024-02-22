import { HandThumbUpIcon, HandThumbDownIcon, HeartIcon } from '@heroicons/react/24/solid';
import { getGenres, getMediaInfo, getMediaTitle } from "@/helpers/mediaHelpers";
import { DetailsNextApiResponse, TrendingNextApiRequest } from "@/pages/api/media-details";
import { Media } from "@/types";
import { Skeleton } from "@nextui-org/react";
import JustWatchWidget from "./JustWatchWidget";
import { RowContainer } from "./RowContainer";
import MainCard from "./MainCard";
import { useCallback, useEffect, useState } from 'react';
import { useFetchApiLazy } from '@/hooks/useFetchApiLazy';
import { useRouter } from 'next/router';
import { MediaNextApiRequest } from '@/pages/api/media';

export function MediaDescription({ media }: { media: Media }) {
    const router = useRouter()
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [data, setData] = useState<DetailsNextApiResponse>();
    const [currentMedia, setCurrentMedia] = useState<Media>(media);
    const getMediaInfoCb = useCallback(() => {
        return data ? getMediaInfo(data.details) : getMediaInfo(currentMedia)
    }, [data, currentMedia])
    const [getMediaDetails, getMediaDetailQuery] = useFetchApiLazy<DetailsNextApiResponse, TrendingNextApiRequest['body']>('/api/media-details')
    const loading = getMediaDetailQuery.loading
    const { id, title, image, mediaType, runtime, description } = getMediaInfoCb()

    function handleCardPress(media: Media) {
        router.push({
            query: { id: media?.id, mediaType: media && 'name' in media ? "tv" : 'movie' },
        }, undefined, { scroll: false })
        setCurrentMedia(media)
    }
    async function getDetails() {
        const details = await getMediaDetails({
            id: Number(router.query.id),
            media_type: router.query.mediaType as 'tv' | 'movie',
        })
        if (details) {
            setData(details)
        }
    }
    useEffect(() => {
        getDetails()
    }, [router.query.id])

    return (
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            <div className="md:w-1/3 mb-4 md:mb-0 flex-shrink-0 flex flex-col items-center">
                <Skeleton isLoaded={!loading} className="flex w-full h-auto justify-center items-center mb-4">
                    <img
                        src={image}
                        alt={`details-${title}`}
                        className="max-h-[450px] rounded-lg shadow-lg"
                    />
                </Skeleton>
                <div className="flex space-x-2 mt-4">
                    <button
                        className={`p-2 rounded-full ${isLiked ? 'bg-blue-700' : 'bg-gray-500'} hover:bg-blue-600`}
                        onClick={() => setIsLiked(prev => !prev)}
                    >
                        <HandThumbUpIcon className="h-6 w-6 text-white" />
                    </button>
                    <button
                        className={`p-2 rounded-full ${isDisliked ? 'bg-red-700' : 'bg-gray-500'} hover:bg-red-600`}
                        onClick={() => setIsDisliked(prev => !prev)}
                    >
                        <HandThumbDownIcon className="h-6 w-6 text-white" />
                    </button>
                    <button
                        className={`p-2 rounded-full ${isFavorited ? 'bg-yellow-700' : 'bg-gray-500'} hover:bg-yellow-600`}
                        onClick={() => setIsFavorited(prev => !prev)}
                    >
                        <HeartIcon className="h-6 w-6 text-white" />
                    </button>
                </div>

                {/* Displaying genres and runtime */}
                <div className="mt-4 space-y-2 text-center">
                    <div className="text-gray-400">
                        <span className="font-medium">Genres: </span>
                        {data?.details?.genres?.map((genre, index) => (
                            <span key={genre.id} className="text-gray-300">
                                {genre.name}{index !== (data?.details?.genres?.length || 0) - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </div>
                    <div className="text-gray-400">
                        <span className="font-medium">Runtime: </span>
                        {runtime ? `${runtime} mins` : 'Unknown'}
                    </div>
                </div>
            </div>

            <div className="md:w-2/3 md:pl-4 pr-2">
                <div className="space-y-2">
                    <Skeleton isLoaded={!loading} className="h-auto">
                        <h2 className="text-2xl font-semibold text-gray-200 break-words">{title}</h2>
                    </Skeleton>

                    <Skeleton isLoaded={!loading} className="w-auto h-auto">
                        <p className="text-lg text-gray-400 italic break-words">{data?.details?.tagline}</p>
                    </Skeleton>
                </div>

                <Skeleton isLoaded={!loading} className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-300 mb-2">Description</h4>
                    <p className="text-gray-400 leading-relaxed">{description}</p>
                </Skeleton>

                {!loading && id && (
                    <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-md">
                        <h4 className="text-lg font-medium text-gray-300 mb-4">Available On</h4>
                        <JustWatchWidget
                            title={title}
                            id={id?.toString()}
                            objectType={mediaType}
                        />
                    </div>
                )}

                {!!data?.similar?.results?.length && <RowContainer isScrollable title='You might like these!'>
                    {data?.similar?.results?.map((media, i) => (
                        <MainCard
                            key={`${currentMedia?.id}-${i}`}
                            onPress={() => handleCardPress(media)}
                            width={200}
                            height={300}
                            image={media?.poster_path}
                        />
                    ))}
                </RowContainer>}
            </div>
        </div>
    );
}
