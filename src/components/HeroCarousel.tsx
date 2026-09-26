import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { THEME } from "../lib/theme";

interface HeroCarouselProps {
  slides: ReactNode[];
}

const DRAG_THRESHOLD_PX = 60;

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);
  const widthRef = useRef(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const lastCount = slides.length;

  function clampIndex(next: number): number {
    return Math.max(0, Math.min(lastCount - 1, next));
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (lastCount <= 1) return;
    startXRef.current = e.clientX;
    widthRef.current = trackRef.current?.clientWidth || 1;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const deltaX = e.clientX - startXRef.current;
    // Resist dragging past the first/last slide instead of overscrolling.
    const atStart = index === 0 && deltaX > 0;
    const atEnd = index === lastCount - 1 && deltaX < 0;
    const resisted = atStart || atEnd ? deltaX / 3 : deltaX;
    setDragOffset(resisted);
  }

  function endDrag() {
    if (!dragging) return;
    setDragging(false);
    const width = widthRef.current || 1;
    if (Math.abs(dragOffset) > DRAG_THRESHOLD_PX || Math.abs(dragOffset) > width * 0.2) {
      setIndex((i) => clampIndex(dragOffset < 0 ? i + 1 : i - 1));
    }
    setDragOffset(0);
  }

  function onPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    endDrag();
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  const showArrow = lastCount > 1 && index === 0;
  const translatePercent = -index * 100;
  const dragPercent = widthRef.current ? (dragOffset / widthRef.current) * 100 : 0;

  return (
    <section className="mb-10 md:mb-14 relative">
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ touchAction: "pan-y", cursor: lastCount > 1 ? (dragging ? "grabbing" : "grab") : "default" }}
        className="overflow-hidden select-none"
      >
        <div
          style={{
            display: "flex",
            transform: `translateX(${translatePercent + dragPercent}%)`,
            transition: dragging ? "none" : "transform 0.3s ease",
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              style={{ flex: "0 0 100%" }}
              // Fixed, matching height for every slide so the weather hero and
              // the Moon card always render at the same size. The arbitrary
              // selectors normalize VerdictHero's own section/card wrapper
              // (which we don't touch directly) to fill that height instead
              // of leaving blank space when its content is shorter.
              className="h-[440px] md:h-[280px] overflow-hidden rounded-3xl [&>section]:!mb-0 [&>section]:!h-full [&>section>div]:!h-full [&>section>div]:!justify-center"
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {showArrow && (
        <button
          type="button"
          aria-label="Next card"
          onClick={() => setIndex((i) => clampIndex(i + 1))}
          style={{ background: THEME.card, color: THEME.ink, borderColor: THEME.line }}
          className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 items-center justify-center w-9 h-9 rounded-full border opacity-60 hover:opacity-100 transition-opacity shadow-sm"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {lastCount > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {slides.map((_, i) => (
            <span
              key={i}
              style={{ background: i === index ? THEME.denim : THEME.line }}
              className="w-1.5 h-1.5 rounded-full transition-colors"
            />
          ))}
        </div>
      )}
    </section>
  );
}
