export class Mat3 {
    /**
     * @constructor
     * @param {number} [m11=1]
     * @param {number} [m12=0]
     * @param {number} [m13=0]
     * @param {number} [m21=0]
     * @param {number} [m22=1]
     * @param {number} [m23=0]
     * @param {number} [m31=0]
     * @param {number} [m32=0]
     * @param {number} [m33=1]
     */
    constructor(m11?: number | undefined, m12?: number | undefined, m13?: number | undefined, m21?: number | undefined, m22?: number | undefined, m23?: number | undefined, m31?: number | undefined, m32?: number | undefined, m33?: number | undefined);
    /**
     * The elements of the 3x3 matrix.
     * @type {Array<number>}
     */
    elements: Array<number>;
    /**
     * Get the element at the specified row and column.
     *
     * @param {number} row - The row index (0, 1, or 2).
     * @param {number} col - The column index (0, 1, or 2).
     * @returns {number} The element at the specified row and column.
     */
    get(row: number, col: number): number;
    /**
     * Set the element at the specified row and column.
     *
     * @param {number} row - The row index (0, 1, or 2).
     * @param {number} col - The column index (0, 1, or 2).
     * @param {number} value - The value to set.
     */
    set(row: number, col: number, value: number): void;
    /**
     * Multiply this matrix by another matrix.
     *
     * @param {Mat3} matrix - The matrix to multiply by.
     * @returns {Mat3} The resulting matrix.
     */
    mul(matrix: Mat3): Mat3;
    /**
     * Scalar multiplication of the matrix.
     *
     * @param {number} scalar - The scalar value to multiply by.
     * @returns {Mat3} The resulting matrix.
     */
    mulScalar(scalar: number): Mat3;
}
