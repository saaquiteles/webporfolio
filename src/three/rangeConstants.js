// Shared geometry constants for the range — kept in one place so the floor
// bounds used for movement clamping match the walls/backstop the
// environment actually renders.

// How tall the player is, in meters — added to a "feet" height to get the
// camera's actual (eye-level) Y position.
export const EYE_HEIGHT = 1.7;
// How fast the player walks, in meters per second.
export const MOVE_SPEED = 4.4;
// The camera's starting (x, y, z) position when the range first loads.
export const SPAWN_POSITION = [0, EYE_HEIGHT, 9];

// The rectangular floor area the player is allowed to walk within, in
// world-space X/Z coordinates.
export const RANGE_BOUNDS = {
  minX: -4.3,
  maxX: 4.3,
  minZ: -16.5,
  maxZ: 10.5
};

// The range's overall length, width, and center depth — calculated from
// RANGE_BOUNDS above so they can never fall out of sync with it.
export const RANGE_LENGTH = RANGE_BOUNDS.maxZ - RANGE_BOUNDS.minZ;
export const RANGE_WIDTH = RANGE_BOUNDS.maxX - RANGE_BOUNDS.minX;
export const RANGE_CENTER_Z = (RANGE_BOUNDS.maxZ + RANGE_BOUNDS.minZ) / 2;
