import { BaseForm } from "./BaseForm.js";

/**
 * The RegistrationForm class is a custom web component that represents a registration form for creating an account.
 * It includes functionality for handling user input validation, form submission, adding/removing products and users, 
 * password visibility toggling, and sanitizing input fields.
 * 
 * @extends BaseForm
 */
export class RegistrationForm extends BaseForm {
    /**
     * Creates an instance of the RegistrationForm class.
     * 
     * @param {Object} [config={}] Configuration object.
     * @param {string} [config.name] The name of the registration form instance (optional, defaults to `registrationForm-<timestamp>`).
     */
    constructor() {
        const config = {
            name: `registrationForm`
        };
        super(config);
    }

    /**
     * Lifecycle method called when the custom element is connected to the DOM.
     * It initializes the registration form by loading the HTML and CSS templates, setting the initial state,
     * and calling the necessary methods to bind the form's behavior and controls.
     * 
     * @async
     * @returns {Promise<void>} Resolves when the registration form content is successfully loaded.
     * @throws {Error} If there is an error loading the form's HTML or CSS templates.
     */
    async connectedCallback() {
        const initialState = {
            message: 'Create an Account',
            email: '',
            username: '',
            password: '',
            users: [],
            products: [],
            user_count: 0,
            product_count: 0,
            email_error: '',
            username_error: '',
            password_error: ''
        };
        try {
            const htmlContent = __HTML__;
            const cssContent = __CSS__;

            await super.connectedCallback(htmlContent, cssContent, initialState);
            this.initializeModule();
        } catch (error) {
            console.error('Error loading form content:', error);
        }
    }

    /**
     * Initializes the registration form-specific logic including adding/removing products, users, and validating input.
     * 
     * @returns {void}
     */
    initializeModule() {
        super.initializeModule()
        /**
         * Adds a new product to the product list.
         * 
         * @param {Event} event The event object.
         * @param {HTMLElement} element The element triggering the event.
         * @param {Object} context The context containing form data and actions.
         * @returns {void}
         */
        this.addProduct = (event, element, context) => {
            console.log('addProduct:', context);
            const id = `${this.name}-${Date.now()}`; // Increment count directly
            context[context.actionDetails].push({ id, name: `Item ${id}`, isVisible: true });
            this.setState(context.actionDetails, context[context.actionDetails]);
            this.setState('product_count', context[context.actionDetails].length);
        };

        /**
         * Adds a new user to the user list.
         * 
         * @param {Event} event The event object.
         * @param {HTMLElement} element The element triggering the event.
         * @param {Object} context The context containing form data and actions.
         * @returns {void}
         */
        this.addUser = (event, element, context) => {
            console.log('addUser:', context);
            const id = `${this.name}-${Date.now()}`; // Increment count directly
            context[context.actionDetails].push({ id, name: `Item ${id}`, isVisible: true });
            this.setState(context.actionDetails, context[context.actionDetails]);
            this.setState('user_count', context[context.actionDetails].length);
        };

        /**
         * Removes a product from the product list.
         * 
         * @param {Event} event The event object.
         * @param {HTMLElement} element The element triggering the event.
         * @param {Object} context The context containing form data and actions.
         * @returns {void}
         */
        this.removeProduct = (event, element, context) => {
            console.log('removeProduct:', context);
            const itemId = context.item.id || context.id;
            context[context.actionDetails] = context[context.actionDetails].filter(item => item.id !== itemId);
            this.setState(context.actionDetails, context[context.actionDetails]);
            this.setState('product_count', context[context.actionDetails].length);
            this.control.detachAllEvents(element);
        };

        /**
         * Removes a user from the user list.
         * 
         * @param {Event} event The event object.
         * @param {HTMLElement} element The element triggering the event.
         * @param {Object} context The context containing form data and actions.
         * @returns {void}
         */
        this.removeUser = (event, element, context) => {
            console.log('removeUser:', context);
            const itemId = context.item.id || context.id;
            context[context.actionDetails] = context[context.actionDetails].filter(item => item.id !== itemId);
            this.setState(context.actionDetails, context[context.actionDetails]);
            this.setState('user_count', context[context.actionDetails].length);
            this.control.detachAllEvents(element);
        };

        /**
         * Toggles password visibility between "password" and "text".
         * 
         * @param {Event} event The event object.
         * @param {HTMLElement} element The element triggering the event.
         * @param {Object} context The context containing form data and actions.
         * @returns {void}
         */
        this.togglePassword = (event, element, context) => {
            const passwordField = this.shadowRoot.querySelector('#password');
            const eyeIcon = this.shadowRoot.querySelector('#eyeIcon');
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                eyeIcon.textContent = '🙈'; // Change icon to closed eye
            } else {
                passwordField.type = 'password';
                eyeIcon.textContent = '👁️'; // Change icon to open eye
            }
        };

        // Sanitizer and Validator Functions
        /**
         * Sanitizes the email by trimming spaces and converting it to lowercase.
         * 
         * @param {string} value The email address.
         * @returns {string} The sanitized email address.
         */
        this.sanitizeEmail = (value) => {
            return value.trim().toLowerCase();
        };

        /**
         * Validates the email format.
         * 
         * @param {string} value The email address.
         * @returns {string|null} The valid email or null if invalid.
         */
        this.validateEmail = (value) => {
            value = this.sanitizeEmail(value);
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(value)) {
                this.setState('email_error', 'Invalid email format!')
                return null;
            }
            this.setState('email_error', '')
            return value; // Return sanitized and valid email
        };

        /**
         * Sanitizes the username by trimming spaces and removing invalid characters.
         * 
         * @param {string} value The username.
         * @returns {string} The sanitized username.
         */
        this.sanitizeUsername = (value) => {
            return value.trim().replace(/[^a-zA-Z0-9_]/g, '');
        };

        /**
         * Validates the username to ensure it meets length requirements.
         * 
         * @param {string} value The username.
         * @returns {string|null} The valid username or null if invalid.
         */
        this.validateUsername = (value) => {
            value = this.sanitizeUsername(value);
            if (value.length < 5) {
                this.setState('username_error', 'Username is too short! Minimum length is 5 characters.')
                return null;
            }
            this.setState('username_error', '')
            return value; // Return sanitized and valid username
        };

        /**
         * Validates the password to ensure it meets complexity requirements.
         * 
         * @param {string} value The password.
         * @returns {string|null} The valid password or null if invalid.
         */
        this.validatePassword = (value) => {
            if (value.length < 8) {
                this.setState('password_error', 'Password is too short! Minimum length is 8 characters.');
                return null;
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(value)) {
                this.setState('password_error', 'Password must contain uppercase, lowercase, a number, and a special character.')
                return null;
            }
            this.setState('password_error', '')
            return value;
        };

        this.toggleSubmitButton();

        this.control.on('registrationAttempt', () => {
            this.setState('email', '');
            this.setState('username', '');
            this.setState('password', '');
            console.log('Registration attempt successful');
        });
    }
}

customElements.define('registration-form', RegistrationForm);