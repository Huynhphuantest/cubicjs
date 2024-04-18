/**
 * https://github.com/mrdoob/eventdispatcher.js/
 */

export class EventDispatcher {
	/**
     * @param {string} type 
     * @param {Function} listener
     */
	addEventListener( type, listener ) {
		if ( this.listeners === undefined )
		/**@type {Map<string, Function[]>} */
			this.listeners = new Map();
		/**@type {Function[] | undefined} */
		let listenersArr = this.listeners.get(type);
		if ( listenersArr === undefined ) {
			listenersArr = [];
			this.listeners.set(type, listenersArr);
		}

		if (listenersArr.indexOf( listener ) === - 1 ) {
			listenersArr.push( listener );
		}
	}

	/**
     * @param {string} type 
     * @param {Function} listener
     */
	hasEventListener( type, listener ) {
		if ( this.listeners === undefined )
			return false;
		const listenersArr = this.listeners.get(type);
		if ( listenersArr === undefined)
			return false;
		if ( listenersArr.indexOf( listener )  !== - 1)
			return false;
	}

	/**
     * @param {string} type 
     * @param {Function} listener
     */
	removeEventListener( type, listener ) {

		if ( this.listeners === undefined ) return;

		const listenersArr = this.listeners.get(type);

		if ( listenersArr !== undefined ) {
			const index = listenersArr.indexOf( listener );
			if ( index !== - 1 ) {
				listenersArr.splice( index, 1 );
			}
		}

	}

	/**
     * @param {EventType} event
     */
	dispatchEvent( event ) {
		if ( this.listeners === undefined ) return;
		const listeners = this.listeners;
		const listenerArray = listeners.get(event.type);
		if ( listenerArray !== undefined ) {
			event.target = this;
			// Make a copy, in case listeners are removed while iterating.
			const array = listenerArray.slice( 0 );
			for ( let i = 0, l = array.length; i < l; i ++ ) {
				array[ i ].call( this, event );
			}
			event.target = null;
		}
	}

}

export class EventType {
	/**
     * @param {string} type
     * @param {*} [params]
     */
	constructor(type, params = {}) {
		this.type = type;
		this.params = params;
		/**@type {*} */
		this.target;
	}
}