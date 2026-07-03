import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useFeedViewModel } from '../hooks/useFeedViewModel';
import { useCallback, useRef, useState } from 'react';
import { useDebounce } from '../../../shared/hooks/useDebounce.ts';
import { feedScrollMemory } from '../helpers/feedScrollMemory.ts';
import { useThemedStyles } from '../../../shared/theme/useThemedStyles.ts';
import { Theme } from '../../../shared/theme/themes.ts';

export function FeedScreen() {
  const styles = useThemedStyles(makeStyles)

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);
  const vm = useFeedViewModel(debouncedSearch);

  const listRef = useRef<FlatList>(null);
  const isRestoringRef = useRef(false);
  const hasRestoredRef = useRef(false);

  const prevSearchKey = useRef(vm.searchKey);
  // поиск сменился → сбрасываем позицию и разрешаем восстановиться заново
  if (prevSearchKey.current !== vm.searchKey) {
    prevSearchKey.current = vm.searchKey;
    feedScrollMemory.reset(); // новый поиск открывается сверху
    hasRestoredRef.current = false;
  }

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (isRestoringRef.current) return;
    if (viewableItems.length > 0) {
      feedScrollMemory.save(prevSearchKey.current, viewableItems[0].item.id);
    }
  }).current;

  const restorePosition = useCallback(() => {
    if (hasRestoredRef.current) return;
    const savedId = feedScrollMemory.get(vm.searchKey);
    if (!savedId) {
      hasRestoredRef.current = true;
      return;
    }

    const index = vm.items.findIndex(it => it.id === savedId);
    if (index > 0) {
      isRestoringRef.current = true;
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({
          index,
          animated: false,
          viewPosition: 0,
        });
        setTimeout(() => {
          isRestoringRef.current = false;
        }, 300);
      });
    }
    hasRestoredRef.current = true;
  }, [vm.items, vm.searchKey]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Поиск по ленте (напр. 1, 5, 11)"
          value={searchInput}
          onChangeText={setSearchInput}
          autoCapitalize="none"
        />
        {/* индикатор справа в поле: крутится, пока input не догнал debounced или идёт запрос */}
        {(searchInput !== debouncedSearch || vm.isFetching) && (
          <ActivityIndicator style={styles.inputSpinner} />
        )}
      </View>
      <Text style={styles.found}>Найдено: {vm.total}</Text>

      <View style={[styles.listArea, vm.isPlaceholder && { opacity: 0.5 }]}>
        <FlatList
          ref={listRef}
          data={vm.isLoading ? [] : vm.items}
          keyExtractor={item => item.id}
          // (1) удержание позиции при подгрузке сверху — список не прыгает
          maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onLayout={restorePosition}
          // важно: чтобы scrollToIndex не падал на элементах вне окна рендера
          onScrollToIndexFailed={info => {
            setTimeout(() => {
              listRef.current?.scrollToIndex({
                index: info.index,
                animated: false,
              });
            }, 100);
          }}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.title}>{item.title}</Text>
            </View>
          )}
          ListEmptyComponent={
            vm.isLoading ? (
              <ActivityIndicator size="large" /> // грузится — спиннер
            ) : (
              <Text style={styles.empty}>Ничего не найдено</Text>
            ) // реально пусто
          }
          // подгрузка вниз
          onEndReached={() => {
            if (vm.hasNextPage && !vm.isFetchingNextPage) vm.loadMore();
          }}
          onEndReachedThreshold={0.5}
          // подгрузка вверх (когда дальние страницы выгрузились через maxPages)
          onStartReached={() => {
            if (vm.hasPreviousPage && !vm.isFetchingPreviousPage)
              vm.loadPrevious();
          }}
          onStartReachedThreshold={0.5}
          ListHeaderComponent={
            vm.isFetchingPreviousPage ? (
              <ActivityIndicator style={{ padding: 16 }} />
            ) : null
          }
          ListFooterComponent={
            vm.isFetchingNextPage ? (
              <ActivityIndicator style={{ padding: 16 }} />
            ) : !vm.hasNextPage ? (
              <Text style={styles.end}>Это всё 🎉</Text>
            ) : null
          }
        />
      </View>
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    container: { flex: 1 },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: t.spacing(3),
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 12,
      fontSize: 16,
    },
    inputSpinner: { position: 'absolute', right: t.spacing(6) },
    found: { padding: 12, color: '#666' },
    listArea: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    empty: { fontSize: 16, color: t.colors.textMuted },
    row: { padding: 18, borderBottomWidth: 1, borderBottomColor: '#eee' },
    title: { fontSize: 16 },
    end: { textAlign: 'center', padding: 20, color: t.colors.textMuted },
  });
