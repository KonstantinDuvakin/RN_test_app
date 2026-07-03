import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { feedApi } from '../api/feedApi';

export function useFeedViewModel(search: string) {
  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    isPlaceholderData,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['feed', search],
    queryFn: ({ pageParam }) => feedApi.getFeed(pageParam, search),
    initialPageParam: 1, // с какой страницы начать
    getNextPageParam: lastPage =>
      lastPage.hasMore ? lastPage.page + 1 : undefined, // какую страницу грузить дальше (undefined = конец)
    getPreviousPageParam: firstPage =>
      firstPage.page > 1 ? firstPage.page - 1 : undefined, // ← для подгрузки назад
    maxPages: 5,
    placeholderData: keepPreviousData, // ← пока грузится новый поиск, показываем прежние данные
  });

  // data.pages — массив страниц. Расплющиваем в один список для FlatList.
  const items = data?.pages.flatMap(p => p.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  return {
    items,
    total,
    isLoading, // первая загрузка
    isFetching, // любой идущий запрос (для индикатора при смене поиска)
    isFetchingNextPage, // подгрузка следующей страницы
    isFetchingPreviousPage,
    isPlaceholder: isPlaceholderData,
    hasNextPage, // есть ли ещё
    hasPreviousPage,
    loadMore: fetchNextPage, // подгрузить следующую
    loadPrevious: fetchPreviousPage,
    errorMessage: error ? 'Ошибка загрузки ленты' : null,
    refetch,
    searchKey: search,
  };
}
