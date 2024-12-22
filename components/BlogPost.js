import { Module } from '../module/Module.js';

/**
 * BlogPost class represents a custom web component for rendering a blog post.
 * It extends from the `Module` class and provides functionality for handling
 * blog post data (title, author, date, content), including sanitizing HTML
 * content and rendering dynamic data within the custom element.
 * 
 * @extends Module
 */
export class BlogPost extends Module {
    /**
     * Creates an instance of the BlogPost class.
     * 
     * @param {Object} [cfg={}] Configuration object.
     * @param {string} [cfg.name] Name for the module (optional, defaults to 'blog-post-<timestamp>').
     */
    constructor(cfg = {}) {
        const config = {
            name: `${cfg.name ?? 'blog-post'}`
        };
        super(config);
    }

    /**
     * Returns an array of attribute names that the blog post component observes for changes.
     * 
     * @static
     * @returns {string[]} List of observed attribute names ('data-title', 'data-author', 'data-date', 'data-content').
     */
    static get observedAttributes() {
        return ['data-title', 'data-author', 'data-date', 'data-content'];
    }

    /**
     * Callback method invoked when an observed attribute changes.
     * Updates the component's internal state based on the changed attributes.
     * 
     * @param {string} name Name of the changed attribute.
     * @param {string|null} oldValue Previous value of the attribute.
     * @param {string|null} newValue New value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-author' || name === 'data-date') {
            this.setState('author_date', `${this.dataset.author} - ${this.dataset.date}`);
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    /**
     * Lifecycle method called when the custom element is connected to the DOM.
     * Loads the HTML, CSS, and merges initial state with the default state.
     * 
     * @async
     * @param {string} [htmlUri=null] URL to the HTML template for the blog post.
     * @param {string} [cssUri=null] URL to the CSS file for styling the blog post.
     * @param {Object} [initialState={}] Initial state to be merged with default state.
     * @returns {Promise<void>} Resolves once the content is successfully loaded.
     * @throws {Error} If the blog post HTML or CSS fails to load.
     */
    async connectedCallback(htmlContent = null, cssContent = null, initialState = {}) {
        this.pullStyle = true;
        const defaultState = {
            title: '',
            author_date: `${this.dataset.author||''} - ${this.dataset.date||''}`,
            content: '',
        };
        const finalState = { ...defaultState, ...initialState };
        try {
            const defaultHtmlContent = __HTML__;
            const defaultCssContent = __CSS__;
            htmlContent = htmlContent || defaultHtmlContent;
            cssContent = cssContent || defaultCssContent;

            await super.connectedCallback(htmlContent, cssContent, finalState);
        } catch (error) {
            console.error("Error loading blog post content:", error);
        }
    }

    /**
     * Initializes the blog post module by defining control methods, rendering functions,
     * and setting the initial state.
     * 
     * @returns {void}
     */
    initializeModule() {
    }

    // Control Methods

    /**
     * Triggered when the "Read More" link is clicked.
     * Displays an alert for demo purposes.
     * 
     * @param {Event} event The event object.
     * @param {HTMLElement} element The target HTML element.
     */
    readMore(event, element) {
        alert('Read more clicked');
    };

    /**
     * Stops the propagation of the event to prevent further handling.
     * 
     * @param {Event} event The event object.
     * @param {HTMLElement} element The target HTML element.
     */
    stopEventPropagation(event, element) {
        event.stopPropagation();
    }

    /**
     * Renders sanitized HTML content into the specified element.
     * 
     * @param {string} value The raw HTML content to render.
     * @param {HTMLElement} element The target HTML element to render the content into.
     */
    renderHtml(value, element) {
        const sanitizedHtml = this.sanitizeHtml(value);
        element.innerHTML = sanitizedHtml;
    };

    /**
     * Sanitizes the provided HTML to remove dangerous content like scripts and iframes.
     * 
     * @param {string} html The raw HTML content to sanitize.
     * @returns {string} The sanitized HTML string.
     */
    sanitizeHtml(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');

        // Remove scripts and potentially harmful elements
        const scripts = doc.querySelectorAll('script');
        scripts.forEach(script => script.remove());

        // Optionally remove any other dangerous elements
        const dangerousElements = doc.querySelectorAll('iframe, object, embed');
        dangerousElements.forEach(el => el.remove());

        return doc.body.innerHTML;
    };
}

/**
 * Example usage:
 * const post = document.createElement('blog-post');
 * post.setAttribute('data-title', 'My Blog Post');
 * post.setAttribute('data-author', 'John Doe');
 * post.setAttribute('data-date', '2024-11-25');
 * post.setAttribute('data-content', '<p>This is my <strong>first</strong> post!</p>');
 * document.body.appendChild(post);
 */
customElements.define('blog-post', BlogPost);