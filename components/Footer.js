import { Module } from '../module/Module.js';

/**
 * Footer class represents the footer section of the webpage.
 * It extends the `Module` class and is responsible for handling footer-specific logic,
 * including managing navigation actions and rendering content such as the brand name.
 *
 * @extends Module
 */
export class Footer extends Module {
    /**
     * Creates an instance of the Footer module with a unique name based on the current timestamp.
     * 
     * @constructor
     */
    constructor() {
        const config = {
            name: `footer`
        };
        super(config);
    }

    /**
     * Lifecycle method invoked when the element is connected to the DOM.
     * It loads the initial HTML, CSS, and state for the footer, and then initializes the module.
     * 
     * @async
     * @returns {Promise<void>} Resolves when the footer module has been successfully initialized.
     * @throws {Error} If the HTML or CSS cannot be loaded.
     */
    async connectedCallback() {
        const initialState = {
            brand: "© 2024 MyWebsite",
        };
        try {
            const htmlContent = __HTML__;
            const cssContent = __CSS__;

            await super.connectedCallback(htmlContent, cssContent, initialState);
            this.initializeModule();
        } catch (error) {
            console.error("Error loading footer content:", error);
        }
    }

    /**
     * Initializes the module's internal logic for rendering and navigation.
     * This includes the navigation functions for different sections (e.g., Privacy, Terms, Contact)
     * and the renderer for updating the brand text.
     * 
     * @returns {void}
     */
    initializeModule() {
        // Control: Navigation logic for links
        this.navigatePrivacy = () => this.emitNavigation("privacy");
        this.navigateTerms = () => this.emitNavigation("terms");
        this.navigateContact = () => this.emitNavigation("contact");

        // Control: Navigation logic for social media links
        this.navigateFacebook = () => this.emitNavigation("facebook");
        this.navigateTwitter = () => this.emitNavigation("twitter");
        this.navigateInstagram = () => this.emitNavigation("instagram");

        // Renderer: Update brand text
        this.renderTextContent = (value, element) => {
            element.textContent = value;
        };
    }

    /**
     * Emits a navigation event for the specified destination.
     * 
     * @param {string} destination - The name of the destination to navigate to (e.g., "privacy", "terms").
     * @returns {void}
     */
    emitNavigation(destination) {
        console.log(`Navigating to: ${destination}`);
        this._module.control.emit("navigate", destination);
    }
}

/**
 * Defines the custom element for the footer.
 * 
 * @example
 * // Usage:
 * const footer = document.createElement('my-footer');
 * document.body.appendChild(footer);
 */
customElements.define("my-footer", Footer);