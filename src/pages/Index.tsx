import { useInfiniteQuery } from "@tanstack/react-query";
import { RedditPost } from "@/components/RedditPost";
import { RefreshConfig, type RefreshInterval } from "@/components/RefreshConfig";
import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

interface RedditPost {
  data: {
    title: string;
    url: string;
    score: number;
    author: string;
    created_utc: number;
    num_comments: number;
  };
}

interface RedditApiResponse {
  data: {
    after: string | null;
    children: RedditPost[];
  };
}

const Index = () => {
  const [refreshInterval, setRefreshInterval] = useState<RefreshInterval>(300000);
  const [nextUpdate, setNextUpdate] = useState<number>(refreshInterval);
  const { toast } = useToast();
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    dataUpdatedAt,
    refetch
  } = useInfiniteQuery<RedditApiResponse>({
    queryKey: ["redditTrends"],
    queryFn: async ({ pageParam }) => {
      console.log("Fetching Reddit trends, after:", pageParam);
      const response = await fetch(
        `https://www.reddit.com/r/all/top.json?limit=30&t=day&after=${pageParam}`
      );
      const data = await response.json();
      console.log("Fetched posts:", data.data.children);
      if (pageParam === "") {
        toast({
          title: "Data Updated",
          description: "Reddit trends have been refreshed",
        });
        // Scroll to top when data is refreshed
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return data;
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.data.after || undefined,
    refetchInterval: refreshInterval,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const timeLeft = Math.max(0, refreshInterval - (Date.now() - dataUpdatedAt));
      setNextUpdate(timeLeft);
      if (timeLeft === 0) {
        refetch(); // Force a refresh when the timer hits 0
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshInterval, dataUpdatedAt, refetch]);

  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isFetchingNextPage && hasNextPage) {
        console.log("Loading more posts...");
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [onIntersect]);

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp * 1000) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
      }
    }
    return "just now";
  };

  const formatNextUpdate = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 
      ? `${minutes}m ${seconds % 60}s`
      : `${seconds}s`;
  };

  const allPosts = data?.pages.flatMap((page) => page.data.children) ?? [];

  return (
    <div className="min-h-screen bg-hn-background">
      <header className="bg-hn-orange p-2">
        <div className="container max-w-5xl flex justify-between items-center">
          <h1 className="text-white font-bold">Reddit Trends</h1>
          <div className="text-white text-sm">
            Next update in: {formatNextUpdate(nextUpdate)}
          </div>
        </div>
      </header>

      <main className="container max-w-5xl py-4">
        {isLoading ? (
          <div className="text-center py-8">Loading trends...</div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {allPosts.map((post: RedditPost) => (
                <RedditPost
                  key={post.data.url}
                  title={post.data.title}
                  url={post.data.url}
                  score={post.data.score}
                  author={post.data.author}
                  createdAt={formatTimeAgo(post.data.created_utc)}
                  commentsCount={post.data.num_comments}
                />
              ))}
            </div>
            <div
              ref={observerTarget}
              className="py-4 text-center text-hn-secondary"
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Scroll for more"
                : "No more posts"}
            </div>
          </>
        )}
      </main>

      <RefreshConfig onIntervalChange={setRefreshInterval} />
    </div>
  );
};

export default Index;
