import { useEffect, useRef, useState, ReactNode } from "react";

interface InfiniteScrollProps<T> {
  fetchData: (page: number) => Promise<T[]>;
  renderItem: (item: T, index: number) => ReactNode;
  hasMore: boolean;
  initialPage?: number;
  className?: string;
}


function InfiniteScroll<T>({ fetchData, renderItem, hasMore, initialPage = 1, className = "" }: InfiniteScrollProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const loader = useRef<HTMLDivElement | null>(null);

  // Resetar itens e página quando a key do componente muda (ex: categoria)
  useEffect(() => {
    setItems([]);
    setPage(initialPage);
  }, [className, initialPage]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const newItems = await fetchData(page);
      setItems(prev => page === 1 ? newItems : [...prev, ...newItems]);
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    if (!hasMore || loading) return;
    const handleScroll = () => {
      if (!loader.current) return;
      const { top } = loader.current.getBoundingClientRect();
      if (top < window.innerHeight + 100) {
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  return (
    <div className={className}>
      {items.map((item, idx) => renderItem(item, idx))}
      <div ref={loader} />
      {loading && <div className="text-center py-4 text-gray-400">Carregando...</div>}
    </div>
  );
}

export default InfiniteScroll;
