import { BaseForm } from "./BaseForm.js";

/**
 * The TableForm class is a custom web component that represents a table form for managing rows and columns with inline validation.
 * It supports adding/removing rows and columns, saving form data, and performing calculations like totals.
 * 
 * @extends BaseForm
 */
export class TableForm extends BaseForm {
    /**
     * Creates an instance of the TableForm class.
     * 
     * @param {Object} [config={}] Configuration object.
     * @param {string} [config.name] The name of the table form instance (optional, defaults to `tableForm-<timestamp>`).
     */
    constructor() {
        const config = {
            name: `tableForm-${Date.now()}`
        };
        super(config);
    }

    /**
     * Lifecycle method called when the custom element is connected to the DOM.
     * It initializes the table form by loading the HTML and CSS templates, setting the initial state,
     * and calling the necessary methods to bind the table's behavior and controls.
     * 
     * @async
     * @returns {Promise<void>} Resolves when the table form content is successfully loaded.
     * @throws {Error} If there is an error loading the form's HTML or CSS templates.
     */
    async connectedCallback() {
        const initialState = {
            rows: [{ id: 1, name: 1, isVisible: true }],
            columns: [{ name: 'Name' }, { name: 'Quantity' }, { name: 'Price' }, { name: 'Total' }, { name: 'Action' }]
        };
        try {
            const htmlContent = __HTML__;
            const cssContent = __CSS__;

            await super.connectedCallback(htmlContent, cssContent, initialState);
            super.initializeFromDOM();  // Initialize form's DOM elements
            super.initializeModule('tableForm');  // Initialize form-specific logic
            this.initializeModule();  // Initialize custom behaviors for table form
        } catch (error) {
            console.error('Error loading form content:', error);
        }
    }

    /**
     * Initializes the table form-specific logic including adding/removing rows, columns, validation, and saving data.
     * 
     * @returns {void}
     */
    initializeModule() {
        /**
         * Adds a new row to the table form.
         * 
         * @param {Event} event The event object.
         * @param {HTMLElement} element The element triggering the event.
         * @param {Object} context The context containing form data and actions.
         * @returns {void}
         */
        this.addRow = (event, element, context) => {
            const id = `${this.name}-${Date.now()}`;
            context[context.actionDetails].push({ id, name: `${id}`, isVisible: true });
            this.state.setState(context.actionDetails, context[context.actionDetails]);
        };

        /**
         * Adds a new column to the table form.
         * Prompts for the column name and appends a new input field in the table header and each row.
         * 
         * @param {Event} event The event object.
         * @param {HTMLElement} element The element triggering the event.
         * @param {Object} context The context containing form data and actions.
         * @returns {void}
         */
        this.addColumn = (event, element, context) => {
            console.log(this.shadowRoot.getElementById('templateRow'));
            const template = this.shadowRoot.getElementById('templateRow');
            
            if (!template) return;
            
            // Get the template's content and the <tr> element
            const rowContent = template.content.querySelector('tr');
            
            // Create the new <td> with an input field
            const newTd = document.createElement('td');
            const newInput = document.createElement('input');
            const columnName = prompt("Column Name");
            if(!columnName) return;
            newInput.setAttribute('type', 'text');
            newInput.setAttribute('placeholder', 'Enter New Field');
            
            // Append the new input to the <td>
            newTd.appendChild(newInput);
            
            // Insert the new <td> before the "Total" and "Action" columns
            // Assuming the "Total" column is the second-to-last and the "Action" is the last
            const totalColumnIndex = rowContent.children.length - 2; // The second-to-last column
            rowContent.insertBefore(newTd, rowContent.children[totalColumnIndex]);
            
            // Optionally, log the modified template content
            console.log(template.content);
            
            // Assuming you want to update some state or context with the new column
            const id = `${this.name}-${Date.now()}`;
            const newItem = { id, name: columnName, isVisible: true };
            context[context.actionDetails].splice(totalColumnIndex, 0, newItem);
        
            // Sync column state
            this.state.setState(context.actionDetails, context[context.actionDetails]);
            // Sync the rows state
            this.state.setState('rows', context.rows);
        };

        /**
         * Saves the current form data.
         * 
         * @returns {void}
         */
        this.saveData = () => {
            const formData = this.getFormData();
            console.log('Form data to save:', formData);
        };

        /**
         * Deletes a row from the table form.
         * 
         * @param {Event} event The event object.
         * @param {HTMLElement} element The element triggering the event.
         * @param {Object} context The context containing form data and actions.
         * @returns {void}
         */
        this.deleteRow = (event, element, context) => {
            const itemId = context.item.id || context.id;
            context[context.actionDetails] = context[context.actionDetails].filter(item => item.id !== itemId);
            this.state.setState(context.actionDetails, context[context.actionDetails]);
            this.control.detachAllEvents(element);
        };

        /**
         * Validates the name input field.
         * 
         * @param {string} value The name input value.
         * @returns {boolean} Returns true if the name is valid, otherwise false.
         */
        this.validateName = (value) => {
            return value && value.length > 0;
        };

        /**
         * Validates the quantity input field.
         * 
         * @param {string} value The quantity input value.
         * @returns {boolean} Returns true if the quantity is a number and greater than 0.
         */
        this.validateQuantity = (value) => {
            return !isNaN(value) && value > 0;
        };

        /**
         * Validates the price input field.
         * 
         * @param {string} value The price input value.
         * @returns {boolean} Returns true if the price is a number and greater than 0.
         */
        this.validatePrice = (value) => {
            return !isNaN(value) && value > 0;
        };
    }

    /**
     * Calculates and updates the total price based on quantity and price.
     * 
     * @param {HTMLElement} input The input element triggering the total calculation.
     * @returns {void}
     */
    calculateTotal(input) {
        const row = input.closest("tr");
        const quantity = row.querySelector('input[s-quantity]').value;
        const price = row.querySelector('input[s-price]').value;
        const total = row.querySelector('.total');

        total.textContent = (quantity * price).toFixed(2);
    }
}

customElements.define('table-form', TableForm);