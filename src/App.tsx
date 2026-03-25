import {
  BACKGROUND_COLOR_MAP,
  CUBE_FACE_IDS,
  FACE_STICKER_IDS,
  STICKERS,
  TEXT_COLOR_MAP,
} from "./constants";
import { twMerge as cn } from "tailwind-merge";

const App = () => {
  console.log(STICKERS);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 p-4">
      <input
        autoFocus
        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-center text-4xl font-bold text-white outline-none"
        placeholder="Enter scramble..."
      />
      <div className="grid w-full flex-1 grid-cols-[1fr_1px_1fr] items-center justify-center gap-4">
        <div className="grid grid-cols-4 gap-2">
          {CUBE_FACE_IDS.map((layer) => {
            return layer.map((face, faceIndex) => {
              if (face === null) return <div key={`face-${faceIndex}`}></div>;
              return (
                <div
                  key={`face-${faceIndex}`}
                  className="grid grid-cols-3 gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-2"
                >
                  {FACE_STICKER_IDS[face].map((stickerIndex) => {
                    const targetSticker = STICKERS[stickerIndex];
                    const stickerBackgroundColor =
                      BACKGROUND_COLOR_MAP[
                        targetSticker?.color as keyof typeof BACKGROUND_COLOR_MAP
                      ];
                    const stickerTextColor =
                      TEXT_COLOR_MAP[
                        targetSticker?.color as keyof typeof TEXT_COLOR_MAP
                      ];
                    const stickerLabel =
                      targetSticker?.label === "_" ? "" : targetSticker?.label;

                    return (
                      <div
                        key={`sticker-${stickerIndex}`}
                        className={cn(
                          "flex aspect-square items-center justify-center rounded-lg p-1 text-2xl font-bold text-zinc-950 uppercase",
                          stickerBackgroundColor,
                        )}
                      >
                        <div
                          className={cn(
                            stickerLabel &&
                              stickerLabel === stickerLabel.toLowerCase() &&
                              `flex size-full items-center justify-center rounded-lg bg-zinc-900 ${stickerTextColor}`,
                          )}
                        >
                          {stickerLabel}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            });
          })}
        </div>
        <div className="h-full w-px bg-zinc-800"></div>
        <div className="flex items-center justify-center text-4xl font-bold text-white">
          Algorithms
        </div>
      </div>
    </div>
  );
};

export default App;
