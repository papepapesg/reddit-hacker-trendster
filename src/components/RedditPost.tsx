import { ArrowUpIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface RedditPostProps {
  title: string;
  url: string;
  score: number;
  author: string;
  createdAt: string;
  commentsCount: number;
}

export const RedditPost = ({
  title,
  url,
  score,
  author,
  createdAt,
  commentsCount,
}: RedditPostProps) => {
  const [votes, setVotes] = useState(score);
  const [voted, setVoted] = useState(false);

  const handleVote = () => {
    if (!voted) {
      setVotes(votes + 1);
      setVoted(true);
      toast.success("Vote recorded!");
      console.log("Vote recorded for post:", title);
    }
  };

  return (
    <div className="flex gap-2 py-2 items-start">
      <button
        onClick={handleVote}
        className={`p-1 transition-colors ${
          voted ? "text-hn-orange" : "text-hn-secondary hover:text-hn-orange"
        }`}
        disabled={voted}
      >
        <ArrowUpIcon className="w-4 h-4" />
      </button>
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:underline"
          >
            {title}
          </a>
          <span className="text-xs text-hn-secondary">
            ({new URL(url).hostname})
          </span>
        </div>
        <div className="text-xs text-hn-secondary">
          {votes} points by {author} {createdAt} | {commentsCount} comments
        </div>
      </div>
    </div>
  );
};