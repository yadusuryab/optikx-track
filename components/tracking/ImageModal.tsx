/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconX, IconShare2 } from "@tabler/icons-react";
import Image from "next/image";

export function ImageModal({ isOpen, onClose, image, onShare }: any) {
  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] h-[90vh] p-0 overflow-hidden bg-black/90 backdrop-blur-2xl border-none">
        {/* Top Floating Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
          <span className="text-white font-medium px-4">{image.extractedData?.name}</span>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10 rounded-full">
            <IconX className="h-6 w-6" />
          </Button>
        </div>

        {/* Centered Image */}
        <div className="relative w-full h-full flex items-center justify-center p-8">
          <div className="relative w-full h-full max-w-4xl">
            <Image
              src={image.url}
              alt="Tracking Document"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Bottom Floating Actions */}
        <div className="absolute bottom-6 right-6 z-50">
          <Button 
            onClick={onShare}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full px-6 gap-2"
          >
            <IconShare2 className="h-4 w-4" />
            Share Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}