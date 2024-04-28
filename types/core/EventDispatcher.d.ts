/**
 * https://github.com/mrdoob/eventdispatcher.js/
 */
export class EventDispatcher {
    /**
     * @param {string} type
     * @param {Function} listener
     */
    addEventListener(type: string, listener: Function): void;
    /**@type {Map<string, Function[]>} */
    listeners: Map<string, Function[]> | undefined;
    /**
     * @param {string} type
     * @param {Function} listener
     */
    hasEventListener(type: string, listener: Function): false | undefined;
    /**
     * @param {string} type
     * @param {Function} listener
     */
    removeEventListener(type: string, listener: Function): void;
    /**
     * @param {EventType} event
     */
    dispatchEvent(event: EventType): void;
}
export class EventType {
    /**
     * @param {string} type
     * @param {*} [params]
     */
    constructor(type: string, params?: any);
    type: string;
    params: any;
    /**@type {*} */
    target: any;
}
