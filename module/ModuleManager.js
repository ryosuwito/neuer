export class ModuleManager {
    /**
     * Singleton class responsible for managing module registrations.
     * Ensures only one instance of the `ModuleManager` exists.
     */
    constructor() {
        if (ModuleManager.instance) {
            return ModuleManager.instance;
        }
        this.modules = new Map();
        this.globalEventBus = new EventTarget(); // Shared Event Bus
        this.globalRenderers = new Map();
        this.globalHandlers = new Map();
        ModuleManager.instance = this;
    }

    /**
     * Registers a new module under a specific name.
     * If a module with the same name already exists, an error is thrown.
     * @param {string} name - The name of the module to register.
     * @param {Object} module - The module object to register.
     * @throws {Error} Throws an error if a module with the same name is already registered.
     */
    registerModule(name, module) {
        if (this.modules.has(name)) {
            throw new Error(`Module ${name} is already registered.`);
        }
        this.modules.set(name, module);
    }

    /**
     * Unregisters a module by its name.
     * If the module does not exist, it will throw an error.
     * @param {string} name - The name of the module to unregister.
     * @throws {Error} Throws an error if the module is not found.
     */
    unregisterModule(name) {
        if (!this.modules.has(name)) {
            throw new Error(`Module ${name} is not registered.`);
        }

        this.modules.delete(name);
    }

    /**
     * Retrieves a registered module by its name.
     * @param {string} name - The name of the module to retrieve.
     * @returns {Object|undefined} The module associated with the given name, or undefined if not found.
     */
    getModule(name) {
        return this.modules.get(name);
    }

    /**
     * Sets up the moduleReady event listener for a given module element.
     *
     * @param {HTMLElement} element - The module element.
     * @param {Object} functionProps - Function props to bind to the module instance.
     * @param {Array} children - Nested child modules to attach after the module is ready.
     */
    handleModuleReady(element, functionProps, children) {
        element.addEventListener('moduleReady', () => {
            const moduleKey = element.getAttribute('data-key');
            const moduleInstance = this.getModule(moduleKey);

            if (moduleInstance) {
                Object.assign(moduleInstance, functionProps);
            }

            if (children.length > 0) {
                this.attachChildren(element, children);
            }
        }, { once: true });
    }
    /**
     * Creates and initializes a module element, handling props, event listeners, and nested children.
     *
     * @param {string} moduleName - The name of the module to create.
     * @param {Object} props - Props to initialize the module.
     * @param {Array} [children] - Nested child modules to attach to this module.
     * @returns {HTMLElement} The created module element.
     */
    createModuleElement(moduleName, props = {}, children = []) {
        const element = document.createElement(moduleName);
        const functionProps = {};
        Object.keys(props).forEach((key) => {
            if (typeof props[key] === 'function') {
                functionProps[key] = props[key];
            } else {
                element.setAttribute(`data-${key}`, props[key]);
            }
        });

        this.handleModuleReady(element, functionProps, children);
        return element;
    }

    /**
     * Recursively attaches child modules to a parent element.
     *
     * @param {HTMLElement} parent - The parent DOM element to which the children will be attached.
     * @param {Array} children - An array of child module configurations.
     * @param {string} children[].moduleName - The name of the child module to create.
     * @param {Object} children[].props - Props to initialize the child module.
     * @param {Array} [children[].children] - Nested child modules to attach to this child module.
     */
    attachChildren(parent, children = []) {
        const hasSlot = parent.shadowRoot?.querySelector('slot') !== null;
        if (!hasSlot && children.length > 0) {
            console.warn(
                `Parent module '${parent.tagName.toLowerCase()}' does not contain any <slot>, ` +
                `but children modules are being attached. Children will not be rendered.`
            );
            return;
        }

        children.forEach(({ moduleName, props, children: nestedChildren }) => {
            const childElement = this.createModuleElement(
                moduleName,
                props,
                nestedChildren
            );
            parent.appendChild(childElement);
            // console.log(`Child module '${moduleName}' attached to parent with props:`, props);
        });
    }

    /**
     * Attaches a module to a target DOM element.
     * Supports nested child modules and can initialize custom functions in props.
     *
     * @param {string} targetId - The ID of the target DOM element where the module will be attached.
     * @param {string} moduleName - The name of the module to attach.
     * @param {Object} props - Props to initialize the module.
     * @param {Array} [children] - Nested child modules to attach to this module.
     * @throws {Error} Throws an error if the target DOM element is not found.
     */
    async attachModule(targetId, moduleName, props = {}, children = []) {
        return new Promise((resolve, reject) => {
            const target = document.querySelector('#' + targetId);
            if (!target) {
                reject(new Error(`Target element with ID '${targetId}' not found.`));
                return;
            }
            const element = this.createModuleElement(moduleName, props, children);
            element.addEventListener('moduleReady', () => {
                const moduleKey = element.getAttribute('data-key');
                const moduleInstance = this.getModule(moduleKey);
                resolve(moduleInstance);
            }, { once: true });
    
            target.appendChild(element);
            // console.log(`Module '${moduleName}' attached to target '#${targetId}' with props:`, props);
        });
    }

    /**
     * Detaches a module as a component from the DOM.
     * @param {HTMLElement} target - The DOM element to detach the module from.
     * @param {string} moduleName - The name of the module to detach.
     */
    detachModule(moduleElement) {
        if (!moduleElement || !(moduleElement instanceof HTMLElement)) {
            throw new Error(`Invalid module element.`);
        }
        moduleElement.remove();
        console.log(`Module detached from DOM.`);
    }

    /**
     * Detaches a module as a component from the DOM.
     * @param {HTMLElement} target - The DOM element to detach the module from.
     * @param {string} moduleName - The name of the module to detach.
     */
    detachAllModule(targetId) {
        const target = document.querySelector('#' + targetId);
        if (!target) {
            throw new Error(`Target element with ID '${targetId}' not found.`);
        }
        target.innerHTML = '';
        console.log(`All modules detached from target.`);
    }

    /**
     * Registers a callback for a global event.
     * This allows modules or components to listen for events dispatched globally.
     *
     * @param {string} eventName - The name of the event to listen for.
     * @param {Function} callback - The function to execute when the event is triggered.
     * The callback receives an `Event` object with a `detail` property containing the event data.
     *
     * @example
     * moduleManager.onGlobalEvent('customEvent', (event) => {
     *     console.log('Event data:', event.detail);
     * });
     */
    onGlobalEvent(eventName, callback) {
        this.globalEventBus.addEventListener(eventName, callback);
    }

    /**
     * Dispatches a global event.
     * This sends an event that can be received by any module or component listening to the specified event name.
     *
     * @param {string} eventName - The name of the event to dispatch.
     * @param {Object} [detail={}] - Optional additional data to include with the event.
     * This data will be available in the `detail` property of the event object.
     *
     * @example
     * moduleManager.dispatchGlobalEvent('customEvent', { message: 'Hello, world!' });
     *
     * // Event listener
     * moduleManager.onGlobalEvent('customEvent', (event) => {
     *     console.log('Received message:', event.detail.message);
     * });
     */
    dispatchGlobalEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        this.globalEventBus.dispatchEvent(event);
    }

    /**
    * Registers a global renderer function.
    * @param {string} name - The name of the renderer.
    * @param {Function} fn - The renderer function.
    */
    registerRenderer(name, fn) {
        if (typeof fn !== "function") {
            throw new Error(`Renderer '${name}' must be a function.`);
        }
        this.globalRenderers.set(name, fn);
    }

    /**
     * Registers a global handler function.
     * @param {string} name - The name of the handler.
     * @param {Function} fn - The handler function.
     */
    registerHandler(name, fn) {
        if (typeof fn !== "function") {
            throw new Error(`Handler '${name}' must be a function.`);
        }
        this.globalHandlers.set(name, fn);
    }

    /**
     * Retrieves a global renderer function.
     * @param {string} name - The name of the renderer.
     * @returns {Function|null} The renderer function or null if not found.
     */
    getRenderer(name) {
        return this.globalRenderers.get(name) || null;
    }

    /**
     * Retrieves a global handler function.
     * @param {string} name - The name of the handler.
     * @returns {Function|null} The handler function or null if not found.
     */
    getHandler(name) {
        return this.globalHandlers.get(name) || null;
    }

    /**
     * Injects global renderer functions into the prototype of the specified class.
     * Allows instances of the class to access or override these renderers.
     *
     * @param {Function} classRef - The class reference to inject the renderers into.
     * @param {string[]} renderers - An array of renderer names to inject.
     * @throws {Error} If `classRef` is not a function (class reference).
     * @throws {Error} If `renderers` is not an array of strings.
     */
    injectGlobalRenderer(classRef, renderers = []) {
        if (typeof classRef !== "function") {
            throw new Error(`Expected 'classRef' to be a class (function), got ${typeof classRef}`);
        }
        if (!Array.isArray(renderers) || !renderers.every((r) => typeof r === "string")) {
            throw new Error(`Expected 'renderers' to be an array of strings.`);
        }

        renderers.forEach((name) => {
            Object.defineProperty(classRef.prototype, name, {
                get() {
                    return this[`_${name}`] || moduleManager.getRenderer(name);
                },
                set(fn) {
                    if (typeof fn === "function") {
                        this[`_${name}`] = fn;
                    } else {
                        console.warn(`Renderer '${name}' must be a function.`);
                    }
                },
                configurable: true, // Allow redefinition if necessary
            });
        });
    }

    /**
     * Injects global handler functions into the prototype of the specified class.
     * Allows instances of the class to access or override these handlers.
     *
     * @param {Function} classRef - The class reference to inject the handlers into.
     * @param {string[]} handlers - An array of handler names to inject.
     * @throws {Error} If `classRef` is not a function (class reference).
     * @throws {Error} If `handlers` is not an array of strings.
     */
    injectGlobalHandler(classRef, handlers = []) {
        if (typeof classRef !== "function") {
            throw new Error(`Expected 'classRef' to be a class (function), got ${typeof classRef}`);
        }
        if (!Array.isArray(handlers) || !handlers.every((h) => typeof h === "string")) {
            throw new Error(`Expected 'handlers' to be an array of strings.`);
        }

        handlers.forEach((name) => {
            Object.defineProperty(classRef.prototype, name, {
                get() {
                    return this[`_${name}`] || moduleManager.getHandler(name);
                },
                set(fn) {
                    if (typeof fn === "function") {
                        this[`_${name}`] = fn;
                    } else {
                        console.warn(`Handler '${name}' must be a function.`);
                    }
                },
                configurable: true, // Allow redefinition if necessary
            });
        });
    }

}

// Singleton instance of the ModuleManager
export const moduleManager = new ModuleManager();
