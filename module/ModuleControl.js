/**
 * Strict OOP implementation of ModuleControl class.
 */
export class ModuleControl {
    #state; // Private field for state
    #eventBus; // Private field for event bus
    #eventHandlers; // Private field for event handlers
    #eventBusCallbacks; // Track all event bus listeners

    /**
     * Initializes the ModuleControl instance.
     * @param {ModuleState} state - The state object that holds reactive data.
     */
    constructor(state) {
        if (!state || typeof state.getState !== "function") {
            throw new Error("Invalid state object provided.");
        }

        this.#state = state; // The reactive state object
        this.#eventBus = new EventTarget(); // Event bus for custom events
        this.#eventHandlers = new Map(); // WeakMap for event handlers
        this.#eventBusCallbacks = new Map(); // Map to track event bus listeners
    }
    
    /**
     * Binds an event listener to a DOM element.
     * @param {HTMLElement} element - The target DOM element.
     * @param {string} eventName - The name of the event to bind.
     * @param {Function} handler - The handler function.
     */
    bindElementEvent(element, eventName, handler) {
        this.#validateHTMLElement(element);
        this.#validateEventName(eventName);
        this.#validateFunction(handler);

        const boundHandler = (event) => handler(event, element, this.#state.getState());

        // Ensure the element has a map of event handlers
        if (!this.#eventHandlers.has(element)) {
            this.#eventHandlers.set(element, new Map());
        }

        // Store the event handler
        const handlers = this.#eventHandlers.get(element);
        if (handlers.has(eventName)) {
            throw new Error(
                `Event '${eventName}' is already bound to the given element. Detach it first before rebinding.`
            );
        }
        handlers.set(eventName, boundHandler);

        // Add the event listener
        element.addEventListener(eventName, boundHandler);
    }

    /**
     * Detaches a specific event listener from a DOM element.
     * @param {HTMLElement} element - The target DOM element.
     * @param {string} eventName - The name of the event to detach.
     */
    detachElementEvent(element, eventName) {
        this.#validateHTMLElement(element);
        this.#validateEventName(eventName);

        const handlers = this.#eventHandlers.get(element);
        if (handlers && handlers.has(eventName)) {
            const boundHandler = handlers.get(eventName);
            element.removeEventListener(eventName, boundHandler);
            handlers.delete(eventName);

            // Remove the element if it has no more handlers
            if (handlers.size === 0) {
                this.#eventHandlers.delete(element);
            }
        } else {
            throw new Error(`No handler found for event '${eventName}' on the given element.`);
        }
    }

    /**
     * Detaches all event listeners from a DOM element.
     * @param {HTMLElement} element - The target DOM element.
     */
    detachAllEvents(element) {
        this.#validateHTMLElement(element);

        const handlers = this.#eventHandlers.get(element);
        if (handlers) {
            handlers.forEach((handler, eventName) => {
                element.removeEventListener(eventName, handler);
            });
            this.#eventHandlers.delete(element);
        }
    }

    /**
     * Detaches all event listeners from module.
     */
    cleanupEvents() {
        // Detach all DOM element event handlers
        this.#eventHandlers.forEach((handlers, element) => {
            handlers.forEach((handler, eventName) => {
                element.removeEventListener(eventName, handler);
            });
        });
        this.#eventHandlers = new WeakMap(); // Clear all handlers
    
        // Detach all event bus callbacks
        this.#eventBusCallbacks.forEach((callbacks, eventName) => {
            callbacks.forEach((callback) => {
                this.#eventBus.removeEventListener(eventName, callback);
            });
        });
        this.#eventBusCallbacks.clear(); // Clear all event bus callbacks
    }
    

    /**
     * Registers a callback for a custom event.
     * @param {string} eventName - The name of the event.
     * @param {Function} callback - The callback function.
     */
    on(eventName, callback) {
        this.#validateEventName(eventName);
        this.#validateFunction(callback);
    
        // Add callback to event bus
        this.#eventBus.addEventListener(eventName, callback);
    
        // Track the callback for cleanup
        if (!this.#eventBusCallbacks.has(eventName)) {
            this.#eventBusCallbacks.set(eventName, new Set());
        }
        this.#eventBusCallbacks.get(eventName).add(callback);
    }
    

    /**
     * Removes a registered callback for a custom event.
     * @param {string} eventName - The name of the event.
     * @param {Function} callback - The callback function.
     */
    off(eventName, callback) {
        this.#validateEventName(eventName);
        this.#validateFunction(callback);
    
        // Remove callback from event bus
        this.#eventBus.removeEventListener(eventName, callback);
    
        // Remove from tracker
        if (this.#eventBusCallbacks.has(eventName)) {
            this.#eventBusCallbacks.get(eventName).delete(callback);
            if (this.#eventBusCallbacks.get(eventName).size === 0) {
                this.#eventBusCallbacks.delete(eventName);
            }
        }
    }
    

    /**
     * Dispatches a custom event.
     * @param {string} eventName - The name of the event.
     * @param {Object} [detail={}] - Optional additional data for the event.
     */
    dispatch(eventName, detail = {}) {
        this.#validateEventName(eventName);

        const event = new CustomEvent(eventName, { detail });
        this.#eventBus.dispatchEvent(event);
    }

    /**
     * Validates that the given value is an HTMLElement.
     * @param {*} element - The value to validate.
     * @throws {Error} If the value is not an HTMLElement.
     */
    #validateHTMLElement(element) {
        if (!(element instanceof HTMLElement)) {
            throw new Error("Provided value is not a valid HTMLElement.");
        }
    }

    /**
     * Validates that the given value is a string and not empty.
     * @param {*} eventName - The value to validate.
     * @throws {Error} If the value is not a valid string.
     */
    #validateEventName(eventName) {
        if (typeof eventName !== "string" || eventName.trim() === "") {
            throw new Error("Event name must be a non-empty string.");
        }
    }

    /**
     * Validates that the given value is a function.
     * @param {*} handler - The value to validate.
     * @throws {Error} If the value is not a function.
     */
    #validateFunction(handler) {
        if (typeof handler !== "function") {
            throw new Error("Provided value is not a valid function.");
        }
    }
}
