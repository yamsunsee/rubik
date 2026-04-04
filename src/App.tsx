import {
  ALGORITHMS,
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
  getSolvedCornerCircles,
  getSolvedEdgeCircles,
  getSwappedStickers,
} from "./helpers";
// eslint-disable-next-line
// @ts-expect-error
import { randomScrambleForEvent } from "https://cdn.cubing.net/v0/js/cubing/scramble";
import Timer from "./Timer";

const App = () => {
  const [cube, setCube] = useState<number[][]>();
  const [scrambleString, setScrambleString] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [solvedCornerString, setSolvedCornerString] = useState<string>("");
  const [solvedEdgeString, setSolvedEdgeString] = useState<string>("");
  const [labels, setLabels] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>(["corners", "edges"]);
  const [isShowSolvedCircles, setIsShowSolvedCircles] =
    useState<boolean>(false);
  const [isMemoryMode, setIsMemoryMode] = useState<boolean>(false);
  const [hoveredMemoryCell, setHoveredMemoryCell] = useState<{
    row: number;
    col: number;
  }>();
  const [memoryStrings, setMemoryStrings] = useState<string[]>([]);

  useEffect(() => {
    const localMemoryStrings = localStorage.getItem("memoryStrings");
    if (localMemoryStrings) {
      setMemoryStrings(JSON.parse(localMemoryStrings));
    }
  }, []);

  const handleMemoryStringChange = (
    row: number,
    col: number,
    value: string,
  ) => {
    const newMemoryStrings = [...memoryStrings];
    newMemoryStrings[(row - 1) * 25 + (col - 1)] = value;
    setMemoryStrings(newMemoryStrings);
    localStorage.setItem("memoryStrings", JSON.stringify(newMemoryStrings));
  };

  const generateScramble = async () => {
    setIsGenerating(true);
    const generatedScramble = await randomScrambleForEvent("333");
    const newScrambleString = generatedScramble.toString();
    setScrambleString(newScrambleString);
    setIsGenerating(false);
  };

  useEffect(() => {
    const newCube = applyAlgorithm(FACE_STICKER_IDS, scrambleString);
    setCube(newCube);
  }, [scrambleString]);

  const { swappedCornerStickers, swappedEdgeStickers } = useMemo(() => {
    return getSwappedStickers(FACE_STICKER_IDS, scrambleString);
  }, [scrambleString]);

  const { solvedCornerCircles, solvedEdgeCircles } = useMemo(() => {
    return {
      solvedCornerCircles: getSolvedCornerCircles(swappedCornerStickers, "C"),
      solvedEdgeCircles: getSolvedEdgeCircles(swappedEdgeStickers, "u"),
    };
  }, [swappedCornerStickers, swappedEdgeStickers]);

  if (isMemoryMode) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-zinc-950 p-4">
        <div className="grid w-full flex-1 grid-rows-25 overflow-hidden rounded-lg border border-zinc-800 *:last:border-b-0">
          {Array.from({ length: 25 }).map((_, row) => {
            return (
              <div
                key={row}
                className="grid grid-cols-26 border-b border-zinc-800 *:last:border-r-0"
              >
                {Array.from({ length: 26 }).map((_, col) => (
                  <div
                    key={`${row}-${col}`}
                    onClick={() => {
                      if (row + col === 0) {
                        setIsMemoryMode(false);
                      }
                    }}
                    onMouseEnter={() => {
                      setHoveredMemoryCell({ row, col });
                    }}
                    onMouseLeave={() => {
                      setHoveredMemoryCell(undefined);
                    }}
                    onDoubleClick={() => {
                      const value = prompt(
                        `${String.fromCharCode(row + 64)}${String.fromCharCode(col + 64)}`,
                        memoryStrings[(row - 1) * 25 + (col - 1)],
                      );
                      handleMemoryStringChange(row, col, value ?? "");
                    }}
                    className={cn(
                      "relative flex items-center justify-center border-r border-zinc-800 text-center text-xs text-pretty text-white hover:bg-zinc-800 hover:text-amber-500",
                      row * col === 0 && "bg-zinc-900 text-base font-bold",
                      hoveredMemoryCell &&
                        ((hoveredMemoryCell?.row === row &&
                          hoveredMemoryCell?.col > col) ||
                          (hoveredMemoryCell?.col === col &&
                            hoveredMemoryCell?.row > row)) &&
                        "bg-zinc-800 text-white",
                      hoveredMemoryCell &&
                        ((hoveredMemoryCell?.row === row && col === 0) ||
                          (hoveredMemoryCell?.col === col && row === 0)) &&
                        "text-amber-500",
                    )}
                  >
                    {row + col === 0
                      ? "SOLVE"
                      : row === 0
                        ? `_${String.fromCharCode(col + 64)}`
                        : col === 0
                          ? `${String.fromCharCode(row + 64)}_`
                          : memoryStrings[(row - 1) * 25 + (col - 1)]}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-zinc-950 p-4">
      <div className="flex w-full flex-col gap-2">
        <div className="grid grid-cols-[2fr_6fr_2fr] items-center gap-2">
          <button
            onClick={() => {
              setIsMemoryMode(true);
            }}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-center text-4xl font-bold text-white uppercase outline-none"
          >
            Memory
          </button>
          <input
            value={scrambleString}
            onChange={(event) =>
              setScrambleString(event.target.value.toUpperCase())
            }
            className={cn(
              "w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-center text-4xl font-bold text-white outline-none",
              scrambleString && "border-amber-500 bg-amber-950 text-amber-500",
            )}
            placeholder={isGenerating ? "GENERATING..." : "SCRAMBLE"}
            disabled={isGenerating}
          />
          <button
            disabled={isGenerating}
            onClick={async () => {
              await generateScramble();
              setIsShowSolvedCircles(false);
              setLabels([]);
              setSolvedCornerString("");
              setSolvedEdgeString("");
            }}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-center text-4xl font-bold text-white uppercase outline-none"
          >
            Generate
          </button>
        </div>
        <div className="grid grid-cols-[8fr_2fr] items-center gap-2">
          <div className="grid w-full grid-cols-2 gap-2">
            <input
              value={solvedCornerString}
              onChange={(event) =>
                setSolvedCornerString(
                  event.target.value
                    .toUpperCase()
                    .replace(/ /g, "")
                    .split("")
                    .join(" "),
                )
              }
              className={cn(
                "w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-center text-4xl font-bold text-white outline-none",
                isShowSolvedCircles &&
                  (solvedCornerString.replace(/ /g, "") ===
                  solvedCornerCircles?.replace(/ /g, "")
                    ? "border-emerald-500 bg-emerald-950 text-emerald-500"
                    : "border-rose-500 bg-rose-950 text-rose-500"),
              )}
              placeholder="CORNERS"
            />
            <input
              value={solvedEdgeString}
              onChange={(event) =>
                setSolvedEdgeString(
                  event.target.value
                    .toUpperCase()
                    .replace(/ /g, "")
                    .split("")
                    .join(" "),
                )
              }
              className={cn(
                "w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-center text-4xl font-bold text-white outline-none",
                isShowSolvedCircles &&
                  (solvedEdgeString.toLowerCase().replace(/ /g, "") ===
                  solvedEdgeCircles?.replace(/ /g, "")
                    ? "border-emerald-500 bg-emerald-950 text-emerald-500"
                    : "border-rose-500 bg-rose-950 text-rose-500"),
              )}
              placeholder="EDGES"
            />
          </div>
          <button
            onClick={() => {
              setIsShowSolvedCircles(!isShowSolvedCircles);
              setLabels(isShowSolvedCircles ? [] : ["corners", "edges"]);
            }}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-center text-4xl font-bold text-white uppercase outline-none"
          >
            {isShowSolvedCircles ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <div className="grid w-full flex-1 grid-cols-2 gap-2">
        <div className="flex flex-col justify-between gap-4">
          <div className="flex h-full items-center justify-center">
            <div className="grid w-fit grid-cols-4 gap-2">
              {CUBE_FACE_IDS.map((layer) => {
                return layer.map((face, faceIndex) => {
                  if (face === null)
                    return <div key={`face-${faceIndex}`}></div>;
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
                              "flex size-16 items-center justify-center rounded-md p-1.5 text-2xl font-bold text-zinc-950 uppercase",
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
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="text-2xl font-bold text-emerald-500 uppercase">
                Labels
              </div>
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
            <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="text-2xl font-bold text-amber-500 uppercase">
                Colors
              </div>
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
        <div className="flex flex-col gap-2">
          {isShowSolvedCircles && (
            <div className="grid grid-cols-2 gap-2">
              <div className="flex h-full flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-2xl font-bold">
                <div className="text-emerald-500 uppercase">Edges</div>
                <div>
                  {solvedEdgeCircles
                    ?.replace(/\s/g, "")
                    .split("")
                    .map((item, index) => (
                      <div
                        key={`edge-${item}-${index}`}
                        className={cn(
                          "grid grid-cols-[2rem_1fr]",
                          index % 2 && "mb-4",
                        )}
                      >
                        <span
                          className={cn(
                            "uppercase",
                            "cwisy".includes(item) && index % 2
                              ? "text-rose-500"
                              : "text-sky-500",
                          )}
                        >
                          {item}
                        </span>{" "}
                        <span className="text-white">
                          {ALGORITHMS.EDGES[item]}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex h-full flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-2xl font-bold">
                <div className="text-amber-500 uppercase">Corners</div>
                <div>
                  {solvedCornerCircles
                    ?.replace(/\s/g, "")
                    .split("")
                    .map((item, index) => (
                      <div
                        key={`corner-${item}-${index}`}
                        className={cn(
                          "grid grid-cols-[2rem_1fr]",
                          index % 2 && "mb-4",
                        )}
                      >
                        <span className="text-sky-500 uppercase">{item}</span>{" "}
                        <span className="text-white">
                          {ALGORITHMS.CORNERS[item]}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
          <Timer />
        </div>
      </div>
    </div>
  );
};

export default App;
