import { Module } from '../module/Module.js';

export class SelectDropdown extends Module {
    constructor() {
        // Config with default name
        const config = { name: 'selectdropdown' };
        super(config);
    }

    /**
     * Observed attributes for the custom element.
     * The browser will call `attributeChangedCallback` when these change.
     * @returns {Array<string>} - The list of attributes to observe.
     */
    static get observedAttributes() {
        return ['data-options', 'data-multiple', 'data-clearable'];
    }

    /**
     * Callback method invoked when an observed attribute changes.
     * Updates the component's internal state based on the changed attributes.
     * 
     * @param {string} name Name of the changed attribute.
     * @param {string|null} oldValue Previous value of the attribute.
     * @param {string|null} newValue New value of the attribute.
     */
    async connectedCallback() {
        const initialState = {
            options : [],
            isMultiple : false,
            isClearable: false
        }
        try {
            const htmlContent = this.props?.customHtml || __HTML__;
            const cssContent = this.props?.customCss || __CSS__;

            await super.connectedCallback(htmlContent, cssContent, initialState);
            this.initializeModule()
            document.addEventListener('click', this.#handleClickOutside.bind(this))
        } catch (error) {
            console.error('Error initializing SelectDropdown:', error);
        }
    }

    /**
     * Called when observed attributes change.
     * Reacts to changes in `data-options`, `data-multiple`, and `data-clearable`.
     * @param {string} name - The name of the changed attribute.
     * @param {string|null} oldValue - The old value of the attribute.
     * @param {string|null} newValue - The new value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-options' && oldValue !== newValue) {
            try {
                const parsedValue = newValue ? JSON.parse(newValue) : [];
                this.setState('options', parsedValue);
            } catch (error) {
                console.error(`Failed to parse 'data-options': ${error.message}`);
                return;
            }
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    /**
     * Handle klik di luar elemen kustom
     * @param {MouseEvent} event - Event klik global.
     */
    #handleClickOutside(event) {
        const path = event.composedPath(); // Mendapatkan jalur elemen yang diklik
        if (!path.includes(this)) {
            this.closeDropdown(); // Panggil fungsi untuk menutup dropdown
        }
    }

    openDropdown() {
        const popup = this.shadowRoot.querySelector('#dropdown-popup');
        popup.style.display = 'block';
    }

    closeDropdown() {
        const popup = this.shadowRoot.querySelector('#dropdown-popup');
        popup.style.display = 'none';
    }

    selectResult(value, element, context) {
        if(element.classList.contains('selected')){
            element.classList.remove('selected')
        } else{
            element.classList.add('selected')
        }
    }

    renderOption(value, element, context){
        element.innerHTML=value.item
        element.setAttribute('value', value.item)
    }

    initializeModule() {
        const select = this.shadowRoot.querySelector('#selectbox');
        select.setAttribute('multiple', this.getState()?.isMultiple);
    }
    
    clearAll(event, element, context){
        const select = this.shadowRoot.querySelector('#selectbox');
        Array.from(select.options).forEach(element => {
            element.selected = false
        });
        const options = this.shadowRoot.querySelectorAll('.dropdown-item');
        Array.from(options).forEach(element => {
            element.classList.remove('selected')
        });
        return true
    }

    selectAll(event, element, context){
        const select = this.shadowRoot.querySelector('#selectbox');
        Array.from(select.options).forEach(element => {
            element.selected = true
        });
        const options = this.shadowRoot.querySelectorAll('.dropdown-item');
        Array.from(options).forEach(element => {
            element.classList.add('selected')
        });
        return true
    }
}

// Define the custom element
customElements.define('select-dropdown', SelectDropdown);
