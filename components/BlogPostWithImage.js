import { BlogPost } from './BlogPost.js';

/**
 * BlogPostWithImage class extends the BlogPost class to include an image in the blog post.
 * It provides additional functionality for rendering the image and showing a full-screen
 * overlay when the image is clicked.
 * 
 * @extends BlogPost
 */
export class BlogPostWithImage extends BlogPost {
    /**
     * Creates an instance of the BlogPostWithImage class.
     * 
     * @param {Object} [cfg={}] Configuration object.
     * @param {string} [cfg.name] Name for the module (optional, defaults to 'blog-post-with-image-<timestamp>').
     */
    constructor() {
        const config = {
            name: `blog-post-with-image-${Date.now()}`
        };
        super(config);
    }

    /**
     * Returns an array of attribute names that the blog post component observes for changes,
     * including the inherited attributes and the new 'data-image' attribute for the image.
     * 
     * @static
     * @returns {string[]} List of observed attribute names ('data-title', 'data-author', 'data-date', 'data-content', 'data-image').
     */
    static get observedAttributes() {
        return [...super.observedAttributes, 'data-image'];
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
        if (name === 'data-image') {
            this.image = newValue;
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    /**
     * Lifecycle method called when the custom element is connected to the DOM.
     * Loads the HTML, CSS, and merges initial state with the default state, including the image.
     * 
     * @async
     * @param {string} [htmlUri=null] URL to the HTML template for the blog post with image.
     * @param {string} [cssUri=null] URL to the CSS file for styling the blog post with image.
     * @param {Object} [initialState={}] Initial state to be merged with default state.
     * @returns {Promise<void>} Resolves once the content is successfully loaded.
     * @throws {Error} If the blog post HTML or CSS fails to load.
     */
    async connectedCallback() {
        const initialState = {
            image: '',
        };
        try {
            const htmlContent = __HTML__;
            const cssContent = __CSS__;

            await super.connectedCallback(htmlContent, cssContent, initialState);
            super.initializeFromDOM();  // Initialize the module's DOM elements
            super.initializeModule();  // Set up module-specific behavior
            this.initializeModule();  // Set up additional functionality for BlogPostWithImage
        } catch (error) {
            console.error("Error loading blog post with image content:", error);
        }
    }

    /**
     * Initializes the blog post with image module, including methods for rendering the image,
     * opening the overlay, and closing the overlay.
     * 
     * @returns {void}
     */
    initializeModule() {
        // Dynamically set the blog post content including the image
        this.state.setState('title', this.getAttribute('data-title'));
        this.state.setState('author_date', `${this.getAttribute('data-author')} - ${this.getAttribute('data-date')}`);
        this.state.setState('content', this.getAttribute('data-content'));
        this.state.setState('image', this.getAttribute('data-image'));
    }

    /**
     * Renders the image by setting the source of the image element.
     * 
     * @param {string} value The image URL to render.
     * @param {HTMLImageElement} element The image element where the source will be set.
     */
    renderImage(value, element) {
        element.src = value;
    };

    /**
     * Opens a full-screen overlay displaying the clicked image.
     * 
     * @param {Event} event The click event object.
     * @param {HTMLElement} element The image element that was clicked.
     */
    openOverlay(event, element) {
        const imageSrc = event.target.src;
        const overlay = this.shadowRoot.querySelector('#imageOverlay');
        const overlayImage = this.shadowRoot.querySelector('#overlayImage');
        overlayImage.src = imageSrc;
        overlay.style.display = 'flex';
    };

    /**
     * Closes the full-screen overlay displaying the image.
     * 
     * @param {Event} event The click event object.
     * @param {HTMLElement} element The element that triggered the event.
     */
    closeOverlay(event, element) {
        const overlay = this.shadowRoot.querySelector('#imageOverlay');
        overlay.style.display = 'none';
    };
}

/**
 * Example usage:
 * const postWithImage = document.createElement('blog-post-with-image');
 * postWithImage.setAttribute('data-title', 'Blog Post with Image');
 * postWithImage.setAttribute('data-author', 'Jane Doe');
 * postWithImage.setAttribute('data-date', '2024-11-25');
 * postWithImage.setAttribute('data-content', '<p>This post contains an image.</p>');
 * postWithImage.setAttribute('data-image', 'https://example.com/image.jpg');
 * document.body.appendChild(postWithImage);
 */
customElements.define('blog-post-with-image', BlogPostWithImage);