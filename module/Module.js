import { ModuleState } from './ModuleState.js';
import { ModuleControl } from './ModuleControl.js';
import { ModuleView } from './ModuleView.js';
import { ModuleDirectiveParser } from './ModuleDirectiveParser.js';
import { moduleManager } from './ModuleManager.js';

export class Module extends HTMLElement {
    state;
    props;
    #parser;
    #initialized = false;
    #renderers;

    /**
     * Creates an instance of the Module class.
     * This class is intended to be extended, not instantiated directly.
     * Derived classes must implement the `initializeModule` method.
     * @param {Object} config - The configuration object for the module.
     * @param {string} config.name - The name of the module.
     */
    constructor(config) {
        super();
        // Ensure Module is not instantiated directly
        if (new.target === Module) {
            throw new Error("Module is abstract and cannot be instantiated directly.");
        }


        this.name = `${config.name}- ${Date.now()}-${this.#generateRandomString(10)}`;
        this.state = new ModuleState({});
        this.attachShadow({ mode: 'open' });
        this.#renderers = new Proxy(
            {}, // Base object
            {
                get: (target, prop) => {
                    // Return custom renderer if available, otherwise fallback to view
                    return target[prop] || this.view?.[prop] || this.#defaultRenderer.bind(this, prop);
                },
                set: (target, prop, value) => {
                    if (typeof value === 'function') {
                        target[prop] = value;
                        return true;
                    }
                    console.warn(`Renderer '${prop}' must be a function.`);
                    return false;
                },
            }
        );
        moduleManager.registerModule(this.name, this);
    }

    /**
     * Default renderer fallback.
     * @param {string} rendererName - Name of the renderer function.
     * @param {*} value - The value to render.
     * @param {HTMLElement} element - The target DOM element.
     */
    #defaultRenderer(rendererName, value, element) {
        console.warn(`Renderer '${rendererName}' not defined. Falling back to textContent.`);
        element.textContent = value ?? '';
    }

    /**
     * Access renderers dynamically.
     */
    get render() {
        return this.#renderers;
    }

    /**
     * Initializes the module by fetching and assembling HTML and CSS content.
     * Sets up the state, control, and view for the module.
     * @param {string} htmlUri - The URI for the module's HTML content.
     * @param {string} cssUri - The URI for the module's CSS content.
     * @param {Object} initialState - The initial state of the module.
     */
    async connectedCallback(htmlContent, cssContent, initialState) {
        if (this.#initialized) {
            console.warn(`Module '${this.name}' has already been initialized.`);
            return;
        }

        try {
            const event = new CustomEvent('moduleReady', {
                detail: { key: this.name },
            },);
            const observedAttributes = this.constructor.observedAttributes || [];
            const defaultState = observedAttributes.reduce((state, attr) => {
                let stateKey = attr.startsWith('data-') ? attr.slice(5) : attr;
                stateKey = stateKey.replace(/-([a-z])/g, (match, p1) => p1.toUpperCase());
                let attrValue = this.getAttribute(attr);
                try {
                    attrValue = JSON.parse(attrValue);
                } catch (e) {
                    // Not JSON, keep as string
                }
                state[stateKey] = attrValue;
                return state;
            }, {});
            const finalState = { ...initialState, ...defaultState };

            this.shadowRoot.innerHTML = this.#assemble(htmlContent, cssContent);
            this.control = new ModuleControl(this.state);
            this.view = new ModuleView(this.state);

            this.setAttribute(`data-key`, this.name);
            this.initializeFromDOM();

            Object.keys(finalState).forEach(key => {
                this.setState(key, finalState[key]);
            });
            this.props = { ...this.getState() }
            this.dispatchEvent(event);
            this.#initialized = true;
        } catch (error) {
            console.error(`Error initializing module '${this.name}':`, error);
        }
    }

    /**
     * Initializes the module from the DOM, parsing any directives.
     * @returns {Module} The current instance of the module.
     */
    initializeFromDOM() {
        this.#parser = new ModuleDirectiveParser(this, this.shadowRoot);
        this.#parser.parse();
        return this;
    }

    /**
     * Cleanup logic when the module is removed from the DOM.
     */
    disconnectedCallback() {
        console.log(`Custom element '${this.name}' removed from the page.`);
        this.cleanup();
        moduleManager.unregisterModule(this.name);
    }

    /**
     * Called when the module is moved to a new page (document).
     */
    adoptedCallback() {
        console.log(`Custom element '${this.name}' moved to a new page.`);
    }

    /**
     * Called when an attribute on the module changes.
     * @param {string} name - The name of the changed attribute.
     * @param {string} oldValue - The old value of the attribute.
     * @param {string} newValue - The new value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            let stateKey = name.startsWith('data-') ? name.slice(5) : name;
            stateKey = stateKey.replace(/-([a-z])/g, (match, p1) => p1.toUpperCase());
            let parsedValue = newValue;
            if (newValue && newValue.includes(',') && !newValue.trim().startsWith('[')) {
                // If it's comma-separated but not JSON, keep as string
                parsedValue = newValue;
            } else {
                try {
                    parsedValue = JSON.parse(newValue);
                } catch (e) {
                    // Not JSON, keep as string
                }
            }
            this.setState(stateKey, parsedValue);
        }
    }

    /**
     * Assembles the module's HTML and CSS content by fetching them from URIs.
     * @param {string} htmlUri - The URI of the HTML content.
     * @param {string} cssUri - The URI of the CSS content.
     * @returns {Promise<string>} A promise that resolves to the assembled HTML content.
     * @throws {Error} If the resources fail to load.
     */
    #assemble(htmlContent, cssContent) {
        try {
            return `<style>${cssContent}</style>${htmlContent}`;
        } catch (error) {
            throw new Error(`Failed to fetch module resources: ${error.message}`);
        }
    }

    /**
     * Gets the current state of the module.
     * @returns {Proxy} The current reactive state object.
     */
    getState(key = null) {
        return key ? this.state.getState()[key] : this.state.getState()
    }

    /**
     * Sets the state for a given key.
     * @param {string} key - The key of the state to update.
     * @param {*} value - The value to set for the key.
     * @throws {Error} If the state key is invalid or not defined.
     */
    setState(key, value) {
        this.#validateStateKey(key);
        this.state?.setState(key, value);
    }

    /**
     * Binds a state property to a DOM element, rendering changes when the state updates.
     * @param {string} key - The key of the state property to bind.
     * @param {HTMLElement} element - The DOM element to bind the state property to.
     */
    bindState(key, element) {
        this.view.bindRenderToElement(key, element);
    }

    /**
     * Resets the module's state to its initial configuration.
     * If keys are provided, only those keys are reset (partial reset).
     * If no keys are provided, the entire state is reset (total reset).
     * @param {Array<string>} keys - Optional array of state keys to reset.
     */
    resetState(keys = null) {
        if (!this.props) {
            console.warn(`Module '${this.name}' has no initial props to reset.`);
            return;
        }

        const keysToReset = keys ? keys.filter(key => key in this.props) : Object.keys(this.props);

        if (keysToReset.length === 0) {
            console.warn(`Module '${this.name}': No valid keys provided for reset.`);
            return;
        }

        keysToReset.forEach(key => {
            this.setState(key, this.props[key]);
        });

        console.log(`Module '${this.name}' state has been ${keys ? "partially" : "fully"} reset.`);
    }

    /**
     * Binds an event handler to a DOM element.
     * @param {HTMLElement} element - The DOM element to bind the event to.
     * @param {string} eventName - The name of the event to listen for.
     * @param {Function} handler - The function to handle the event.
     * @throws {Error} If the element is not a valid HTML element or handler is not a function.
     */
    bindEvent(element, eventName, handler) {
        if (!(element instanceof HTMLElement)) {
            throw new Error("bindEvent requires a valid HTML element.");
        }
        if (typeof handler !== 'function') {
            throw new Error("bindEvent requires a valid event handler function.");
        }
        this.control.bindElementEvent(element, eventName, handler);
    }

    /**
     * Cleanup logic when the module is removed from the DOM.
     * Removes event listeners, state bindings, proxy state, and other resources.
     */
    cleanup() {
        // 1. Unbind all state bindings (via ModuleView)
        if (this.view) {
            this.view.unbindAll();
        }

        // 2. Remove all event listeners (via ModuleControl)
        if (this.control) {
            this.control.cleanupEvents();
        }

        // 3. Destroy proxy state (via ModuleState)
        if (this.state) {
            this.state.destroy();
            this.state = null; // Remove reference
        }
    }

    /**
     * Generates a random string of a specified length.
     * @param {number} length - The length of the random string.
     * @returns {string} The generated random string.
     */
    #generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    }

    /**
     * Validates that a state key is a valid string and exists in the current state.
     * @param {string} key - The state key to validate.
     * @throws {Error} If the key is not a string or does not exist in the state.
     */
    #validateStateKey(key) {
        if (typeof key !== 'string') {
            throw new Error("State key must be a string.");
        }
    }
}