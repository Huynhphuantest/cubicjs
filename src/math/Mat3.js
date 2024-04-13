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
    constructor(
        m11 = 1, m12 = 0, m13 = 0,
        m21 = 0, m22 = 1, m23 = 0,
        m31 = 0, m32 = 0, m33 = 1
    ) {
        /**
         * The elements of the 3x3 matrix.
         * @type {Array<number>}
         */
        this.elements = [
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        ];
    }

    /**
     * Get the element at the specified row and column.
     *
     * @param {number} row - The row index (0, 1, or 2).
     * @param {number} col - The column index (0, 1, or 2).
     * @returns {number} The element at the specified row and column.
     */
    get(row, col) {
        return this.elements[row * 3 + col];
    }

    /**
     * Set the element at the specified row and column.
     *
     * @param {number} row - The row index (0, 1, or 2).
     * @param {number} col - The column index (0, 1, or 2).
     * @param {number} value - The value to set.
     */
    set(row, col, value) {
        this.elements[row * 3 + col] = value;
    }

    /**
     * Multiply this matrix by another matrix.
     *
     * @param {Mat3} matrix - The matrix to multiply by.
     * @returns {Mat3} The resulting matrix.
     */
    mul(matrix) {
        const result = new Mat3();

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let sum = 0;
                for (let k = 0; k < 3; k++) {
                    sum += this.get(i, k) * matrix.get(k, j);
                }
                result.set(i, j, sum);
            }
        }

        return result;
    }

    /**
     * Scalar multiplication of the matrix.
     *
     * @param {number} scalar - The scalar value to multiply by.
     * @returns {Mat3} The resulting matrix.
     */
    mulScalar(scalar) {
        const result = new Mat3();

        for (let i = 0; i < 9; i++) {
            result.elements[i] = this.elements[i] * scalar;
        }

        return result;
    }

    // Additional matrix operations can be added here
}