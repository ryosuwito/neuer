/**
 * Class responsible for parsing and handling directives in the module's DOM.
 * Directives are custom attributes that define module behaviors (state, view, control, etc.).
 */
export class ModuleDirectiveParser {
    /**
     * Creates an instance of the ModuleDirectiveParser.
     * @param {Module} module - The module instance that owns this parser.
     * @param {HTMLElement} rootElement - The root element of the module to parse directives within.
     */
    constructor(module, rootElement) {
        this.module = module;
        this.rootElement = rootElement;
        this.directivePrefixes = ['c-', 'v-', 's-', 'f-', 'l-', 'f-'];
    }

    /**
     * Parses the directives in the module's root element and processes them accordingly.
     * Directives are processed in the following order: state, list, view, control, and conditional.
     * Also ensures data keys exist in the module's state and triggers notifications for all direct keys.
     * @param {HTMLElement|null} root - The root element to parse. Defaults to the module's root element.
     */
    parse(root = null) {
        // Ensures that all data keys are present in the state
        this.ensureDataKeys(root ?? this.rootElement);

        // Collect all directives and process them by type
        const directives = this.collectAllDirectives(root ?? this.rootElement);

        // Process state directives (s- prefix)
        directives.filter(d => d.type === 's').forEach(d => {
            this.handleStateDirective(d.element, d.name, d.value);
            this.removeDirective(d.element, `s-${d.name}`);
        });

        // Process list directives (l- prefix)
        directives.filter(d => d.type === 'l').forEach(d => {
            this.handleListDirective(d.element, d.name);
            this.removeDirective(d.element, `l-${d.name}`);
        });

        // Process view directives (v- prefix)
        directives.filter(d => d.type === 'v').forEach(d => {
            this.handleViewDirective(d.element, d.name, d.value);
            this.removeDirective(d.element, `v-${d.name}`);
        });

        // Process control directives (c- prefix)
        directives.filter(d => d.type === 'c').forEach(d => {
            this.handleControlDirective(d.element, d.name, d.value);
            this.removeDirective(d.element, `c-${d.name}`);
        });

        // Process conditional directives (f- prefix)
        directives.filter(d => d.type === 'f').forEach(d => {
            this.handleConditionalDirective(d.element, d.name, d.value);
            this.removeDirective(d.element, `f-${d.name}`);
        });
    }

    /**
     * Collects all directives in a given element and its children by inspecting attributes.
     * Directives are identified by their prefixes (e.g., `v-`, `s-`, `c-`).
     * @param {HTMLElement} element - The root element to search for directives.
     * @returns {Array<Object>} An array of directive objects, each containing:
     *                          {type, element, name, value}
     */
    collectAllDirectives(element) {
        const directives = [];
        const processElement = (el) => {
            // Check if it's an element node or fragment
            if (el.nodeType === Node.ELEMENT_NODE || el.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                // If it's a fragment, iterate through its children
                const elementsToProcess = el.nodeType === Node.DOCUMENT_FRAGMENT_NODE
                    ? el.children || el.childNodes
                    : el.children;

                // Process attributes for element nodes
                if (el.nodeType === Node.ELEMENT_NODE) {
                    Array.from(el.attributes || []).forEach(attr => {
                        const prefix = this.directivePrefixes.find(p => attr.name.startsWith(p));
                        if (prefix) {
                            directives.push({
                                type: prefix[0],
                                element: el,
                                name: attr.name.slice(prefix.length),
                                value: attr.value
                            });
                        }
                    });
                }

                // Recursively process child elements
                Array.from(elementsToProcess || []).forEach(processElement);
            }
        };

        processElement(element);
        return directives;
    }

    /**
     * Ensures that every element in the given DOM tree has a `data-key` attribute.
     * The `data-key` is set in the format `module-[moduleName]-[counter]` for each element.
     * This is useful for tracking elements and avoiding conflicts between elements.
     * 
     * @param {HTMLElement} element - The root element to begin processing.
     * @private
     */
    ensureDataKeys(element) {
        let counter = 0;
        const processElement = (el) => {
            if (el.nodeType === Node.ELEMENT_NODE) {
                if (!el.getAttribute('data-key')) {
                    el.setAttribute('data-key', `module-${this.module.name}-${counter++}`);
                }
                Array.from(el.children).forEach(processElement);
            }
        };

        processElement(element);
    }

    /**
     * Parses a directive value into its individual components: first action, operator, and action details.
     * This method is used for parsing complex directive values like conditions or operations.
     * 
     * Example: `show &| hidden` would be parsed into `{ firstAction: 'show', operator: '&|', actionDetails: 'hidden' }`.
     * 
     * @param {string} directiveValue - The raw directive value to be parsed.
     * @returns {Object} Parsed parts of the directive value with the following structure:
     *   - `firstAction`: The first part of the directive value (string).
     *   - `operator`: The operator if any (string or null).
     *   - `actionDetails`: The details of the action if any (string or null).
     */
    parseDirective(directiveValue) {
        const parts = directiveValue.split(/([&|>#@*<])/);

        return {
            firstAction: parts[0].trim(),
            operator: parts.length > 1 ? parts[1] : null,
            actionDetails: parts.length > 2 ? parts[2].trim() : null
        };
    }

    /**
     * Removes a specific directive from an element by removing its corresponding attribute.
     * This is typically used after a directive is processed to clean up the DOM.
     * 
     * @param {HTMLElement} element - The element from which the directive should be removed.
     * @param {string} directiveName - The name of the directive (e.g., `s-[directiveName]`).
     */
    removeDirective(element, directiveName) {
        if (element.hasAttribute(directiveName)) {
            element.removeAttribute(directiveName);
        }
    }

    /**
     * Handles a list directive on a template element, dynamically rendering list items
     * based on the provided list data or module state.
     *
     * @param {HTMLTemplateElement} element - The template element to process.
     * @param {string} listName - The name of the list in the module's state.
     * @param {Array} [value=null] - Optional list data to override the state value.
     */
    handleListDirective(element, listName, value = null) {
        // Ensure the directive is used on a valid template element
        if (!(element instanceof HTMLTemplateElement)) {
            console.error('List directive must be used on a template element');
            return;
        }

        // Find the closest parent container
        const container = element.parentElement;
        if (!container) {
            console.error('Container not found for list directive');
            return;
        }

        // Clear existing dynamically generated content, excluding the template itself
        Array.from(container.children)
            .filter(child => child !== element)
            .forEach(child => child.remove());

        // Get the list data from the provided value or module state
        const template = element.content;
        const list = Array.isArray(value)
            ? value
            : this.module.getState()[listName] || [];
        // Create a document fragment to hold all cloned items
        const fragment = document.createDocumentFragment();

        // Process each item in the list
        list.forEach((item, index) => {
            // Clone the template content
            const clone = document.importNode(template, true);

            // Create an item context with comprehensive data
            const itemContext = {
                item,
                items: list, // The entire list for context
                index
            };

            // Process nested directives within the cloned content
            this.processNestedDirectives(clone, itemContext);

            // Append the processed clone to the fragment
            fragment.appendChild(clone);
        });

        // Append all generated items to the container at once
        container.appendChild(fragment);

        // Bind the list to re-render dynamically when the state changes
        this.module.view.bindRenderToElement(listName, element, (updatedValue, el, key) => {
            this.handleListDirective(el, `${key}-handleListDirective`, updatedValue);
        });
    }

    /**
     * Processes nested directives within a given element and applies them based on the context of the item.
     * This method is called recursively to process directives that are nested inside templated content.
     * 
     * It handles the following types of directives in order: 
     * - View directives (`v-`)
     * - Conditional directives (`f-`)
     * - Control directives (`c-`)
     * - State directives (`s-`)
     * 
     * @param {HTMLElement} element - The element whose nested directives should be processed.
     * @param {Object} itemContext - The context for the current item being processed, typically containing the `item` and `index`.
     * @private
     */
    processNestedDirectives(element, itemContext) {
        // Ensure we're working with the content of the fragment
        const directives = this.collectAllDirectives(element);

        // Process view directives
        directives.filter(d => d.type === 'v').forEach(d => {
            this.handleViewDirectiveWithContext(d.element, d.name, d.value, itemContext);
            this.removeDirective(d.element, `v-${d.name}`);
        });

        // Process conditional directives
        directives.filter(d => d.type === 'f').forEach(d => {
            this.handleConditionalDirective(d.element, d.name, d.value, itemContext);
            this.removeDirective(d.element, `f-${d.name}`);
        });

        // Process control directives
        directives.filter(d => d.type === 'c').forEach(d => {
            this.handleControlDirectiveWithContext(d.element, d.name, d.value, itemContext);
            this.removeDirective(d.element, `c-${d.name}`);
        });

        // Process state directives
        directives.filter(d => d.type === 's').forEach(d => {
            this.handleStateDirectiveWithContext(d.element, d.name, d.value, itemContext);
            this.removeDirective(d.element, `s-${d.name}`);
        });
    }

    /**
     * Handles a view directive (`v-`) by rendering a value from the item context into the element.
     * It tries to use a render function associated with the directive. If a render function exists in the module, it is invoked with the item context.
     * Otherwise, it falls back to simple text rendering using the context value.
     * 
     * @param {HTMLElement} element - The element to which the directive is applied.
     * @param {string} bindingName - The name of the binding to look up in the item context.
     * @param {string} renderFnName - The name of the render function to call if it exists.
     * @param {Object} itemContext - The context of the item being processed, typically containing `item` and `index`.
     */
    handleViewDirectiveWithContext(element, bindingName, renderFnName, itemContext) {
        // Resolve the value from the context
        const contextValue = this.getValueFromContext(bindingName, itemContext);
        const renderer = this.module[renderFnName] || this.module.render[renderFnName]
        if (!renderer) {
            console.warn(`Renderer '${renderFnName}' is undefined.`);
            el.textContent = contextValue ?? '';
            return;
        }

        renderer.call(this.module, itemContext, element);
    }

    /**
     * Retrieves a value from the provided context by following a given path.
     * The path is a dot-separated string representing the property to access in the context object.
     * 
     * @param {string} path - A dot-separated string representing the path to a value in the context.
     * @param {Object} context - The context object, typically containing `item` and `index`.
     * @returns {*} The resolved value from the context, or `undefined` if the path is invalid.
     * @private
     */
    getValueFromContext(path, context) {
        // Split the path and traverse the context
        return path.split('.').reduce((obj, key) =>
            obj && typeof obj === 'object' ? obj[key] : undefined,
            context.item
        );
    }

    /**
     * Evaluates a condition string against the current item context to determine its truthiness.
     * The condition is resolved by traversing the context and checking the value at the specified path.
     * 
     * @param {string} condition - The condition to evaluate, usually a string path to a property in the context.
     * @param {Object} context - The context object, typically containing `item` and `index`.
     * @returns {boolean} `true` if the condition is truthy, `false` otherwise.
     * @private
     */
    evaluateCondition(condition, context) {
        try {
            // Resolve the condition value from the context
            const value = this.getValueFromContext(condition, context);
            return !!value; // Return true if the value is truthy, false otherwise
        } catch (e) {
            console.error('Error evaluating condition:', e);
            return false;
        }
    }

    /**
     * Removes a specific directive attribute from an element after it has been processed.
     * This helps in cleaning up the element after applying its directive.
     * 
     * @param {HTMLElement} element - The element from which to remove the directive.
     * @param {string} directiveName - The name of the directive to remove (e.g., `s-[directiveName]`).
     * @private
     */
    removeDirective(element, directiveName) {
        if (element.hasAttribute(directiveName)) {
            element.removeAttribute(directiveName);
        }
    }

    /**
     * Handles a conditional directive (`f-`) by evaluating a condition and showing or hiding the element based on the result.
     * 
     * @param {HTMLElement} element - The element to which the conditional directive is applied.
     * @param {string} name - The name of the directive (for informational purposes).
     * @param {string} value - The condition to evaluate, typically a path to a property in the context.
     * @param {Object} itemContext - The context of the item being processed, containing `item` and `index`.
     */
    handleConditionalDirective(element, name, value, itemContext) {
        // Resolve the condition from the context
        const shouldShow = this.evaluateCondition(value, itemContext);

        // Set display based on condition
        element.style.display = shouldShow ? '' : 'none';
    }

    /**
     * Handles a control directive (`c-`) by binding an event to an element and executing the specified action when the event is triggered.
     * It supports different operators like `:` for passing action details, `>` for dispatching an action, and `@` for handling asynchronous results.
     * The action is executed within the context of both the module's state and the item context.
     * 
     * @param {HTMLElement} element - The element to which the control directive (`c-`) is applied. 
     * @param {string} eventName - The name of the event to bind to the element (e.g., `click`, `change`).
     * @param {string} directiveValue - The value of the control directive, which contains the action and operator.
     * @param {Object} itemContext - The context for the current item being processed, typically containing `item` and `index`.
     * 
     * @example
     * // Example of usage in a template:
     * // <button c-click="handleClick:submitForm">Submit</button>
     * // Will bind the `click` event on the button to the `handleClick` method
     * // and pass `submitForm` as `actionDetails` to the method.
     */
    handleControlDirectiveWithContext(element, eventName, directiveValue, itemContext) {
        let { firstAction, operator, actionDetails } = this.parseDirective(directiveValue);

        // Handle splitting the directive when the action includes ":"
        if (firstAction.includes(':')) {
            [firstAction, actionDetails] = firstAction.split(':');
            operator = ':';
        }

        // Bind event listener to the element
        this.module.bindEvent(element, eventName, (event, el) => {
            let result = null;

            // Check if the operator is ":", meaning actionDetails will be passed
            if (operator == ':' && actionDetails) {
                result = this.module[firstAction]?.(event, el, {
                    actionDetails,
                    ...this.module.getState(),
                    ...itemContext
                });
            } else {
                result = this.module[firstAction]?.(event, el, {
                    ...this.module.getState(),
                    ...itemContext
                });
            }

            // If no actionDetails, return the result
            if (!actionDetails) return result;

            // Dispatch control event based on operator
            switch (operator) {
                case '>':
                    // Dispatch action to control with the result
                    this.module.control.dispatch(actionDetails, {
                        result,
                        context: {
                            ...this.module.getState(),
                            ...itemContext
                        }
                    });
                    break;

                case '@':
                    // Handle asynchronous results using the "@" operator
                    if (typeof result?.then === 'function') {
                        result.then(res => {
                            // Dispatch action with the resolved result
                            this.module.control.dispatch(actionDetails, {
                                result: res,
                                context: {
                                    ...this.module.getState(),
                                    ...itemContext
                                }
                            });
                        }).catch(console.error);  // Handle any errors
                    }
                    break;
            }
        });
    }


    /**
     * Handles a control directive (`c-`) by binding an event to an element and executing the specified action when the event is triggered.
     * The directive value specifies the action and operator. Depending on the operator used (`:`, `&`, `#`, `>`, `*`, `@`, or `<`), the behavior of 
     * the handler is adjusted accordingly. The action is executed within the context of the module's state and the element's state.
     * 
     * @param {HTMLElement} element - The element to which the control directive (`c-`) is applied. 
     * @param {string} eventName - The name of the event to bind to the element (e.g., `click`, `change`).
     * @param {string} directiveValue - The value of the control directive, which contains the action and operator.
     * 
     * @throws {Error} If no action is specified or if an invalid operator is provided.
     * @throws {Error} If the `@` operator is used with a non-asynchronous handler.
     * 
     * @example
     * // Example usage of directive in HTML:
     * // <button c-click="handleClick:contextStateName">Submit</button>
     * // This will bind the click event to the handleClick method and pass `contextStateName` as actionDetails.
     * 
     * @description
     * This method parses the directive value to extract the first action (the method name), 
     * the operator (e.g., `&`, `#`, `>`, etc.), and the action details (which may specify additional information like event dispatch).
     * It then binds the event handler to the specified element and handles the event according to the operator used.
     * 
     * **Operator Behavior**:
     * - `:`: Action will be based on context (stateName).
     * - `&`: Stops the pipeline gracefully if the result is invalid (null, undefined, or empty).
     * - `#`: Throws an error if the result is invalid, causing a "chaotic stop."
     * - `>`: Dispatches an event with the result.
     * - `*`: Dispatches multiple events with the result.
     * - `@`: Requires the handler to be asynchronous. If the handler returns a Promise, it dispatches the result after it resolves.
     * - `<`: Binds a new event to the element and triggers another handler based on the action details.
     * 
     * @example
     * // Example of directive with `&` operator:
     * // <button c-click="validateInput&processResult">Submit</button>
     * // In this case, if `validateInput` returns an invalid value, the pipeline stops gracefully.
     * 
     * @example
     * // Example of directive with `@` operator for async handling:
     * // <button c-click="someFunction@asyncAction">Submit</button>
     * // This process the click event with someFunction and continue. This process expects `asyncAction` to be an asynchronous function.
     */
    handleControlDirective(element, eventName, directiveValue) {
        // Parse the directive value to extract the first action, operator, and action details
        let { firstAction, operator, actionDetails } = this.parseDirective(directiveValue);

        // If the firstAction includes ":", separate it from actionDetails and set operator to ":"
        if (firstAction.includes(':')) {
            [firstAction, actionDetails] = firstAction.split(':');
            operator = ':';
        }

        // If no first action is provided, throw an error as it's required
        if (!firstAction) {
            throw new Error('Minimum one handler is needed');
        }

        // Handle the event binding to the element
        this.module.bindEvent(element, eventName, (event, el, state) => {
            let result = null;

            // If the operator is ":", invoke the action with state and actionDetails
            if (operator == ':' && actionDetails) {
                result = this.module[firstAction]?.(event, el, {
                    actionDetails,
                    ...this.module.getState()
                });
            } else {
                // Otherwise, invoke the action with state
                result = this.module[firstAction]?.(event, el, state);
            }

            // If no action details, return the result
            if (!actionDetails) return result;

            // Extract function name from action details
            let fnName = actionDetails.split(':')[0];

            // Switch behavior based on the operator
            switch (operator) {
                case '&': {
                    // Gracefully stop the pipeline if result is invalid
                    if (result === null || result === undefined || result === '') {
                        console.log(`Gracefully stopping pipeline due to invalid newValue in handler: ${fnName}`);
                        break;
                    }
                    // If valid, process result through the next handler
                    result = this.module[fnName]?.(event, el, result);
                    break;
                }

                case '#': {
                    // Chaotic stop: Throw an error if result is invalid
                    if (result === null || result === undefined || result === '') {
                        throw new Error(`Chaotic stop: Handler ${fnName} failed.`);
                        break;
                    }
                    // If valid, process result through the next handler
                    result = this.module[fnName]?.(event, el, result);
                    break;
                }

                case '>': {
                    // Dispatch an event with the result
                    const [dispatchEvent] = actionDetails.split(':');
                    this.module.control.dispatch(dispatchEvent, { result });
                    break;
                }

                case '*': {
                    // Dispatch multiple events with the result
                    const events = actionDetails.split(',');
                    events.forEach(event => {
                        this.module.control.dispatch(event.trim(), { result });
                    });
                    break;
                }

                case '@': {
                    // Handle asynchronous result: Ensure handler is async
                    const handler = this.module[fnName];
                    if (!handler || handler.constructor.name !== 'AsyncFunction') {
                        throw new Error(`The handler ${fnName} must be asynchronous for @ operator.`);
                    }
                    // If async, resolve the result and dispatch the action
                    handler(event, el, state).then(res => {
                        const [dispatchEvent] = actionDetails.split(':');
                        this.module.control.dispatch(dispatchEvent, { result: res });
                    }).catch(err => {
                        console.error('Async function failed:', err);
                    });
                    break;
                }

                case '<': {
                    // Bind a new event to the element and invoke a new handler
                    const [newEvent, newHandler] = actionDetails.split(':');
                    this.module.bindEvent(el, newEvent, (event, el, state) => {
                        this.module[newHandler]?.(event, el, state);
                    });
                    break;
                }

                case ':': {
                    // No further action, just break out of the switch
                    break;
                }

                default:
                    // Throw an error if an invalid operator is used
                    throw new Error('Invalid operator used in the directive.');
            }
        });
    }


    /**
     * Handles a view directive (`v-`) by binding a rendering function to an element, which updates the 
     * element's content based on the state value associated with the specified state name.
     * 
     * This method binds a render function to the specified element, ensuring the element's content is 
     * updated whenever the state value changes. The function specified by `renderFnName` is called with 
     * the current state value, element, and an optional key for advanced rendering.
     * 
     * @param {HTMLElement} element - The element to which the view directive (`v-`) is applied.
     * @param {string} stateName - The name of the state variable to bind to the element's rendering logic.
     * @param {string} renderFnName - The name of the function in the module used to render the element's content.
     * 
     * @example
     * // Example usage in HTML:
     * // <div v-text="renderText"></div>
     * // In this case, the state value associated with `text` will be rendered using the `renderText` function.
     * 
     * @description
     * This method connects the element to a state variable and a render function, ensuring the element's 
     * content is dynamically updated whenever the state value changes. The render function specified by 
     * `renderFnName` should accept the state value and element as parameters to update the element's 
     * content or perform any other necessary updates.
     * 
     * @example
     * // Example of a render function:
     * renderText(value, element) {
     *     element.textContent = value; // Simply sets the text content of the element
     * }
     * 
     * @see {@link module:view#bindRenderToElement} for the function that binds the render logic to the element.
     */
    handleViewDirective(element, stateName, renderFnName) {
        this.module.view.bindRenderToElement(stateName, element, (value, el, key) => {
            const renderer = this.module[renderFnName] || this.module.render[renderFnName]
            if (!renderer) {
                console.warn(`Renderer '${renderFnName}' is undefined.`);
                el.textContent = value ?? '';
                return;
            }
    
            renderer.call(this.module, value, el);
        });
    }

    /**
     * Handles a state directive (`s-`) by binding an event to an element and updating the specified state 
     * based on the element's value, using one or more handler functions. The directive value contains one or 
     * more handler names and operators, which define how the element's value is processed before updating 
     * the associated state.
     * 
     * @param {HTMLElement} element - The element to which the state directive (`s-`) is applied. 
     * @param {string} stateName - The name of the state to be updated when the event is triggered.
     * @param {string} eventName - The name(s) of the event(s) to bind to the element, with optional handlers 
     *                             and operators specified (e.g., `input|processValue&`).
     * 
     * @throws {Error} If a handler throws an error and the operator is `#`, which causes a "chaotic stop".
     * 
     * @example
     * // Example usage of directive in HTML:
     * // <input s-value="updateValue&processInput" />
     * // This binds the input element's value to the state named `value` and processes it through `updateValue` 
     * // and `processInput` handlers, with the `&` operator used to gracefully stop if any handler returns an invalid value.
     * 
     * @description
     * This method parses the event name to extract the handler functions and their operators. It then binds the 
     * specified event to the element, processes the element's value using the handlers in sequence, and updates 
     * the corresponding state if the value is valid.
     * 
     * **Operator Behavior**:
     * - `&`: Gracefully stops the pipeline if the result is invalid (null, undefined, or empty).
     * - `#`: Throws an error if the result is invalid, causing a "chaotic stop".
     * 
     * @example
     * // Example of directive with `&` operator:
     * // <input s-value="validateInput&sanitizeValue" />
     * // In this case, if `validateInput` returns an invalid value (null, undefined, or empty), 
     * // the pipeline will stop gracefully and the state won't be updated.
     * 
     * @example
     * // Example of directive with `#` operator:
     * // <input s-value="validateInput#processValue" />
     * // If `validateInput` returns an invalid value, the error will be thrown, and the state will not be updated.
     */
    handleStateDirective(element, stateName, eventName) {
        // Regular expression to extract handler names and operators from the event name
        const handlerRegex = /([a-zA-Z0-9]+)([&|#]*)/g;

        const handlers = [];
        let match;

        // Use the regex to find all handlers and operators in the event name
        while ((match = handlerRegex.exec(eventName)) !== null) {
            const handlerName = match[1];
            const operator = match[2];
            handlers.push({ handlerName, operator });
        }

        // Bind the state to the element
        this.module.bindState(stateName, element); // Pass the actual element here

        // Bind the event to the element
        this.module.bindEvent(element, eventName.split('|')[0], (event, element, state) => {
            let value = element.value;

            // Iterate through all the handlers and apply the operators
            for (let { handlerName, operator } of handlers) {
                if (this.module[handlerName]) {
                    let newValue = this.module[handlerName](value, element, state);

                    // Handle the operator cases
                    if (operator === '&') {
                        // Gracefully stop if the result is invalid
                        if (newValue === null || newValue === undefined || newValue === '') {
                            console.log(`Gracefully stopping pipeline due to invalid newValue in handler: ${handlerName}`);
                            break;
                        }
                    } else if (operator === '#') {
                        // Chaotic stop: Throw an error if the result is invalid
                        if (newValue === null || newValue === undefined || newValue === '') {
                            throw new Error(`Chaotic stop: Handler ${handlerName} failed.`);
                        }
                    }

                    // Update the value
                    value = newValue || value;
                }
            }

            // Update the state with the final value
            state[stateName] = value;
        });
    }

    /**
     * Handles a state directive (`s-`) by binding the specified state to an element and processing 
     * any event handlers that modify the state value. This version of the handler also supports context 
     * binding from the item context, allowing for more dynamic state manipulation.
     * 
     * The method parses the event name to identify handler functions and operators, binds the specified 
     * state to the element, and processes any events triggered by the element. It applies any transformations 
     * to the state value based on the handler functions and operators, and then updates the state with the 
     * final value.
     * 
     * @param {HTMLElement} element - The element to which the state directive (`s-`) is applied.
     * @param {string} stateName - The name of the state variable to bind to the element and modify.
     * @param {string} eventName - The name of the event that will trigger the handler and the state update.
     * @param {object} itemContext - The context object to provide additional data to handlers during state updates.
     * 
     * @example
     * // Example usage:
     * // <input s-value="handleValueChange" />
     * // When the input's value changes, the handler `handleValueChange` will be applied to the input value,
     * // and the state `value` will be updated accordingly.
     * 
     * @description
     * This method binds an event listener to the element's event (`eventName`) and processes the handlers 
     * specified by the event name. Handlers are parsed using a regular expression to identify the handler 
     * name and operator (`&`, `#`, etc.). Each handler is applied in sequence, with the final state value 
     * being set based on the transformations done by the handlers. The state is updated only after all 
     * handlers are applied, and any invalid or incomplete transformations are handled gracefully or by 
     * throwing errors.
     * 
     * @throws {Error} Will throw an error if a handler fails with the `#` operator or if no handler is found.
     * @throws {Error} Will throw an error if a required handler fails and does not produce a valid result.
     * 
     * @see {@link module:module#bindState} for state binding logic.
     * @see {@link module:module#bindEvent} for event binding logic.
     */
    handleStateDirectiveWithContext(element, stateName, eventName, itemContext) {
        const handlerRegex = /([a-zA-Z0-9]+)([&|#]*)/g;

        const handlers = [];
        let match;
        // Parse the eventName for handler functions and their operators
        while ((match = handlerRegex.exec(eventName)) !== null) {
            const handlerName = match[1];
            const operator = match[2];
            handlers.push({ handlerName, operator });
        }

        // Bind the state to the element
        this.module.bindState(stateName, element); // Pass the actual element here

        // Bind the event to the element
        this.module.bindEvent(element, eventName.split('|')[0], (event, element, state) => {
            let value = element.value;

            // Process each handler function and operator
            for (let { handlerName, operator } of handlers) {
                if (this.module[handlerName]) {
                    let newValue = this.module[handlerName](value, element, {
                        ...this.module.getState(),
                        ...itemContext // Include itemContext in the handler's state
                    });

                    // Handle different operator conditions
                    if (operator === '&') {
                        // Gracefully stop if the handler produces an invalid value
                        if (newValue === null || newValue === undefined || newValue === '') {
                            console.log(`Gracefully stopping pipeline due to invalid newValue in handler: ${handlerName}`);
                            break;
                        }
                    } else if (operator === '#') {
                        // Chaotic stop: throw error if handler fails
                        if (newValue === null || newValue === undefined || newValue === '') {
                            throw new Error(`Chaotic stop: Handler ${handlerName} failed.`);
                        }
                    }

                    // Update the value with the new result from the handler
                    value = newValue || value;
                }
            }

            // Update the state with the final value
            state[stateName] = value;
        });
    }
}