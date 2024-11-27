import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortControlProps {
  onSortChange: (value: string) => void;
}

export const SortControl = ({ onSortChange }: SortControlProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-hn-secondary">Sort by:</span>
      <Select onValueChange={onSortChange} defaultValue="date">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">Publication Date</SelectItem>
          <SelectItem value="comments">Number of Comments</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};