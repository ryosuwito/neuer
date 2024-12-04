import { Module } from '../module/Module.js';

/**
 * BaseForm class is an extension of the `Module` class designed to handle form-related functionality
 * within a custom web component. It provides methods for form submission, validation, data handling,
 * and dynamic interaction with form elements.
 * 
 * @extends Module
 */
export class BaseForm extends Module {
    /**
     * Creates an instance of the BaseForm class.
     * 
     * @param {Object} cfg Configuration object for the form.
     * @param {string} cfg.name Name for the form module (optional, defaults to 'baseform-<timestamp>').
     */
    constructor(cfg) {
        const config = {
            name: `${cfg.name ?? 'baseform'}`
        };
        super(config);
        this._action = '';
        this._disableSubmit = false;
        this._form = null;
        this._isHandlingSubmit = false;
        this._method = 'POST';
        this._module = null;
    }

    /**
     * Lifecycle method called when the custom element is connected to the DOM.
     * Loads the form HTML, CSS, and merges initial state with the default state.
     * 
     * @async
     * @param {string} htmlUri URL to the HTML template for the form.
     * @param {string} cssUri URL to the CSS file for styling the form.
     * @param {Object} [initialState={}] Initial state to be merged with default state.
     * @returns {Promise<void>} Resolves once the form is successfully connected.
     * @throws {Error} If the form HTML or CSS fails to load.
     */
    async connectedCallback(htmlUri, cssUri, initialState = {}) {
        const defaultState = {};
        // Merge default state with user-provided overrides
        const finalState = { ...defaultState, ...initialState };
        try {
            await super.connectedCallback(htmlUri, cssUri, finalState);
        } catch (error) {
            console.error("Error BaseForm connectedCallback:", error);
        }
        this.initializeModule()
    }

    /**
     * Returns an array of attribute names that the form component observes for changes.
     * 
     * @static
     * @returns {string[]} List of observed attribute names ('action', 'method', 'disable-submit').
     */
    static get observedAttributes() {
        return ['action', 'method', 'disable-submit'];
    }

    /**
     * Callback method invoked when an observed attribute changes.
     * Updates the form's properties accordingly.
     * 
     * @param {string} name Name of the changed attribute.
     * @param {string|null} oldValue Previous value of the attribute.
     * @param {string|null} newValue New value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'action') this._form?.setAttribute('action', newValue);
        if (name === 'method') this._form?.setAttribute('method', newValue);
        if (name === 'disable-submit') this._disableSubmit = newValue !== null;
    }

    /**
     * Initializes the form module by selecting the form element, binding its data and methods,
     * and enabling dynamic form control (such as toggling the submit button).
     * 
     * @param {string} rootId ID of the form element within the shadow DOM.
     */
    initializeModule() {
        const form = this.shadowRoot;
        // Configure form and store a reference
        form.action = this._action;
        form.method = this._method;
        this._form = form;
    }

    // Get the form data as an object
    getFormData() {
        const formData = new FormData(this._form);
        return Object.fromEntries(formData.entries());
    };

    // Allow external code to get/set the form values
    setFormData(data) {
        for (const [key, value] of Object.entries(data)) {
            const input = this._form.querySelector(`[name="${key}"]`);
            if (input) input.value = value;
        }
    };

    // Form submission logic
    async submitForm() {
        if (this._isHandlingSubmit) return; // Prevent multiple submissions
        this._isHandlingSubmit = true;
        try {
            const formData = this.getFormData();
            console.log('Form submitted with:', formData);

            // Add async work here if needed (e.g., API calls)
        } catch (error) {
            console.error('Error during submission', error);
        } finally {
            this._isHandlingSubmit = false;
        }
    };

    // Validation logic (can be extended)
    validateForm(event) {
        console.log('Form validation triggered:', event);
    };

    /**
     * Toggles the disabled state of the form's submit button based on the 'disable-submit' attribute.
     * 
     * @returns {void}
     */
    toggleSubmitButton() {
        const submitBtn = this.shadowRoot.querySelector('#submitBtn');
        submitBtn.disabled = this._disableSubmit;
    }
}

/**
 * Example usage:
 * const form = document.createElement('base-form');
 * form.setFormData({ username: 'JohnDoe', email: 'john@example.com' });
 * document.body.appendChild(form);
 */
