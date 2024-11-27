import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ExternalLink, X } from "lucide-react";

interface StoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  url: string;
}

export const StoryDrawer = ({
  open,
  onOpenChange,
  title,
  url,
}: StoryDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="fixed right-0 h-full w-[400px] border-l">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>
            From: {new URL(url).hostname}
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 flex-1">
          <iframe
            src={url}
            className="w-full h-[calc(100vh-200px)]"
            title={title}
          />
        </div>
        <DrawerFooter className="flex flex-row justify-between">
          <Button
            variant="outline"
            onClick={() => window.open(url, "_blank")}
          >
            Open in New Tab
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          <DrawerClose asChild>
            <Button variant="ghost">
              Close
              <X className="ml-2 h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};