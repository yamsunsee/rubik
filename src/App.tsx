import {
  BACKGROUND_COLOR_MAP,
  CUBE_FACE_IDS,
  FACE_STICKER_IDS,
  STICKERS,
  TEXT_COLOR_MAP,
} from "./constants";
import { twMerge as cn } from "tailwind-merge";
import { useEffect, useMemo, useState } from "react";
import {
  applyAlgorithm,
  getSolvedCircles,
  getSolvedCornerCircles,
  getSolvedEdgeCircles,
  getSwappedStickers,
} from "./helpers";

const App = () => {
  const [cube, setCube] = useState<number[][]>();
  const [scramble, setScramble] = useState<string>(
    "R' F D R2 U' R' L2 D' L R2 F U B2 D2 L F B2 D2 L D ",
  );
  const [labels, setLabels] = useState<string[]>(["corners", "edges"]);
  const [colors, setColors] = useState<string[]>(["corners", "edges"]);

  useEffect(() => {
    const newCube = applyAlgorithm(FACE_STICKER_IDS, scramble);
    setCube(newCube);
  }, [scramble]);

  const { swappedCornerStickers, swappedEdgeStickers } = useMemo(() => {
    return getSwappedStickers(FACE_STICKER_IDS, scramble);
  }, [scramble]);

  const { solvedCornerCircles, solvedEdgeCircles } = useMemo(() => {
    return {
      solvedCornerCircles: getSolvedCornerCircles(swappedCornerStickers, "A"),
      solvedEdgeCircles: getSolvedEdgeCircles(swappedEdgeStickers, "u"),
    };
  }, [swappedCornerStickers, swappedEdgeStickers]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 p-4">
      <input
        autoFocus
        value={scramble}
        onChange={(event) => setScramble(event.target.value.toUpperCase())}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-center text-4xl font-bold text-white outline-none"
        placeholder="Enter scramble..."
      />
      <div className="grid w-full flex-1 grid-cols-[1fr_1px_1fr] items-center justify-center gap-4">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-2">
            {CUBE_FACE_IDS.map((layer) => {
              return layer.map((face, faceIndex) => {
                if (face === null) return <div key={`face-${faceIndex}`}></div>;
                return (
                  <div
                    key={`face-${faceIndex}`}
                    className="grid grid-cols-3 gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-2"
                  >
                    {cube?.[face].map((stickerIndex) => {
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
                        targetSticker?.label === "_"
                          ? ""
                          : targetSticker?.label;
                      return (
                        <div
                          key={`sticker-${stickerIndex}`}
                          className={cn(
                            "flex aspect-square items-center justify-center rounded-md p-1.5 text-2xl font-bold text-zinc-950 uppercase",
                            !stickerLabel && stickerBackgroundColor,
                            colors.includes("corners")
                              ? stickerLabel === stickerLabel.toUpperCase() &&
                                  stickerBackgroundColor
                              : stickerLabel === stickerLabel.toUpperCase() &&
                                  "text-white",
                            colors.includes("edges")
                              ? stickerLabel === stickerLabel.toLowerCase() &&
                                  stickerBackgroundColor
                              : stickerLabel === stickerLabel.toLowerCase() &&
                                  "text-white",
                          )}
                        >
                          <div
                            className={cn(
                              stickerLabel &&
                                colors.length == 2 &&
                                colors.includes("edges") &&
                                stickerLabel === stickerLabel.toLowerCase() &&
                                `flex size-full items-center justify-center rounded-sm bg-zinc-900 ${stickerTextColor}`,
                            )}
                          >
                            {(labels.includes("corners") &&
                              stickerLabel === stickerLabel.toUpperCase()) ||
                            (labels.includes("edges") &&
                              stickerLabel === stickerLabel.toLowerCase())
                              ? stickerLabel
                              : ""}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              });
            })}
          </div>
          <div className="grid grid-cols-[1fr_1px_1fr] gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <div className="flex flex-col gap-2">
              <div className="font-bold text-white uppercase">Labels</div>
              <div className="grid grid-cols-2 gap-2">
                {["corners", "edges"].map((option) => (
                  <button
                    key={`labels-${option}`}
                    onClick={() => {
                      if (labels.includes(option))
                        setLabels(labels.filter((item) => item !== option));
                      else setLabels([...labels, option]);
                    }}
                    className={cn(
                      "cursor-pointer rounded-md bg-zinc-800 px-4 py-2 font-bold text-white uppercase",
                      labels.includes(option) && "bg-white text-zinc-950",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-full w-px bg-zinc-800"></div>
            <div className="flex flex-col gap-2">
              <div className="font-bold text-white uppercase">Colors</div>
              <div className="grid grid-cols-2 gap-2">
                {["corners", "edges"].map((option) => (
                  <button
                    key={`highlight-${option}`}
                    onClick={() => {
                      if (colors.includes(option))
                        setColors(colors.filter((item) => item !== option));
                      else setColors([...colors, option]);
                    }}
                    className={cn(
                      "cursor-pointer rounded-md bg-zinc-800 px-4 py-2 font-bold text-white uppercase",
                      colors.includes(option) && "bg-white text-zinc-950",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="h-full w-px bg-zinc-800"></div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center text-4xl font-bold text-white">
            Algorithms
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {swappedCornerStickers.map((sticker) => (
                <span key={sticker} className="text-white">
                  {sticker}
                </span>
              ))}
            </div>
            <div>{JSON.stringify(solvedCornerCircles)}</div>
            <div className="flex items-center gap-2">
              {swappedEdgeStickers.map((sticker) => (
                <span key={sticker} className="text-white">
                  {sticker}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {JSON.stringify(solvedEdgeCircles)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
