/* eslint no-unused-vars: 0 */

/**
 * This interface define what every Vector
 * should have.
 * @interface
 */
export default function Vector() {}
/**
 * @function
 * @param {*} nums
 * @returns {this} 
 * @name Vector#add
 */
Vector.prototype.add = function(nums) {
	throw new Error("Not Implemented");
};
/**
 * @function
 * @param {*} nums
 * @returns {this} 
 * @name Vector#sub
 */
Vector.prototype.sub = function(nums) {
	throw new Error("Not Implemented");
};
/**
 * Hadamard product
 * @function
 * @param {*} nums
 * @returns {this} 
 * @name Vector#add
 */
Vector.prototype.mul = function(nums) {
	throw new Error("Not Implemented");
};
/**
 * Inverse Hadamard product
 * @function
 * @param {*} nums
 * @returns {this} 
 * @name Vector#div
 */
Vector.prototype.div = function(nums) {
	throw new Error("Not Implemented");
};
/**
 * @function
 * @param {*} nums
 * @returns {Vector} 
 * @name Vector#added
 */
Vector.prototype.added = function(nums) {
	throw new Error("Not Implemented");
};
/**
 * @function
 * @param {*} nums
 * @returns {Vector} 
 * @name Vector#subed
 */
Vector.prototype.subed = function(nums) {
	throw new Error("Not Implemented");
};
/**
 * @function
 * @param {*} nums
 * @returns {Vector} 
 * @name Vector#muled
 */
Vector.prototype.muled = function(nums) {
	throw new Error("Not Implemented");
};
/**
 * @function
 * @param {*} nums
 * @returns {Vector} 
 * @name Vector#dived
 */
Vector.prototype.dived = function(nums) {
	throw new Error("Not Implemented");
};
/**
 * @function
 * @param {*} nums
 * @returns {Vector} 
 * @name Vector#muledScalar
 */
Vector.prototype.muledScalar = function(nums) {
	throw new Error("Not Implemented");
};
/**
 * @return {this}
 */
Vector.prototype.negate = function() {
	throw new Error("Not Implemented");
};
/**
 * @return {*}
 */
Vector.prototype.negate = function() {
	throw new Error("Not Implemented");
};
/**
 * @function
 * @param {number} [length]
 * @returns {this} 
 * @name Vector#normalize
 */
Vector.prototype.normalize = function(length = 1) {
	throw new Error("Not Implemented");
};
/**
 * @function
 * @param {number} [length]
 * @returns {*} 
 * @name Vector#normalized
 */
Vector.prototype.normalized = function(length = 1) {
	throw new Error("Not Implemented");
};
/**
 * @function
 * @param {*} target
 * @returns {number} 
 * @name Vector#dot
 */
Vector.prototype.dot = function(target) {
	throw new Error("Not Implemented");
};
/**
 * @function
 * @param {*} target
 * @returns {number} 
 * @name Vector#length
 */
Vector.prototype.length = function(target) {
	throw new Error("Not Implemented");
};
/**
 * @function
 * @param {*} target
 * @returns {number} 
 * @name Vector#lengthSq
 */
Vector.prototype.lengthSq = function(target) {
	throw new Error("Not Implemented");
};
/**
 * @function
 * @param {*} target
 * @returns {number} 
 * @name Vector#distanceTo
 */
Vector.prototype.distanceTo = function(target) {
	throw new Error("Not Implemented");
};
/**
 * @function
 * @param {*} target
 * @returns {number} 
 * @name Vector#distanceToSq
 */
Vector.prototype.distanceToSq = function(target) {
	throw new Error("Not Implemented");
};
/**
 * @function
 * @returns {Array<number>} 
 * @name Vector#toArray
 */
Vector.prototype.toArray = function() {
	throw new Error("Not Implemented");
};



/**
 * @returns {*}
 */
Vector.prototype.clone = function() {
	throw new Error("Not implemented");
};
/**
 * @param {*} target
 * @returns {this}
 */
Vector.prototype.copy = function(target) {
	throw new Error("Not implemented");
};