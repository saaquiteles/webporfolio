// How far to shift the gun (and everything anchored to it) down from its
// authored position, in world units.
//
// Shared between WeaponRig (which applies it to the gun mesh) and Hands
// (which needs the same value to stay centered on the gun's actual
// rendered position, not its pre-offset authored coordinates) — kept in
// one place after the same drift bug (hand centered on the grip's
// pre-offset position) recurred from copy-pasted, unsynced values.
export const GUN_Y_OFFSET = -0.06;
