import { Module } from '../module/Module.js';

/**
 * The Navbar class is a custom web component that represents a navigation bar. It provides functionality
 * for toggling the navigation menu on small screens, handling navigation events, and dynamically updating
 * the brand name.
 * 
 * @extends Module
 */
export class Navbar extends Module {
    /**
     * Creates an instance of the Navbar class.
     * 
     * @param {Object} [config={}] Configuration object.
     * @param {string} [config.name] The name of the navbar instance (optional, defaults to `navbar-<timestamp>`).
     */
    constructor() {
        const config = {
            name: `navbar`
        };
        super(config);
    }

    /**
     * Lifecycle method called when the custom element is connected to the DOM. 
     * It initializes the navigation bar by loading the HTML and CSS templates, setting the initial state, 
     * and calling the necessary methods to bind the navbar's behavior and controls.
     * 
     * @async
     * @returns {Promise<void>} Resolves when the navbar content is successfully loaded.
     * @throws {Error} If there is an error loading the navbar's HTML or CSS templates.
     */
    async connectedCallback() {
        const initialState = {
            brand: "MyBrand",
            isMenuOpen: false,
        };
        try {
            const htmlContent = __HTML__;
            const cssContent = __CSS__;

            await super.connectedCallback(htmlContent, cssContent, initialState);
            this.initializeModule();
        } catch (error) {
            console.error("Error loading navbar content:", error);
        }
    }

    /**
     * Initializes the navbar-specific logic including navigation actions, toggling the menu, and rendering the brand name.
     * 
     * @returns {void}
     */
    initializeModule() {
        /**
         * Handles navigation to the "home" route.
         */
        this.navigateHome = () => this.emitNavigation("home");

        /**
         * Handles navigation to the "about" route.
         */
        this.navigateAbout = () => this.emitNavigation("about");

        /**
         * Handles navigation to the "services" route.
         */
        this.navigateServices = () => this.emitNavigation("services");

        /**
         * Handles navigation to the "contact" route.
         */
        this.navigateContact = () => this.emitNavigation("contact");

        /**
         * Toggles the navigation menu on smaller screens by changing the display style.
         * 
         * @returns {void}
         */
        this.toggleMenu = () => {
            const menu = this.shadowRoot.querySelector("#menu");
            const state = this._module.state;

            // Toggle the menu open/close state
            state.isMenuOpen = !state.isMenuOpen;
            menu.style.display = state.isMenuOpen ? "block" : "none";
        };

        /**
         * Renderer function for updating the brand name text.
         * 
         * @param {string} value The brand name to display.
         * @param {HTMLElement} element The element where the brand name will be set.
         * @returns {void}
         */
        this.renderTextContent = (value, element) => {
            element.textContent = value;
        };
    }

    /**
     * Emits a "navigate" event with the specified route. Used for handling navigation in the navbar.
     * 
     * @param {string} route The route to navigate to (e.g., 'home', 'about', 'services', 'contact').
     * @returns {void}
     */
    emitNavigation(route) {
        console.log(`Navigating to: ${route}`);
        this._module.control.emit("navigate", route);
    }
}

customElements.define("custom-navbar", Navbar);