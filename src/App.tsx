import { useState } from "react";

const SCRAMBLE = "L U' R B D' B' R F' D2 F' L2 B' R2 F R2 F L2 U2 B' L";

const FACE_STICKER_IDS = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [10, 11, 12, 13, 14, 15, 16, 17, 18],
  [20, 21, 22, 23, 24, 25, 26, 27, 28],
  [30, 31, 32, 33, 34, 35, 36, 37, 38],
  [40, 41, 42, 43, 44, 45, 46, 47, 48],
  [50, 51, 52, 53, 54, 55, 56, 57, 58],
];

const CUBE_FACE_IDS = [
  [null, 0, null, null],
  [1, 2, 3, 4],
  [null, 5, null, null],
];

const FACE_COLOR_CODES = ["Y", "B", "R", "G", "O", "W"];

const FACE_LABEL_CODES = [
  "AaBd_bDcC",
  "EeFh_fHgG",
  "IiJl_jLkK",
  "MmNp_nPoO",
  "QqRt_rTsS",
  "UuVx_vXwW",
];

const COLOR_MAP = {
  Y: "bg-yellow-500",
  B: "bg-blue-500",
  R: "bg-red-500",
  G: "bg-green-500",
  O: "bg-orange-500",
  W: "bg-white",
};

const STICKERS = FACE_LABEL_CODES.flatMap((item, x) =>
  item.split("").map((label, y) => ({
    id: 10 * x + y,
    color: FACE_COLOR_CODES[x],
    label,
  })),
);

const CORNER_GROUPS = [
  ["A", "E", "R"],
  ["B", "N", "Q"],
  ["C", "J", "M"],
  ["D", "F", "I"],
  ["G", "L", "U"],
  ["K", "P", "V"],
  ["O", "T", "W"],
  ["H", "S", "X"],
];

const EDGE_GROUPS = [
  ["a", "q"],
  ["b", "m"],
  ["c", "i"],
  ["d", "e"],
  ["f", "l"],
  ["g", "x"],
  ["h", "r"],
  ["j", "p"],
  ["k", "u"],
  ["n", "t"],
  ["o", "v"],
  ["s", "w"],
];

const ALGORITHMS = {
  CORNERS: {
    A: "BUFFER",
    B: "R D' (Y) D R'",
    C: "F (Y) F'",
    D: "F R' (Y) R F'",
    E: "BUFFER",
    F: "F2 (Y) F2",
    G: "D2 R (Y) R' D2",
    H: "D2 (Y) D2",
    I: "F' D (Y) D' F",
    J: "F2 D (Y) D' F2",
    K: "D R (Y) R' D'",
    L: "D (Y) D",
    M: "R' (Y) R",
    N: "R2 (Y) R2",
    O: "R (Y) R'",
    P: "(Y)",
    Q: "R' F (Y) F' R",
    R: "BUFFER",
    S: "D' R (Y) R' D",
    T: "D' (Y) D",
    U: "F' (Y) F",
    V: "D' F' (Y) F D",
    W: "D2 F' (Y) F D2",
    X: "D F' (Y) F D'",
  },
  EDGES: {
    a: "(M2)",
    b: "R U R' U' (M2) U R U' R'",
    c: "(U2 M') (U2 M')",
    d: "L' U' L U (M2) U' L' U L",
    e: "L' Uw' L' Uw (M2) Uw' L Uw L",
    f: "L2 Uw' L' Uw (M2) Uw' L Uw L2",
    g: "L Uw' L' Uw (M2) Uw' L Uw L'",
    h: "Uw' L' Uw (M2) Uw' L Uw",
    i: "U' (R' F' R) S (R' F R) S' U (M2)",
    j: "U R U' (M2) U R' U'",
    k: "BUFFER",
    l: "U' L' U (M2) U' L U",
    m: "R Uw R Uw' (M2) Uw R' Uw' R'",
    n: "Uw R Uw' (M2) Uw R' Uw'",
    o: "R' Uw R Uw' (M2) Uw R' Uw' R",
    p: "R2 Uw R Uw' (M2) Uw R' Uw' R2",
    q: "(U' M')x3 (U' M) (U' M')x4",
    r: "U' L U (M2) U' L' U",
    s: "(M2) U' S (R' F' R) S' (R' F R) U",
    t: "U R' U' (M2) U R U'",
    u: "BUFFER",
    v: "U R2 U' (M2) U R2 U'",
    w: "(M U2) (M U2)",
    x: "U' L2 U (M2) U' L2 U",
    y: "(D' Rw2 U) M2 (U' Rw2 D)",
  },
};

const getSkeleton = (scramble: string) =>
  CUBE_FACE_IDS.map((row) =>
    row.map((id) =>
      id !== null
        ? {
            id,
            stickers: rotate(FACE_STICKER_IDS, scramble)[id].map((stickerId) =>
              STICKERS.find((sticker) => sticker.id === stickerId),
            ),
          }
        : null,
    ),
  );

const getMoves = (
  scramble: string,
): { cornerMoves: string[]; edgeMoves: string[] } => {
  const skeleton = getSkeleton(scramble);
  const moves: string[] = [];

  skeleton.forEach((layer) => {
    layer.forEach((face) => {
      face?.stickers.forEach((sticker, index) => {
        if (!sticker || sticker.label === "_") return;

        const original = STICKERS.find((s) => s.id === 10 * face.id + index);
        if (!original || original.label === sticker.label) return;

        moves.push(`${original.label}${sticker.label}`);
      });
    });
  });

  const cornerMoves = moves.filter((move) => {
    const firstGroup = CORNER_GROUPS.find((group) =>
      group.includes(move[0].toUpperCase()),
    )?.join("");
    const secondGroup = CORNER_GROUPS.find((group) =>
      group.includes(move[1].toUpperCase()),
    )?.join("");
    return firstGroup !== secondGroup && move === move.toUpperCase();
  });
  const edgeMoves = moves.filter((move) => {
    const firstGroup = EDGE_GROUPS.find((group) =>
      group.includes(move[0].toLowerCase()),
    )?.join("");
    const secondGroup = EDGE_GROUPS.find((group) =>
      group.includes(move[1].toLowerCase()),
    )?.join("");
    return firstGroup !== secondGroup && move === move.toLowerCase();
  });

  return { cornerMoves, edgeMoves };
};

type Cube = number[][];
type FaceSlice = [number, ...number[]];
type FaceName = "U" | "D" | "F" | "B" | "R" | "L";

const cloneCube = (cube: Cube): Cube => cube.map((face) => [...face]);

const rotateFaceClockwise = (face: number[]): void => {
  const [
    topLeft,
    topCenter,
    topRight,
    middleLeft,
    center,
    middleRight,
    bottomLeft,
    bottomCenter,
    bottomRight,
  ] = face;

  face[0] = bottomLeft;
  face[1] = middleLeft;
  face[2] = topLeft;
  face[3] = bottomCenter;
  face[4] = center;
  face[5] = topCenter;
  face[6] = bottomRight;
  face[7] = middleRight;
  face[8] = topRight;
};

const readSliceValues = (cube: Cube, slice: FaceSlice): number[] => {
  const [faceIndex, ...stickerIndices] = slice;
  return stickerIndices.map((stickerIndex) => cube[faceIndex][stickerIndex]);
};

const writeSliceValues = (
  cube: Cube,
  slice: FaceSlice,
  values: number[],
): void => {
  const [faceIndex, ...stickerIndices] = slice;

  stickerIndices.forEach((stickerIndex, valueIndex) => {
    cube[faceIndex][stickerIndex] = values[valueIndex];
  });
};

const cycleFaceSlicesClockwise = (
  cube: Cube,
  firstSlice: FaceSlice,
  secondSlice: FaceSlice,
  thirdSlice: FaceSlice,
  fourthSlice: FaceSlice,
): void => {
  const firstValues = readSliceValues(cube, firstSlice);
  const secondValues = readSliceValues(cube, secondSlice);
  const thirdValues = readSliceValues(cube, thirdSlice);
  const fourthValues = readSliceValues(cube, fourthSlice);

  writeSliceValues(cube, secondSlice, firstValues);
  writeSliceValues(cube, thirdSlice, secondValues);
  writeSliceValues(cube, fourthSlice, thirdValues);
  writeSliceValues(cube, firstSlice, fourthValues);
};

const faceMoveDefinitions: Record<
  FaceName,
  {
    faceIndex: number;
    slices: [FaceSlice, FaceSlice, FaceSlice, FaceSlice];
  }
> = {
  U: {
    faceIndex: 0,
    slices: [
      [4, 0, 1, 2],
      [3, 0, 1, 2],
      [2, 0, 1, 2],
      [1, 0, 1, 2],
    ],
  },
  D: {
    faceIndex: 5,
    slices: [
      [4, 6, 7, 8],
      [1, 6, 7, 8],
      [2, 6, 7, 8],
      [3, 6, 7, 8],
    ],
  },
  F: {
    faceIndex: 2,
    slices: [
      [0, 6, 7, 8],
      [3, 0, 3, 6],
      [5, 2, 1, 0],
      [1, 8, 5, 2],
    ],
  },
  B: {
    faceIndex: 4,
    slices: [
      [3, 8, 5, 2],
      [0, 2, 1, 0],
      [1, 0, 3, 6],
      [5, 6, 7, 8],
    ],
  },
  R: {
    faceIndex: 3,
    slices: [
      [0, 2, 5, 8],
      [4, 6, 3, 0],
      [5, 2, 5, 8],
      [2, 2, 5, 8],
    ],
  },
  L: {
    faceIndex: 1,
    slices: [
      [0, 0, 3, 6],
      [2, 0, 3, 6],
      [5, 0, 3, 6],
      [4, 8, 5, 2],
    ],
  },
};

const applyClockwiseMove = (cube: Cube, face: FaceName): Cube => {
  const nextCube = cloneCube(cube);
  const moveDefinition = faceMoveDefinitions[face];

  if (!moveDefinition) {
    return cube;
  }

  rotateFaceClockwise(nextCube[moveDefinition.faceIndex]);

  const [firstSlice, secondSlice, thirdSlice, fourthSlice] =
    moveDefinition.slices;

  cycleFaceSlicesClockwise(
    nextCube,
    firstSlice,
    secondSlice,
    thirdSlice,
    fourthSlice,
  );

  return nextCube;
};

const rotate = (cube: Cube, algorithm: string): Cube => {
  const tokens = algorithm.trim().split(/\s+/).filter(Boolean);
  return tokens.reduce((state, token) => {
    if (token.length === 1) {
      return applyClockwiseMove(state, token as FaceName);
    }
    if (token.length === 2) {
      const face = token[0] as FaceName;
      const modifier = token[1];
      if (modifier === "'") {
        return applyClockwiseMove(
          applyClockwiseMove(applyClockwiseMove(state, face), face),
          face,
        );
      }
      if (modifier === "2") {
        return applyClockwiseMove(applyClockwiseMove(state, face), face);
      }
    }
    return state;
  }, cube);
};

const formatEdgePairs = (path: string) => {
  const map: Record<string, string> = {
    c: "w",
    w: "c",
    i: "s",
    s: "i",
  };

  return path
    .match(/.{1,2}/g)
    ?.map((pair) => {
      if (pair.length === 2) {
        const first = pair[0];
        const second = map[pair[1]] ?? pair[1];
        return first + second;
      }
      return pair;
    })
    .join("");
};

const getSolvedPath = (moves: string[], groups: string[][], buffer: string) => {
  let output = "";
  let start = buffer;
  let cloneMoves = [...moves.sort()];
  let openCircle = "";
  const visited = [];

  while (cloneMoves.length > -1) {
    const target = cloneMoves.find((move) => move.startsWith(start));
    if (target) {
      output += target[1];
      start = target[1];
      const group = groups.find((group) => group.includes(target[0]));

      if (group) {
        visited.push(
          ...cloneMoves.filter(
            (move) => group.includes(move[0]) || group.includes(move[1]),
          ),
        );
        cloneMoves = cloneMoves.filter(
          (move) => !group.includes(move[0]) && !group.includes(move[1]),
        );
      }
    } else if (openCircle) {
      const last = output[output.length - 1];
      const found = visited.find((item) => item.startsWith(last));
      output += found![1];
      openCircle = "";
    } else {
      const nextBuffer = cloneMoves?.[0]?.[0];
      if (!nextBuffer) break;
      output += nextBuffer;
      start = nextBuffer;
      openCircle = nextBuffer;
    }
  }

  return output;
};

const App = () => {
  const [scramble, setScramble] = useState(SCRAMBLE);
  const skeleton = getSkeleton(scramble);
  const { cornerMoves, edgeMoves } = getMoves(scramble);
  const cornerSolvedPath = getSolvedPath(cornerMoves, CORNER_GROUPS, "A");
  const edgeSolvedPath = getSolvedPath(edgeMoves, EDGE_GROUPS, "u");

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-zinc-950 p-4 font-bold">
      <input
        type="text"
        className="w-full rounded-lg border border-white p-4 text-center text-4xl font-bold text-white"
        value={scramble}
        onChange={(e) => setScramble(e.target.value)}
      />
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-8">
        <div className="flex flex-col items-center gap-8">
          <div className="grid grid-rows-3 gap-2">
            {skeleton.map((layer, layerIndex) => (
              <div key={layerIndex} className="grid grid-cols-4 gap-2">
                {layer.map((face, faceIndex) => {
                  if (!face) return <div></div>;
                  return (
                    <div key={faceIndex} className="grid grid-cols-3 gap-1">
                      {face.stickers.map((sticker) => {
                        return (
                          <div
                            key={sticker!.id}
                            className={`flex size-12 items-center justify-center rounded-md ${COLOR_MAP[sticker!.color as keyof typeof COLOR_MAP]}`}
                          >
                            {sticker!.label}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-2 font-bold text-white uppercase">
            <div className="flex items-center gap-4 text-4xl text-amber-500">
              {formatEdgePairs(edgeSolvedPath)
                ?.match(/.{1,2}/g)
                ?.map((pair) => (
                  <div key={pair}>
                    <span>{pair[0]}</span>
                    <span
                      className={
                        "cwis".includes(pair[1]) ? "text-rose-500" : ""
                      }
                    >
                      {pair[1]}
                    </span>
                  </div>
                ))}
              <span className="-ml-4 text-indigo-500">
                {edgeSolvedPath.length % 2 ? "Y" : ""}
              </span>
            </div>
            <div className="flex items-center gap-4 text-4xl text-sky-500">
              {cornerSolvedPath?.match(/.{1,2}/g)?.map((pair) => (
                <div key={pair}>{pair}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-l border-white/10 pl-8 text-2xl text-white">
          <div className="flex flex-col gap-2">
            {formatEdgePairs(edgeSolvedPath)
              ?.split("")
              .map((letter, index) => (
                <div
                  key={letter + index}
                  className={`grid grid-cols-[3rem_1fr] ${
                    index && index % 2 === 0 && "pt-4"
                  }`}
                >
                  <span
                    className={`uppercase ${
                      index % 2 && "cwis".includes(letter)
                        ? "text-rose-500"
                        : "text-amber-500"
                    }`}
                  >
                    {letter}
                  </span>
                  <span>
                    {ALGORITHMS.EDGES[letter as keyof typeof ALGORITHMS.EDGES]}
                  </span>
                </div>
              ))}
            {edgeSolvedPath.length % 2 ? (
              <div className="grid grid-cols-[3rem_1fr]">
                <span className="text-indigo-500">Y</span>
                <span>{ALGORITHMS.EDGES.y}</span>
              </div>
            ) : null}
          </div>
        </div>
        <div className="border-l border-white/10 pl-8 text-2xl text-white">
          <div className="flex flex-col gap-2">
            {cornerSolvedPath.split("").map((letter, index) => (
              <div
                key={letter + index}
                className={`grid grid-cols-[3rem_1fr] ${
                  index && index % 2 === 0 && "pt-4"
                }`}
              >
                <span className="text-sky-500">{letter}</span>
                <span>
                  {
                    ALGORITHMS.CORNERS[
                      letter as keyof typeof ALGORITHMS.CORNERS
                    ]
                  }
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
