import { BaseForm } from "./BaseForm.js";

/**
 * The LoginForm class is a custom web component that represents a login form. It extends from 
 * the `BaseForm` class and provides functionality for handling user login attempts, toggling 
 * password visibility, and validating form fields.
 * 
 * @extends BaseForm
 */
export class LoginForm extends BaseForm {
    /**
     * Creates an instance of the LoginForm class.
     * 
     * @param {Object} [config={}] Configuration object.
     * @param {string} [config.name] The name of the login form instance (optional, defaults to `loginForm-<timestamp>`).
     */
    constructor() {
        const config = {
            name: `loginForm`
        };
        super(config);
    }

    /**
     * Lifecycle method called when the custom element is connected to the DOM.
     * It initializes the form by loading the HTML and CSS templates, setting the initial state, 
     * and calling the necessary methods to bind the form's behavior and controls.
     * 
     * @async
     * @returns {Promise<void>} Resolves when the form content is successfully loaded.
     * @throws {Error} If there is an error loading the form's HTML or CSS templates.
     */
    async connectedCallback() {
        const initialState = {
            message: 'Welcome Back!',
            email: '',
            password: '',
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
     * Initializes the form-specific logic including form submission, password visibility toggle,
     * and event listeners for the login attempt.
     * 
     * @returns {void}
     */
    initializeModule() {
        /**
         * Handles the form submission by gathering the form data, performing basic validation,
         * and emitting a 'loginAttempt' event with the form data.
         * 
         * @async
         * @returns {Promise<void>}
         */
        this.submitForm = async () => {
            const formData = this.getFormData();  // Get form data (email, password)
            console.log('Login attempt with:', formData);
            
            // Basic validation for email and password
            if (formData.email && formData.password) {
                // Simulate login process (e.g., API call, validation, etc.)
                console.log('Logging in...');
                this.control.emit('loginAttempt', formData);  // Emit login attempt with form data
            } else {
                console.error('Missing email or password');
            }
        };

        /**
         * Toggles the password visibility between 'password' and 'text' types.
         * Also changes the icon between an open and closed eye.
         * 
         * @param {Event} event The click event object.
         * @param {HTMLElement} element The element (typically an icon) that was clicked.
         * @param {Object} context The context object for additional data (optional).
         */
        this.togglePassword = (event, element, context) => {
            const passwordField = this.shadowRoot.querySelector('#password');
            const eyeIcon = this.shadowRoot.querySelector('#eyeIcon');
            
            // Toggle the password field type
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                eyeIcon.textContent = '🙈';  // Closed eye icon
            } else {
                passwordField.type = 'password';
                eyeIcon.textContent = '👁️';  // Open eye icon
            }
        };

        /**
         * Event listener for the 'loginAttempt' event. Logs the data from the login attempt.
         * Additional logic (such as authentication) can be added here.
         * 
         * @param {Object} data The login form data (email and password).
         */
        this.control.on('loginAttempt', (data) => {
            console.log('Login attempt with data:', data);
            // Add your login handling logic here (e.g., API call)
        });

        this.toggleSubmitButton();  // Ensure the submit button state is correct
    }
}

customElements.define('login-form', LoginForm);