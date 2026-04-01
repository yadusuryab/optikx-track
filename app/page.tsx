/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import ContactCard from "@/components/ContactCard";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { ScrollVelocityContainer, ScrollVelocityRow } from "@/components/ui/scroll-based-velocity";
import UnboxingPolicyBanner from "@/components/UnboxingPolicy";
import { cn } from "@/lib/utils";

import { FloatingParticles } from "@/components/tracking/FloatingParticles";
import { SearchHero } from "@/components/tracking/SearchHero";
import { FixedSearchBar } from "@/components/tracking/FixedSearchBar";
import { ImageModal } from "@/components/tracking/ImageModal";
import { useImageTracking } from "@/components/tracking/useImageTracking";
import { ResultsGrid } from "@/components/tracking/ResultGrid";

export default function TrackingPage() {
  const {
    query,
    setQuery,
    images,
    loading,
    searched,
    pagination,
    currentPage,
    fieldError,
    setFieldError,
    fetchImages,
    reset,
    handleSubmit
  } = useImageTracking();
  
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setTimeout(() => inputRef.current?.focus(), 700);
  }, []);

  return (
    <>
      <style>{`

        /* ── Animations ───────────────────────────── */
        @keyframes slideBarDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(201,169,110,0.45); }
          70%  { box-shadow: 0 0 0 10px rgba(201,169,110,0); }
          100% { box-shadow: 0 0 0 0 rgba(201,169,110,0); }
        }

        .afu { animation: fadeUp 0.55s ease forwards; }
        .d1 { animation-delay: 0.1s; opacity: 0; }
        .d2 { animation-delay: 0.2s; opacity: 0; }
        .d3 { animation-delay: 0.3s; opacity: 0; }
        .d4 { animation-delay: 0.4s; opacity: 0; }
        .d5 { animation-delay: 0.5s; opacity: 0; }

        /* ── Cards ────────────────────────────────── */
        .card-img {
          background: var(--card);
          border: 0.5px solid var(--border);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.22s;
          aspect-ratio: 3/4;
          position: relative;
        }
        .card-img:hover {
          border-color: var(--gold);
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(0,0,0,0.07);
        }

        /* ── Warning ──────────────────────────────── */
        .warning-banner {
          border-left: 2px solid var(--gold);
          background: linear-gradient(90deg, rgba(201,169,110,0.06), transparent);
          padding: 14px 18px;
        }

        /* ── Modal ────────────────────────────────── */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(16px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.22s ease;
        }
        .modal-inner {
          background: var(--card);
          max-width: 680px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          animation: scaleIn 0.28s cubic-bezier(0.175,0.885,0.32,1.275);
        }

        /* ── Misc ─────────────────────────────────── */
        .divider { height: 1px; background: var(--border); }
        .display-font { font-family: 'Cormorant Garamond', serif; }
        .error-msg {
          font-size: 10px; color: #c0392b;
          letter-spacing: 0.08em; margin-top: 6px;
        }
        .result-count { display: flex; align-items: baseline; gap: 8px; }
        .result-count .num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px; font-weight: 300; line-height: 1; color: var(--ink);
        }
        .result-count .lbl {
          font-size: 10px; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--stone);
        }
        .page-num {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          border: 0.5px solid var(--border);
          font-size: 11px; font-family: 'Geist Mono', monospace;
          cursor: pointer; transition: all 0.18s; background: transparent; color: var(--ink);
        }
        .page-num:hover, .page-num.active {
          background: var(--ink); color: var(--cream); border-color: var(--ink);
        }
        .page-num:disabled { opacity: 0.28; cursor: not-allowed; }

        /* ── Responsive ───────────────────────────── */
        @media (max-width: 600px) {
          .result-count .num { font-size: 28px; }
          .search-bar-fixed { top: 56px; }
        }
      `}</style>

      <FloatingParticles />

      {searched && (
        <FixedSearchBar
          query={query}
          setQuery={setQuery}
          loading={loading}
          onSubmit={handleSubmit}
          onReset={reset}
          inputRef={inputRef}
        />
      )}

      <main
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: searched ? "120px 24px 80px" : "",
          position: "relative",
          zIndex: 1,
          transition: "padding 0.35s ease"
        }}
      >
        {!searched && (
          <>
           <div className="p-4">
           <SearchHero
              query={query}
              setQuery={setQuery}
              loading={loading}
              fieldError={fieldError}
              setFieldError={setFieldError}
              onSubmit={handleSubmit}
              inputRef={inputRef}
            />
            <UnboxingPolicyBanner />
           </div>
            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
              <ScrollVelocityContainer className="text-4xl font-bold tracking-[-0.02em] md:text-7xl md:leading-20">
                <ScrollVelocityRow baseVelocity={20} direction={1}>
                  OPTIKX TRACK&nbsp; 
                </ScrollVelocityRow>
                <ScrollVelocityRow baseVelocity={20} direction={-1}>
                  TRACK <em>PACKAGE</em>&nbsp;
                </ScrollVelocityRow>
              </ScrollVelocityContainer>
              <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
              <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
            </div>
            <div className="px-4 my-2">
              <ContactCard />
            </div>
          </>
        )}

        {searched && (
          <ResultsGrid
            images={images}
            loading={loading}
            pagination={pagination}
            query={query}
            currentPage={currentPage}
            onPageChange={fetchImages}
            onImageClick={setSelectedImage}
          />
        )}
      </main>

      {selectedImage && (
        <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </>
  );
}