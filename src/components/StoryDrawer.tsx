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
import { AlertCircle, ExternalLink, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
        <div className="p-4 flex-1 flex flex-col gap-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Due to website security settings, we cannot display the content directly. Please use the button below to open the story in a new tab.
            </AlertDescription>
          </Alert>
          
          <Button
            size="lg"
            className="w-full"
            onClick={() => window.open(url, "_blank")}
          >
            Open Story in New Tab
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>

          <div className="text-sm text-muted-foreground mt-2">
            <h3 className="font-medium mb-1">About this story</h3>
            <p>Title: {title}</p>
            <p>Source: {new URL(url).hostname}</p>
            <p className="mt-2">Click the button above to read the full story in a new tab.</p>
          </div>
        </div>
        <DrawerFooter className="flex flex-row justify-end">
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