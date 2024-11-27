import { useQuery } from "@tanstack/react-query";
import { RedditPost } from "@/components/RedditPost";
import { RefreshConfig, type RefreshInterval } from "@/components/RefreshConfig";
import { useState, useEffect } from "react";
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

const Index = () => {
  const [refreshInterval, setRefreshInterval] = useState<RefreshInterval>(300000);
  const [nextUpdate, setNextUpdate] = useState<number>(refreshInterval);
  const { toast } = useToast();

  const { data: posts, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ["redditTrends"],
    queryFn: async () => {
      console.log("Fetching Reddit trends...");
      const response = await fetch(
        "https://www.reddit.com/r/all/top.json?limit=30&t=day"
      );
      const data = await response.json();
      console.log("Fetched posts:", data.data.children);
      toast({
        title: "Data Updated",
        description: "Reddit trends have been refreshed",
      });
      return data.data.children;
    },
    refetchInterval: refreshInterval,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const timeLeft = Math.max(0, refreshInterval - (Date.now() - dataUpdatedAt));
      setNextUpdate(timeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshInterval, dataUpdatedAt]);

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
          <div className="divide-y divide-gray-200">
            {posts?.map((post: RedditPost) => (
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
        )}
      </main>

      <RefreshConfig onIntervalChange={setRefreshInterval} />
    </div>
  );
};

export default Index;