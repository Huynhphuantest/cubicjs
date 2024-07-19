export class Material {
	/**
     * This define how a surface of an shape should be
     * @param {object} params
     * @param {number} [params.restitution]
     * @param {number} [params.friction]
     */
	constructor ({ restitution = 1, friction = 7 }) {
          /**
           * @description This define how bounciness the surface of 
           * the object should be or how much energy should be conserved
           * as motion after collision
           */
		this.restitution = restitution;
          /**
           * @description This define how rough the surface of the object should
           * be or how much should the friction force should be applied
           * after collision
           */
		this.friction = friction;
	}
}
