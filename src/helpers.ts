import {
  CORNER_GROUPS,
  FACE_ROTATION_MAP,
  SLICE_ROTATION_MAP,
  STICKERS,
} from "./constants";

export const getClonedFace = (face: number[]) => {
  return [...face];
};

export const getClonedCube = (cube: number[][]) => {
  return cube.map(getClonedFace);
};

export const rotateFace = (
  face: number[],
  direction: boolean = true, // true = clockwise, false = counter-clockwise
) => {
  const newFace = getClonedFace(face);
  const rotationMappingClockwise = [6, 3, 0, 7, 4, 1, 8, 5, 2];
  const rotationMappingCounterClockwise = [2, 5, 8, 1, 4, 7, 0, 3, 6];

  const rotationMapping = direction
    ? rotationMappingClockwise
    : rotationMappingCounterClockwise;

  for (let i = 0; i < 9; i++) {
    face[i] = newFace[rotationMapping[i]];
  }

  return face;
};

export const rotateSlices = (
  cube: number[][],
  algorithm: string,
  direction: boolean = true,
) => {
  const newCube = getClonedCube(cube);
  const faces = SLICE_ROTATION_MAP[algorithm];

  if (direction) {
    const tempFace = [
      newCube[faces[0].face][faces[0].indices[0]],
      newCube[faces[0].face][faces[0].indices[1]],
      newCube[faces[0].face][faces[0].indices[2]],
    ];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const currentFace = faces[j];
        newCube[currentFace.face][currentFace.indices[i]] =
          newCube[faces[j + 1].face][faces[j + 1].indices[i]];
      }

      newCube[faces[3].face][faces[3].indices[i]] = tempFace[i];
    }
  } else {
    const tempFace = [
      newCube[faces[3].face][faces[3].indices[0]],
      newCube[faces[3].face][faces[3].indices[1]],
      newCube[faces[3].face][faces[3].indices[2]],
    ];

    for (let i = 0; i < 3; i++) {
      for (let j = 3; j > 0; j--) {
        const currentFace = faces[j];
        newCube[currentFace.face][currentFace.indices[i]] =
          newCube[faces[j - 1].face][faces[j - 1].indices[i]];
      }

      newCube[faces[0].face][faces[0].indices[i]] = tempFace[i];
    }
  }

  return newCube;
};

export const rotateCube = (cube: number[][], algorithm: string) => {
  let newCube = getClonedCube(cube);
  const [face, suffix] = algorithm.split("");
  const faceIndex = FACE_ROTATION_MAP[face];
  const direction = suffix !== "'";

  newCube = rotateSlices(newCube, face, direction);
  newCube[faceIndex] = rotateFace(newCube[faceIndex], direction);

  if (suffix === "2") {
    newCube = rotateSlices(newCube, face, direction);
    newCube[faceIndex] = rotateFace(newCube[faceIndex], direction);
  }

  return newCube;
};

export const applyAlgorithm = (cube: number[][], algorithm: string) => {
  if (!algorithm) return cube;

  const algorithms = algorithm
    .trim()
    .split(" ")
    .filter((item) => "UDLRFB".includes(item[0]));

  return algorithms.reduce(
    (accumulator, algorithm) => rotateCube(accumulator, algorithm),
    cube,
  );
};

export const getSwappedStickers = (cube: number[][], algorithm: string) => {
  const scrambledCube = applyAlgorithm(cube, algorithm);
  const swappedCornerStickers: string[] = [];
  const swappedEdgeStickers: string[] = [];

  scrambledCube.forEach((face, faceIndex) => {
    face.forEach((sticker, stickerIndex) => {
      const targetSticker = STICKERS[sticker];
      const originalSticker = STICKERS[cube[faceIndex][stickerIndex]];

      if (originalSticker?.label !== "_") {
        if (originalSticker?.label === originalSticker?.label.toUpperCase()) {
          swappedCornerStickers.push(
            `${originalSticker?.label}-${targetSticker?.label}`,
          );
        } else {
          swappedEdgeStickers.push(
            `${originalSticker?.label}-${targetSticker?.label}`,
          );
        }
      }
    });
  });

  return { swappedCornerStickers, swappedEdgeStickers };
};

export const getSolvedCornerCircles = (
  swappedStickers: string[],
  buffer: string,
) => {
  let startSticker = buffer;
  const solvedCircles: string[] = [];
  const visitedCorners: number[] = [];

  while (visitedCorners.length < 8) {
    const currentSticker = swappedStickers.find((sticker) =>
      sticker.startsWith(startSticker),
    );

    if (!currentSticker) {
      const filteredGroups = CORNER_GROUPS.filter(
        (_, index) => !visitedCorners.includes(index),
      );
      startSticker = filteredGroups[0][0];
      continue;
    }

    const [firstSticker, secondSticker] = currentSticker.split("-");
    const firstCornerIndex = CORNER_GROUPS.findIndex((group) =>
      group.includes(firstSticker),
    );
    const secondCornerIndex = CORNER_GROUPS.findIndex((group) =>
      group.includes(secondSticker),
    );

    solvedCircles.push(secondSticker);
    visitedCorners.push(firstCornerIndex, secondCornerIndex);

    startSticker = secondSticker;
  }

  console.log(solvedCircles);

  return solvedCircles;
};

export const getSolvedEdgeCircles = (
  swappedStickers: string[],
  buffer: string,
) => {
  return [];
};
