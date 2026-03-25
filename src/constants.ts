const FACE_STICKER_IDS = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 31, 32, 33, 34, 35],
  [36, 37, 38, 39, 40, 41, 42, 43, 44],
  [45, 46, 47, 48, 49, 50, 51, 52, 53],
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

const BACKGROUND_COLOR_MAP = {
  Y: "bg-yellow-500",
  B: "bg-blue-500",
  R: "bg-red-500",
  G: "bg-green-500",
  O: "bg-orange-500",
  W: "bg-white",
};

const TEXT_COLOR_MAP = {
  Y: "text-yellow-500",
  B: "text-blue-500",
  R: "text-red-500",
  G: "text-green-500",
  O: "text-orange-500",
  W: "text-white",
};

const STICKERS = FACE_LABEL_CODES.flatMap((item, x) =>
  item.split("").map((label) => ({
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

export {
  ALGORITHMS,
  BACKGROUND_COLOR_MAP,
  TEXT_COLOR_MAP,
  CORNER_GROUPS,
  CUBE_FACE_IDS,
  EDGE_GROUPS,
  FACE_COLOR_CODES,
  FACE_LABEL_CODES,
  FACE_STICKER_IDS,
  STICKERS,
};
