export const MATERIALS_RESTITUTION: {};
export class Material {
    /**
     * This define how rough / elastic / ... a surface of an shape should be
     * @param {object} params
     * @param {number} params.restitution
     */
    constructor({ restitution }: {
        restitution: number;
    });
    restitution: number;
}
