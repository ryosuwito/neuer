/**
 * Resets the module's state to its initial configuration.
 * If keys are provided, only those keys are reset (partial reset).
 * If no keys are provided, the entire state is reset (total reset).
 * @param {Module} moduleInstance - The instance of the Module class.
 * @param {null|string|Array<string>|string} keys - The key(s) to reset or dot notation for nested keys.
 */
export const resetState = (moduleInstance, keys = null) => {
    if (!moduleInstance.props) {
        console.warn(`Module has no initial props to reset.`);
        return;
    }
    // Handle null (reset the entire state)
    if (keys === null) {
        keys = Object.keys(moduleInstance.props);
    }

    // If it's a string, wrap it in an array to handle it as a single key
    if (typeof keys === 'string') {
        keys = [keys];
    }

    // Handle dot notation for nested keys
    const resolveDotNotation = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const keysToReset = keys.filter(key => {
        // Handle dot notation
        if (key.includes('.')) {
            return resolveDotNotation(moduleInstance.props, key) !== undefined;
        }
        return key in moduleInstance.props;
    });

    if (keysToReset.length === 0) {
        console.warn(`Module '${moduleInstance.name}': No valid keys provided for reset.`);
        return;
    }

    keysToReset.forEach(key => {
        // If dot notation, we need to resolve and reset at the nested level
        if (key.includes('.')) {
            const keysArray = key.split('.');
            const lastKey = keysArray.pop();
            const obj = resolveDotNotation(moduleInstance.props, keysArray.join('.'));
            if (obj) obj[lastKey] = moduleInstance.props[key]; // Reset the value
        } else {
            moduleInstance.dataset[key] = moduleInstance.props[key];
        }
    });

    console.log(`Module '${moduleInstance.name}' state has been ${keys ? "partially" : "fully"} reset.`);
}
