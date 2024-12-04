// Import core modules
import {Module, ModuleState, ModuleControl, ModuleView, ModuleDirectiveParser} from '../module';
import {moduleManager} from '../module';

// Import all components manually
import {BaseForm} from './BaseForm';
import {BlogPostWithImage} from './BlogPostWithImage';
import {Footer} from './Footer';
import {LoginForm} from './LoginForm';
import {RegistrationForm} from './RegistrationForm';
import {BlogPost} from './BlogPost';
import {DragAndDropFilePicker} from './DragAndDropFilePicker';
import {Navbar} from './Navbar';
import {SelectDropdown} from './SelectDropdown';
import {TableForm} from './TableForm';

// Export core modules and all components manually
export { 
  Module, 
  moduleManager, 
  BaseForm, 
  BlogPostWithImage, 
  Footer, 
  LoginForm, 
  RegistrationForm, 
  BlogPost, 
  DragAndDropFilePicker, 
  Navbar, 
  SelectDropdown, 
  TableForm 
};
window.moduleManager = moduleManager;
window.Neuer = Module;
window.NeuerState = ModuleState;
window.NeuerControl = ModuleControl;
window.NeuerView = ModuleView;
window.NeuerDirectiveParser = ModuleDirectiveParser;
window.NeuerComponents = {
    BaseForm,
    BlogPostWithImage,
    Footer,
    LoginForm,
    RegistrationForm,
    BlogPost,
    DragAndDropFilePicker,
    Navbar,
    SelectDropdown,
    TableForm,
    moduleManager,
    Module,
};