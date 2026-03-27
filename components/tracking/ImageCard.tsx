/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function ImageCard({ image, onClick }: { image: any, onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="group relative aspect-[3/4] overflow-hidden rounded-2xl border-none shadow-sm hover:shadow-xl transition-all cursor-pointer"
        onClick={onClick}
      >
        <Image
          src={image.url}
          alt="Package"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <p className="text-white text-sm font-medium tracking-tight">
            {image.extractedData?.name || "View Details"}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}