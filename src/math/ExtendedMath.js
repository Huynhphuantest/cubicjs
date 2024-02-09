// EXTENDED MATH :P

/**
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
export function clamp( value, min, max ) {
	return Math.max( min, Math.min( max, value ) );
}

/**
 * @param {number} min 
 * @param {number} max 
 */
export function rand(min, max) {
	return Math.random() * (max - min) + min;
}