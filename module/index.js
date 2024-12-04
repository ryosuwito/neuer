// Export everything from the modules
import { Module } from './Module.js';
import { moduleManager } from './ModuleManager.js';
import { ModuleState } from './ModuleState.js';
import { ModuleControl } from './ModuleControl.js';
import { ModuleView } from './ModuleView.js';
import { ModuleDirectiveParser } from './ModuleDirectiveParser.js';

export {
    Module,
    moduleManager,
    ModuleState,
    ModuleControl,
    ModuleView,
    ModuleDirectiveParser
}
window.moduleManager = moduleManager;
window.Neuer = Module;
window.NeuerState = ModuleState;
window.NeuerControl = ModuleControl;
window.NeuerView = ModuleView;
window.NeuerDirectiveParser = ModuleDirectiveParser;