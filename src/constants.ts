export const FACE_STICKER_IDS: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 31, 32, 33, 34, 35],
  [36, 37, 38, 39, 40, 41, 42, 43, 44],
  [45, 46, 47, 48, 49, 50, 51, 52, 53],
];

export const CUBE_FACE_IDS: (number | null)[][] = [
  [null, 0, null, null],
  [1, 2, 3, 4],
  [null, 5, null, null],
];

export const FACE_COLOR_CODES: string[] = ["Y", "B", "R", "G", "O", "W"];

export const FACE_ROTATION_MAP: Record<string, number> = {
  U: 0,
  L: 1,
  F: 2,
  R: 3,
  B: 4,
  D: 5,
};

export const FACE_LABEL_CODES: string[] = [
  "AaBd_bDcC",
  "EeFh_fHgG",
  "IiJl_jLkK",
  "MmNp_nPoO",
  "QqRt_rTsS",
  "UuVx_vXwW",
];

export const BACKGROUND_COLOR_MAP: Record<string, string> = {
  Y: "bg-yellow-500",
  B: "bg-blue-500",
  R: "bg-red-500",
  G: "bg-green-500",
  O: "bg-orange-500",
  W: "bg-white",
};

export const TEXT_COLOR_MAP: Record<string, string> = {
  Y: "text-yellow-500",
  B: "text-blue-500",
  R: "text-red-500",
  G: "text-green-500",
  O: "text-orange-500",
  W: "text-white",
};

export const STICKERS: { color: string; label: string }[] =
  FACE_LABEL_CODES.flatMap((item, x) =>
    item.split("").map((label) => ({
      color: FACE_COLOR_CODES[x],
      label,
    })),
  );

export const CORNER_GROUPS: string[][] = [
  ["A", "E", "R"],
  ["B", "N", "Q"],
  ["C", "J", "M"],
  ["D", "F", "I"],
  ["G", "L", "U"],
  ["K", "P", "V"],
  ["O", "T", "W"],
  ["H", "S", "X"],
];

export const EDGE_GROUPS: string[][] = [
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

export const PARITY_EDGES: Record<string, string> = {
  c: "w",
  w: "c",
  i: "s",
  s: "i",
};

export const SLICE_ROTATION_MAP: Record<
  string,
  { face: number; indices: number[] }[]
> = {
  U: [
    { face: 1, indices: [0, 1, 2] },
    { face: 2, indices: [0, 1, 2] },
    { face: 3, indices: [0, 1, 2] },
    { face: 4, indices: [0, 1, 2] },
  ],
  L: [
    { face: 0, indices: [0, 3, 6] },
    { face: 4, indices: [8, 5, 2] },
    { face: 5, indices: [0, 3, 6] },
    { face: 2, indices: [0, 3, 6] },
  ],
  F: [
    { face: 0, indices: [6, 7, 8] },
    { face: 1, indices: [8, 5, 2] },
    { face: 5, indices: [2, 1, 0] },
    { face: 3, indices: [0, 3, 6] },
  ],
  R: [
    { face: 0, indices: [2, 5, 8] },
    { face: 2, indices: [2, 5, 8] },
    { face: 5, indices: [2, 5, 8] },
    { face: 4, indices: [6, 3, 0] },
  ],
  B: [
    { face: 0, indices: [0, 1, 2] },
    { face: 3, indices: [2, 5, 8] },
    { face: 5, indices: [8, 7, 6] },
    { face: 1, indices: [6, 3, 0] },
  ],
  D: [
    { face: 1, indices: [6, 7, 8] },
    { face: 4, indices: [6, 7, 8] },
    { face: 3, indices: [6, 7, 8] },
    { face: 2, indices: [6, 7, 8] },
  ],
};

export const ALGORITHMS: Record<string, Record<string, string>> = {
  CORNERS: {
    A: "[x R2: R U R', D2]",
    B: "HELPER",
    C: "BUFFER",
    D: "[U' x R2: R U R', D2]",
    E: "[R2: D, R' U R]",
    F: "[R2: R U' R', D']",
    G: "[U, R' D R]",
    H: "[R D' R', U']",
    I: "[R: R D R', U2]",
    J: "BUFFER",
    K: "[U, D' R' D R]",
    L: "[R D2 R', U']",
    M: "BUFFER",
    N: "[U, R' D R D' R' D R]",
    O: "[R D R', U']",
    P: "[U, R' D' R]",
    Q: "[R' D R D' R' D R, U]",
    R: "[R2: R U2 R', D']",
    S: "[U, R' D2 R]",
    T: "[D': U, R' D' R]",
    U: "[x': R U R', D2]",
    V: "[D' x': R U R', D2]",
    W: "[D x: D2, R' U' R]",
    X: "[x: D2, R' U' R]",
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
    y: "(D' L2 D) M2 (D' L2 D)",
  },
};
