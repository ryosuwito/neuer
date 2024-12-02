export class ModuleView {
    /**
     * Manages the rendering of state changes to UI elements.
     * Binds state properties to DOM elements and provides render functions to update UI accordingly.
     * @param {ModuleState} state - The state object that holds the reactive data for this view.
     */
    constructor(state) {
        this.state = state; // The reactive state object
        this.renderMap = new Map(); // Stores render functions for each state key
    }

    /**
     * Binds a state property to a DOM element, rendering changes whenever the state updates.
     * The render function is optional and can be used to customize how the value is displayed.
     * @param {string} key - The key in the state object to bind to the element.
     * @param {HTMLElement} element - The DOM element to update based on the state.
     * @param {Function} [renderFn] - Optional render function to customize rendering. Defaults to setting `textContent`.
     */
    bindRenderToElement(key, element, renderFn) {
        this.registerRender(key, (value) => {
            if (renderFn) {
                renderFn(value, element, key);
            } else {
                element.textContent = value ?? ''; // Fallback to textContent if no renderFn is provided
            }
        });
    }

    /**
     * Registers a custom render function for a specific key in the state.
     * Multiple render functions can be associated with a single key.
     *
     * @param {string} key - The key in the state object to associate with the render function.
     * @param {Function} renderFn - The render function to execute when the state changes.
     */
    registerRender(key, renderFn) {
        // Ensure renderMap stores an array of render functions for each key
        if (!this.renderMap.has(key)) {
            this.renderMap.set(key, []);
            // Register state listener only once for the key
            this.state.listen(key, (value) => {
                const renderCallbacks = this.renderMap.get(key);
                if (Array.isArray(renderCallbacks)) {
                    renderCallbacks.forEach((callback) => callback(value));
                }
            });
        }

        // Add the new render function to the array for the key
        const renderCallbacks = this.renderMap.get(key);
        renderCallbacks.push(renderFn);
    }

    /**
     * Removes a specific render function associated with a key.
     *
     * @param {string} key - The key in the state object.
     * @param {Function} renderFn - The render function to remove.
     */
    removeRenderForKey(key, renderFn) {
        if (this.renderMap.has(key)) {
            const renderCallbacks = this.renderMap.get(key);
            const updatedCallbacks = renderCallbacks.filter((fn) => fn !== renderFn);
            this.renderMap.set(key, updatedCallbacks);

            // If no render functions are left, remove the key entirely
            if (updatedCallbacks.length === 0) {
                this.renderMap.delete(key);
            }
        }
    }

    /**
     * Unregisters the render function for a specific key in the state.
     * This stops the associated render function from being called on state updates.
     * @param {string} key - The key in the state object to unregister.
     */
    unregisterRender(key) {
        if (this.renderMap.has(key)) {
            this.renderMap.delete(key); // Remove the render function from the map
            this.state.unlisten(key);  // Unregister the listener from the state
            console.log(`Render function for key '${key}' has been unregistered.`);
        } else {
            console.warn(`No render function found for key '${key}'.`);
        }
    }

    /**
     * Renders the text content of a DOM element.
     * @param {string} value - The value to render.
     * @param {HTMLElement} element - The DOM element to render the content to.
     * @throws {Error} If the element is not a valid HTML element.
     */
    renderTextContent(value, element) {
        if (!(element instanceof HTMLElement)) {
            throw new Error("renderTextContent requires a valid HTML element.");
        }
        element.textContent = value;
    }

    /**
     * Renders an item (e.g., in a list or collection) to a DOM element.
     * @param {Object} context - The context containing the item data.
     * @param {HTMLElement} element - The DOM element to render the item to.
     * @throws {Error} If the element is not a valid HTML element.
     */
    renderItem(context, element) {
        if (!(element instanceof HTMLElement)) {
            throw new Error("renderItem requires a valid HTML element.");
        }
        element.textContent = context?.item?.name || 'Unknown';
    }

    /** 
     * Remove all bindings
     */
    unbindAll() {
        this.renderMap.clear();
    }
}
