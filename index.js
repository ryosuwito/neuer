import { Module } from './module/Module.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { DragAndDropFilePicker } from './components/DragAndDropFilePicker.js';
import { RegistrationForm } from './components/RegistrationForm.js';
import { LoginForm } from './components/LoginForm.js';
import { TableForm } from './components/TableForm.js';
import { BlogPost } from './components/BlogPost.js';
import { SelectDropdown } from './components/SelectDropdown.js';
import { BlogPostWithImage } from './components/BlogPostWithImage.js';
import { moduleManager } from './module/ModuleManager.js';

window.moduleManager = moduleManager;
window.BlogPost = BlogPost;
window.BlogPostWithImage = BlogPostWithImage;
window.SelectDropdown = SelectDropdown;
window.Neuer = Module;