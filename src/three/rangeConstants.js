// Shared geometry constants for the range — kept in one place so the floor
// bounds used for movement clamping match the walls/backstop the
// environment actually renders.
export const EYE_HEIGHT = 1.7;
export const MOVE_SPEED = 4.4;
export const SPAWN_POSITION = [0, EYE_HEIGHT, 9];

export const RANGE_BOUNDS = {
  minX: -4.3,
  maxX: 4.3,
  minZ: -16.5,
  maxZ: 10.5
};

export const RANGE_LENGTH = RANGE_BOUNDS.maxZ - RANGE_BOUNDS.minZ;
export const RANGE_WIDTH = RANGE_BOUNDS.maxX - RANGE_BOUNDS.minX;
export const RANGE_CENTER_Z = (RANGE_BOUNDS.maxZ + RANGE_BOUNDS.minZ) / 2;
