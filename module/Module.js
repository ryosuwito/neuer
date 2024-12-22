import { ModuleState } from './ModuleState.js';
import { ModuleControl } from './ModuleControl.js';
import { ModuleView } from './ModuleView.js';
import { ModuleDirectiveParser } from './ModuleDirectiveParser.js';
import { moduleManager } from './ModuleManager.js';
import { resetState } from '../utils/module-resetState.js'

export class Module extends HTMLElement {
    state;
    props;
    #elements = {};
    #initialized = false;
    #parser;
    #renderers;
    resetState;

    static globalStyleCache = new Map();

    /**
     * Registers the custom element using the CustomElementRegistry.
     * Ensures no duplicate registration and validates the element name.
     * 
     * @throws {Error} If the tag name is invalid or registration fails.
     */
    static registerElement() {
        const tagName = this.elementName;

        // Validate tag name
        if (!this.isValidTagName(tagName)) {
            console.error(
                `Failed to register custom element. "${tagName}" is not a valid name. ` +
                `A valid name must contain a hyphen (e.g., "my-element").`
            );
            return;
        }

        // Avoid duplicate registration
        if (customElements.get(tagName)) {
            console.warn(`Custom element "${tagName}" is already registered. Skipping registration.`);
            return;
        }

        // Register the element
        try {
            customElements.define(tagName, this);
            console.info(`Custom element "${tagName}" has been auto-registered.`);
        } catch (error) {
            console.error(`Error registering custom element "${tagName}":`, error);
        }
    }

    /**
     * Generates the custom element name by converting the class name to kebab-case.
     * 
     * @returns {string} The kebab-case tag name (e.g., "father-container").
     */
    static get elementName() {
        return this.name
            .replace(/([a-z])([A-Z])/g, '$1-$2') // Insert hyphens between camelCase words
            .toLowerCase();                    // Convert to lowercase
    }

    /**
     * Validates if the given tag name follows the Custom Elements naming convention.
     * 
     * @param {string} tagName - The tag name to validate.
     * @returns {boolean} True if valid, false otherwise.
     */
    static isValidTagName(tagName) {
        return /^[a-z][a-z0-9]*(-[a-z0-9]+)+$/.test(tagName); // Must contain at least one hyphen
    }

    /**
     * Simulate mutations for all observed attributes on first render.
     */
    triggerInitialAttributeChanges() {
        const dynamicAttributes = this.extractedAttributes;

        // Simulate mutation records for each dynamic attribute
        const simulatedMutations = dynamicAttributes.map((attr) => ({
            attributeName: attr,
            oldValue: null,
            type: 'attributes',
        }));

        // Call the mutation handler with the simulated mutations
        this.handleAttributeChanges(simulatedMutations);
    }

    /**
   * Sets up a MutationObserver to watch for dynamic attribute changes.
   */
    setupMutationObserver() {
        this.mutationObserver = new MutationObserver((mutations) => {
            this.handleAttributeChanges(mutations);
        });

        this.mutationObserver.observe(this, {
            attributes: true,
            attributeOldValue: true,
        });
    }

    /**
     * Handles attribute changes dynamically.
     * Filters attributes that start with ':' (or any other convention).
     * @param {MutationRecord[]} mutations - List of mutations observed.
     */
    handleAttributeChanges(mutations) {
        this._attributeChangeCache = this._attributeChangeCache ?? {};
        const dynamicAttributes = this.extractedAttributes;
        for (const mutation of mutations) {
            const attrName = mutation.attributeName;
            const newValue = this.getAttribute(attrName);
            const oldValue = this._attributeChangeCache[attrName] ?? mutation.oldValue;
            if (dynamicAttributes.includes(attrName)) {
                if (newValue === oldValue || (newValue === null && oldValue === null)) {
                    continue;
                }
                console.warn(`Dynamic attribute "${attrName}" changed from "${oldValue}" to "${newValue}".`);
                this._attributeChangeCache[attrName] = newValue;
                this.attributeChangedCallback(attrName, oldValue, newValue);
            }
        }
    }

    /**
     * Extracts attributes automatically from template placeholders (e.g., v-name).
     * @returns {Array<string>} List of attributes to observe.
     */
    get extractedAttributes() {
        const attributes = new Set();
        if (this.template) {
            const attributeRegex = /v-([a-zA-Z-]+)/g;
            const matches = [...this.template.matchAll(attributeRegex)];
            matches.forEach((match) => attributes.add(`data-${match[1]}`));
        }
        if (this.dataset) {
            Object.keys(this.dataset).forEach((key) => {
                attributes.add(`data-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
            });
        }
        return Array.from(attributes);
    }

    /**
     * Creates an instance of the Module class.
     * This class is intended to be extended, not instantiated directly.
     * Derived classes must implement the `initializeModule` method.
     * @param {Object} config - The configuration object for the module.
     * @param {string} config.name - The name of the module.
     */
    constructor(config = null) {
        if (!config || !config.name) {
            console.warn("Using default element name, to override pass config like this: `{ name: 'my-component' }`.");
        }
        super();
        // Ensure Module is not instantiated directly
        if (new.target === Module) {
            throw new Error("Nope. You can't instantiate the abstract 'Module' class directly. Try again.");
        }
        this.name = `${this.localName}-${this.#generateRandomString(10)}`;
        this.state = new ModuleState({});
        this.resetState = (keys) => resetState(this, keys);
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
        if (this.onInit) {
            this.onInit()
        }
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
        return this.view.renderTextContent(value, element);
    }

    /**
     * Access renderers dynamically.
     */
    get render() {
        return this.#renderers;
    }

    // Enhanced slot handling for single, specific slots only
    get slots() {
        try {
            return this.shadowRoot.querySelectorAll("slot");
        } catch (err) {
            console.warn("Slots not found:", err);
            return [];
        }
    }

    // Getter for assigned elements from a specific slot
    getAssigned(name = null) {
        const slots = this.slots;
        const targetSlot = Array.from(slots).find((slot) => {
            return name === null ? !slot.name : slot.name === name;
        });
    
        if (targetSlot) {
            try {
                // If named slot, convert children of the first assigned element to a list
                if (name) {
                    const children = targetSlot.assignedElements()[0]?.children || [];
                    return Array.from(children); // Convert HTMLCollection to array
                }
    
                // Default case: Return assigned elements as an array
                return targetSlot.assignedElements();
            } catch (err) {
                console.warn(`Error retrieving assigned elements for slot "${name || "default"}":`, err);
                return [];
            }
        }
    
        console.warn(`Slot "${name || "default"}" not found.`);
        return [];
    }
    // Getter for the assigned elements of the default slot (fallback for single-slot components)
    get assigned() {
        return this.getAssigned();
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
            const template = document.createElement("template");
            const defaultState = this.attributesToState(this.extractedAttributes || []);
            let finalState = { ...initialState, ...defaultState };
            htmlContent = htmlContent || this.template;
            cssContent = cssContent || this.styles;
            template.innerHTML = this.#assemble(htmlContent, cssContent || '');
            this.fragment = document.createDocumentFragment();
            this.fragment.appendChild(template.content.cloneNode(true));

            if (this.pullStyle) {
                await this.pullGlobalStyles(htmlContent)
            }

            this.control = new ModuleControl(this.state);
            this.view = new ModuleView(this.state);

            this.setAttribute(`data-key`, this.name);
            this.initializeFromDOM();

            this.shadowRoot.appendChild(this.fragment);

            this.setupMutationObserver();
            Object.keys(finalState).forEach(key => {
                this.setState(key, finalState[key]);
            });
            if (this.data) {
                Object.keys(this.data).forEach(key => {
                    this.setState(key, this.data[key]);
                });
            }
            this.triggerInitialAttributeChanges();
            this.#initialized = true;
            this.props = { ...this.getState() }
            const event = new CustomEvent('moduleReady', {
                detail: { key: this.name },
            },);
            this.dispatchEvent(event);
        } catch (error) {
            console.error(`Error initializing module '${this.name}':`, error);
        }

        if (this.onMount && this.#initialized) {
            this.onMount()
        }
    }

    attributesToState(observedAttributes) {
        return observedAttributes.reduce((state, attr) => {
            let stateKey = attr.startsWith("data-") ? attr.slice(5) : attr;
            stateKey = stateKey.replace(/-([a-z])/g, (match, p1) => p1.toUpperCase());
            let attrValue = this.getAttribute(attr);
            try {
                attrValue = JSON.parse(attrValue);
            } catch (e) {
            }
            state[stateKey] = attrValue;
            return state;
        }, {});
    }

    async pullGlobalStyles(htmlContent) {
        // Precompiled regex patterns
        const classRegex = /\bclass\s*=\s*["']([^"']+)["']/g;
        const classNames = new Set();

        // Step 1: Extract all class names from the HTML content using matchAll
        const matches = htmlContent.matchAll(classRegex);
        for (const match of matches) {
            match[1].split(/\s+/).forEach(cls => classNames.add(cls));
        }

        const matchedStyles = [];

        // Step 2: Separate cached and uncached class names
        const uncachedClassNames = {}; // Object to store uncached class names
        for (const className of classNames) {
            if (Module.globalStyleCache.has(className)) {
                const cachedStyle = Module.globalStyleCache.get(className);
                if (cachedStyle) {
                    matchedStyles.push(cachedStyle);
                }
            } else {
                uncachedClassNames[className] = true; // Using true for existence
            }
        }

        // Step 3: Process uncached class names by iterating through stylesheets
        const uncachedKeys = Object.keys(uncachedClassNames);
        if (uncachedKeys.length > 0) {
            const styleSheets = Array.from(document.styleSheets);

            // Initialize cache entries for uncached classes with empty strings
            for (const className of uncachedKeys) {
                Module.globalStyleCache.set(className, '');
            }

            // Iterate through all styleSheets and their cssRules once
            for (const sheet of styleSheets) {
                try {
                    const rules = sheet.cssRules || [];
                    for (const rule of rules) {
                        const cssText = rule.cssText || "";

                        // Check if the rule is related to any uncached class name
                        for (const className of uncachedKeys) {
                            const classPattern = new RegExp(`\\.${className}(\\b|[:\\s>.~+])`);
                            if (classPattern.test(cssText)) {
                                let existingStyle = Module.globalStyleCache.get(className);
                                Module.globalStyleCache.set(className, existingStyle + " " + cssText);
                                // Add animations if found
                                if (rule.type === CSSRule.KEYFRAMES_RULE) {
                                    matchedStyles.push(cssText);
                                }
                            }
                        }
                    }
                } catch (e) {
                    // Ignore cross-origin stylesheets
                    console.warn(`Could not access stylesheet: ${sheet.href}`, e);
                }
            }

            // Step 4: Collect cached styles for uncached class names
            for (const className of uncachedKeys) {
                const cachedStyle = Module.globalStyleCache.get(className);
                if (cachedStyle) {
                    matchedStyles.push(cachedStyle);
                }
            }
        }

        this.injectStyles(matchedStyles.join("\n"));
    }

    injectStyles(matchedStyles) {
        const styleBlock = this.fragment.querySelector("style");
        if (styleBlock) {
            styleBlock.innerHTML += `\n${matchedStyles}`;
        }
    }

    /**
     * Initializes the module from the DOM, parsing any directives.
     * @returns {Module} The current instance of the module.
     */
    initializeFromDOM() {
        this.#parser = new ModuleDirectiveParser(this, this.fragment);
        this.#parser.parse();
        return this;
    }

    /**
     * Cleanup logic when the module is removed from the DOM.
     */
    disconnectedCallback() {
        if (this.onUnmount) {
            this.onUnmount()
        }
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
        if (this.onUpdate) {
            this.onUpdate(key, value)
        }
    }

    /**
     * Get element bound to the module state(s).
     * If keys are provided, only get element bound to the state keys.
     * If no keys are provided, the entire elements will be given.
     * @param {string} keys - Optional array of state keys to reset.
     */
    getElement(key = null) {
        return key ? this.#elements[key] : { ...this.#elements }
    }

    /**
     * Binds a state property to a DOM element, rendering changes when the state updates.
     * @param {string} key - The key of the state property to bind.
     * @param {HTMLElement} element - The DOM element to bind the state property to.
     */
    bindState(key, element) {
        this.view.bindRenderToElement(key, element);
        this.#elements[key] = element
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
        if (/[A-Z]/.test(key)) {
            console.warn(`State key "${key}" contains uppercase letters. State and directive might not in sync`);
        }
    }
}