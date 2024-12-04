import { Module } from './module/Module';
import { moduleManager } from './module/ModuleManager';
import { BaseForm } from './components/BaseForm';
import { Navbar } from './components/Navbar';
export { Module, moduleManager, BaseForm, Navbar };

window.NeuerComponents = {
    BaseForm,
    Navbar,
};
window.moduleManager = moduleManager;
window.Neuer = Module;