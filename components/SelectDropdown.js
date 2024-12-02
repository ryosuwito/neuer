import { Module } from '../module/Module.js';

export class SelectDropdown extends Module {
    constructor() {
        // Config with default name
        const config = { name: 'selectdropdown-' + Date.now() };
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
    
    async connectedCallback() {
        const initialState = {
            options : [],
            isMultiple : false,
            isClearable: false
        }
        try {
            const htmlContent = __HTML__;
            const cssContent = __CSS__;

            await super.connectedCallback(htmlContent, cssContent, initialState);
            super.initializeFromDOM();
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
        switch (name) {
            case 'data-options':
                this.setState('options', newValue ? JSON.parse(newValue) : []);
                break;
            case 'data-multiple':
                this.setState('isMultiple', newValue)
                break;
            case 'data-clearable':
                this.setState('isClearable', newValue)
                break;
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
        this.setState('options',  this.getAttribute('data-options') ? JSON.parse(this.getAttribute('data-options')) : []);
        this.setState('isMultiple', this.getAttribute('data-multiple'));
        this.setState('isClearable', this.getAttribute('data-clearable'));
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
