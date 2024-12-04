export class ModuleState {
    #state; // Private state
    #listeners; // WeakMap for listener storage

    /**
     * Initializes the ModuleState with an optional initial state object.
     * The state is reactive, and listeners can be attached to state properties.
     * @param {Object} [initialState={}] - The initial state of the module.
     * @throws {Error} Throws an error if the initial state is not an object.
     */
    constructor(initialState = {}) {
        if (typeof initialState !== 'object' || initialState === null) {
            throw new Error("Initial state must be an object.");
        }
        this.#listeners = new Map();
        this.#state = this.#createReactiveState(initialState);
    }

    /**
     * Safely sets a property in the state. Triggers reactivity to update listeners.
     * @param {string} key - The key to set in the state.
     * @param {*} value - The value to set for the specified key.
     * @throws {Error} Throws an error if the property is not defined in the initial state.
     */
    setState(key, value) {
        this.#state[key] = value; // Triggers reactive handler
    }

    /**
     * Returns a read-only proxy of the state.
     * The proxy prevents direct modifications, ensuring the state is only updated via 'setState'.
     * @returns {Proxy} A read-only proxy object representing the state.
     */
    getState() {
        return new Proxy(this.#state, {
            /**
             * Prevents setting properties on the proxy.
             * @throws {Error} Throws an error if any attempt is made to modify the state directly.
             */
            set() {
                throw new Error(`State is read-only. Use 'setState()' to update properties.`);
            },
            /**
             * Prevents deleting properties from the proxy.
             * @throws {Error} Throws an error if any attempt is made to delete a property.
             */
            deleteProperty() {
                throw new Error(`Cannot delete properties from state.`);
            }
        });
    }
    
    // Method to remove all listeners and destroy state
    destroy() {
        this.#listeners.clear(); // Clear all listeners
        this.state = null; // Nullify state to release memory
    }
    /**
     * Creates a deeply reactive state using a Proxy.
     * Each level of the state is wrapped in a proxy to support deep reactivity.
     * @param {Object} state - The initial state object.
     * @returns {Proxy} A reactive proxy object representing the state.
     */
    #createReactiveState(state) {
        const handler = {
            /**
             * Intercepts property access and returns a reactive version of nested objects.
             * @param {Object} target - The target object being accessed.
             * @param {string} key - The property key being accessed.
             * @returns {*} The value of the requested property, or a nested proxy for objects.
             */
            get: (target, key) => {
                const value = target[key];
                // Support deep reactivity for objects and arrays
                return value && typeof value === 'object' ? this.#createReactiveState(value) : value;
            },

            /**
             * Intercepts setting of properties, triggers state update and notifies listeners.
             * @param {Object} target - The target object being modified.
             * @param {string} key - The property key being modified.
             * @param {*} value - The new value to set for the property.
             * @returns {boolean} Returns true if the operation is successful.
             */
            set: (target, key, value) => {
                if (Array.isArray(target)) {
                    if (key === 'length' || !isNaN(parseInt(key))) {
                        target[key] = value;
                        this.notify(key, target);
                        return true;
                    }
                }

                // Regular object key validation
                if ((key in target || typeof key === 'string') && !key.includes('[object Object]')) {
                    target[key] = value;
                    this.notify(key, value);
                    return true;
                }

                // Warn if the key is an invalid object
                if (JSON.stringify(key).includes('[object Object]')) {
                    console.warn(`Attempted to set an invalid key: ${key}`);
                }

                return false;
            },

            /**
             * Prevents the deletion of properties from the state.
             * @throws {Error} Throws an error if any attempt is made to delete a property.
             */
            deleteProperty() {
                throw new Error(`Cannot delete properties from state.`);
            }
        };

        return new Proxy(state, handler);
    }

    /**
     * Attaches a listener to a specific key in the state.
     * The listener will be called whenever the state for the specified key changes.
     * @param {string} key - The key to listen for changes on.
     * @param {Function} callback - The callback function to execute when the key changes.
     * @throws {Error} Throws an error if the callback is not a function.
     */
    listen(key, callback) {
        if (typeof callback !== 'function') {
            throw new Error(`Listener must be a function.`);
        }

        if (!this.#listeners.has(this.#state)) {
            this.#listeners.set(this.#state, new Map());
        }

        const stateListeners = this.#listeners.get(this.#state);
        if (!stateListeners.has(key)) {
            stateListeners.set(key, new Set());
        }

        stateListeners.get(key).add(callback);
    }

    /**
     * Notifies all listeners about a change to a specific state key.
     * This method is called when a property is updated in the state.
     * @param {string} key - The key that was updated.
     * @param {*} value - The new value of the updated property.
     * @private
     */
    notify(key, value) {
        const stateListeners = this.#listeners.get(this.#state);
        if (stateListeners && stateListeners.has(key)) {
            stateListeners.get(key).forEach(callback => callback(value));
        }
    }
}
