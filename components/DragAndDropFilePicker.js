import { Module } from '../module/Module.js';

/**
 * The DragAndDropFilePicker class is a custom web component that allows users to drag and drop files
 * or use a file input to select files. It includes validation for file types and size limits,
 * and supports multiple file selections if specified.
 * 
 * @extends Module
 */
export class DragAndDropFilePicker extends Module {
    /**
     * Creates an instance of the DragAndDropFilePicker class.
     * 
     * @param {Object} [cfg={}] Configuration object.
     * @param {string} [cfg.name] Name for the module (optional, defaults to 'dnd-file-picker-<timestamp>').
     */
    constructor() {
        const config = {
            name: `dnd-file-picker`
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
        return ['data-allowed-types', 'data-max-size', 'data-multiple'];
    }

    /**
     * Lifecycle method called when the custom element is connected to the DOM.
     * Initializes the file picker by setting up allowed types, max size, and multiple file support.
     * It also loads the HTML and CSS templates, sets initial state, and updates the file input's accept attribute.
     * 
     * @async
     * @returns {Promise<void>} Resolves once the content is successfully loaded.
     * @throws {Error} If the file picker HTML or CSS fails to load.
     */
    async connectedCallback() {
        const initialState = { files: [] };
        try {
            const htmlContent = __HTML__;
            const cssContent = __CSS__;

            await super.connectedCallback(htmlContent, cssContent, initialState);
            this.initializeModule();
        } catch (error) {
            console.error('Error loading file picker content:', error);
        }
    }

    /**
     * Initializes the drag-and-drop file picker module, including file input triggers,
     * event handlers for drag and drop interactions, file validation, and rendering methods.
     * 
     * @returns {void}
     */
    initializeModule() {
        this.updateFileInputAccept();
    }

    /**
     * Triggers the file input when the file picker area is clicked.
     * 
     * @param {Event} event The click event object.
     * @param {HTMLElement} element The element that was clicked (file picker area).
     */
    triggerFileInput(event, element) {
        const fileInput = this.shadowRoot.querySelector('#fileInput');
        fileInput.click(); // Trigger the file input
    };

    /**
     * Handles drag over events to allow for file dropping by adding a 'dragover' class.
     * 
     * @param {Event} event The drag over event object.
     * @param {HTMLElement} element The element being dragged over.
     */
    handleDragOver(event, element) {
        event.preventDefault();
        element.classList.add('dragover');
    };

    /**
     * Handles drag leave events to remove the 'dragover' class when a dragged file leaves the area.
     * 
     * @param {Event} event The drag leave event object.
     * @param {HTMLElement} element The element the file left.
     */
    handleDragLeave(event, element) {
        element.classList.remove('dragover');
    };

    /**
     * Handles drop events to process dropped files and adds the 'dragover' class.
     * 
     * @param {Event} event The drop event object.
     * @param {HTMLElement} element The element where files were dropped.
     * @returns {FileList} The list of files dropped.
     */
    handleDrop(event, element) {
        event.preventDefault();
        element.classList.remove('dragover');
        const files = event.dataTransfer.files;
        return files;
    };

    /**
     * Processes the files selected through the file input and adds them to the state.
     * 
     * @param {Event} event The change event object.
     * @param {HTMLElement} element The file input element.
     * @returns {FileList} The list of selected files.
     */
    processFilesInput(event, element) {
        const files = event.target.files;
        return files;
    };

    /**
     * Processes the list of files by validating them (type and size) and adding them to the component's state.
     * 
     * @param {Event} event The event object.
     * @param {HTMLElement} element The element related to the files being processed.
     * @param {FileList} files The list of files to process.
     */
    processFiles(event, element, files) {
        const fileArray = Array.from(files);
        const validFiles = [];

        fileArray.forEach((file) => {
            const validationErrors = this.validateFile(file);
            if (validationErrors.length === 0) {
                const fileData = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    src: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
                };
                validFiles.push(fileData);
            }
        });

        if (!this.isMultiple) {
            this.state.setState('files', validFiles.slice(0, 1)); // Keep only the first file
        } else {
            const currentFiles = this.state.getState().files;
            this.state.setState('files', [...currentFiles, ...validFiles]);
        }
    };

    /**
     * Validates the file based on type and size.
     * 
     * @param {File} file The file to validate.
     * @returns {string[]} An array of validation error messages (empty if valid).
     */
    validateFile(file) {
        const errors = [];

        // Validate the file type more flexibly
        const allowedTypes = this.getState('allowedTypes');

        if (allowedTypes[0] !== '*' && !allowedTypes.includes(file.type)) {
            errors.push('Invalid file type');
        }

        // Validate file size
        if (file.size > this.maxSize) {
            errors.push(`File size exceeds limit (${file.size} bytes > ${this.maxSize} bytes)`);
        }

        return errors;
    };

    // View Methods

    /**
     * Renders the image or file name depending on the file type.
     * 
     * @param {Object} context The context containing the file data.
     * @param {HTMLElement} element The element to render the file content into.
     */
    renderImageOrFileNames(context, element) {
        const file = context.item;
        if (file.src) {
            const img = document.createElement('img');
            img.src = file.src;
            img.alt = file.name;
            element.appendChild(img);
        } else {
            element.textContent = file.name;
        }
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
     * Stops event propagation, preventing default behavior.
     * 
     * @param {Event} event The event to stop propagation.
     * @param {HTMLElement} element The element where the event occurred.
     */
    stopEventPropagation(event, element) {
        event.stopPropagation();
    };

    /**
     * Closes the full-screen image overlay.
     * 
     * @param {Event} event The click event object.
     * @param {HTMLElement} element The element triggering the close action.
     */
    closeOverlay(event, element) {
        const overlay = this.shadowRoot.querySelector('#imageOverlay');
        overlay.style.display = 'none';
    };
    /**
     * Updates the 'accept' attribute of the file input element based on the allowed file types.
     * 
     * @returns {void}
     */
    updateFileInputAccept() {
        const fileInput = this.shadowRoot.querySelector('#fileInput');
        const allowedTypes = this.getState('allowedTypes');
        console.log('updateFileInputAccept', allowedTypes)
        if (allowedTypes && allowedTypes !== '*') {
            // Set the 'accept' attribute based on data-allowed-types
            fileInput.setAttribute('accept', allowedTypes);
        } else {
            // If no types are specified, remove the 'accept' attribute to allow all
            fileInput.removeAttribute('accept');
        }
    };
}

customElements.define('drag-and-drop-file-picker', DragAndDropFilePicker);