import { useState, useRef } from "react";
import { Play, Maximize2 } from "lucide-react";
import { S3_MEDIA } from "@/lib/media";

const hero = S3_MEDIA.noirStreet;

interface HeroVideoCardProps {
  videoSrc?: string;
}

export function HeroVideoCard({ videoSrc }: HeroVideoCardProps) {
  const [isPlayingInline, setIsPlayingInline] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayInline = () => {
    setIsPlayingInline(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 50);
  };

  const handleFullscreen = () => {
    setIsPlayingInline(true);
    setTimeout(() => {
      const video = videoRef.current;
      if (video) {
        video.play().catch(() => {});
        if (video.requestFullscreen) {
          video.requestFullscreen().catch(() => {});
        } else if ((video as any).webkitRequestFullscreen) {
          (video as any).webkitRequestFullscreen();
        } else if ((video as any).msRequestFullscreen) {
          (video as any).msRequestFullscreen();
        }
      }
    }, 50);
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  };

  if (!videoSrc) {
    return (
      <section className="panel group relative overflow-hidden">
        <img
          src={hero}
          alt="The victim's study: a dark detective office with a desk lamp, case files and rain on the window"
          width={1280}
          height={720}
          className="h-[340px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] xl:h-[380px]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0_0_0/0.35),oklch(0_0_0/0.85))]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
          <div
            aria-label="Play case introduction video"
            className="grid size-[74px] place-items-center rounded-full border border-foreground/70 bg-background/25 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-[var(--glow-red)]"
          >
            <Play className="ml-1 size-7 fill-current" />
          </div>
          <div className="text-center">
            <h2 className="font-display text-base font-semibold uppercase tracking-[0.18em]">
              Case Introduction Video
            </h2>
            <p className="label-xs mt-2 text-muted-foreground">12:45 Min</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <style>{`
        .no-progress-video::-webkit-media-controls-timeline {
          display: none !important;
        }
        .no-progress-video::-webkit-media-controls-current-time-display {
          display: none !important;
        }
        .no-progress-video::-webkit-media-controls-time-remaining-display {
          display: none !important;
        }
        .no-progress-video::-webkit-media-controls-mute-button {
          display: none !important;
        }
        .no-progress-video::-webkit-media-controls-volume-slider {
          display: none !important;
        }
        .no-progress-video::-webkit-media-controls-fullscreen-button {
          display: none !important;
        }
        .no-progress-video::-internal-media-controls-overflow-button {
          display: none !important;
        }
      `}</style>
      <section className="panel group relative overflow-hidden bg-black">
        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoSrc}
          controls
          controlsList="nodownload nofullscreen noplaybackrate"
          disablePictureInPicture
          onClick={handleVideoClick}
          className={`h-[340px] w-full object-cover xl:h-[380px] no-progress-video cursor-pointer ${
            isPlayingInline ? "block" : "hidden"
          }`}
        />

        {/* Cover Overlay (Shown when not playing inline) */}
        {!isPlayingInline && (
          <>
            <img
              src={hero}
              alt="The victim's study: a dark detective office with a desk lamp, case files and rain on the window"
              width={1280}
              height={720}
              className="h-[340px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] xl:h-[380px]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0_0_0/0.35),oklch(0_0_0/0.85))]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
              <button
                onClick={handlePlayInline}
                aria-label="Play case introduction video"
                className="grid size-[74px] place-items-center rounded-full border border-foreground/70 bg-background/25 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-[var(--glow-red)] cursor-pointer"
              >
                <Play className="ml-1 size-7 fill-current" />
              </button>
              <div className="text-center">
                <h2 className="font-display text-base font-semibold uppercase tracking-[0.18em]">
                  Case Introduction Video
                </h2>
                <p className="label-xs mt-2 text-muted-foreground">12:45 Min</p>
              </div>

              <div className="absolute bottom-4 right-4">
                <button
                  onClick={handleFullscreen}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-black/50 hover:bg-black/80 border border-white/10 hover:border-primary/50 text-[10px] uppercase tracking-wider rounded transition-colors text-white cursor-pointer font-mono"
                >
                  <Maximize2 className="size-3" />
                  Theater Mode
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {isPlayingInline && (
        <div className="flex justify-end">
          <button
            onClick={handleFullscreen}
            className="flex items-center gap-2 px-4 py-2 border border-foreground/30 hover:border-primary text-xs uppercase tracking-wider rounded transition-colors text-white bg-transparent cursor-pointer font-mono"
          >
            <Maximize2 className="size-3.5" />
            Theater Mode
          </button>
        </div>
      )}
    </div>
  );
}

export default HeroVideoCard;
