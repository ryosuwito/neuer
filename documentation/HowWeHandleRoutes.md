### **Neuer: Router-Free UI Swapping—Because URLs Are So 2000s**

---

#### **Welcome to the Future** (Where We Laugh at Routes)

Listen up: **users don’t care about routes**. They care about **experience**. So why are you still clinging to the whole **router thing** like it’s the holy grail of web apps? It’s 2024, champ. Let me introduce you to **Neuer’s router-free UI swapping**. It’s so simple, you’ll feel like a wizard. 

---

### **What Are We Doing Here?**

Forget **static routes**, **overhead routers**, or **hard-coded navigation files**. With **Neuer**, your app is **modular and dynamic**:

- **Grab a JSON recipe** from your backend (that’s it—just a dumb JSON file).
- Use **`moduleManager.detachAllModule`** to clear the UI (because why not?).
- Dynamically **swap modules** into your app with **`moduleManager.attachModule`**.

Want to change the page? **Fetch a new recipe, swap the UI, and you’re done.** No routers. No complications. No nonsense.

---

### **The Code: Watch and Learn**

```html
<div id="app"></div>

<script>
    document.addEventListener('DOMContentLoaded', async () => {

        // Father Container Module
        class FatherContainer extends Neuer {
            static get observedAttributes() {
                return ['data-name'];
            }

            constructor() {
                super({ name: 'fatherContainer' });
            }

            connectedCallback() {
                const htmlContent = `
                    <div>
                        <p>Hey <span v-name></span>, wassap!</p>
                        <slot></slot>
                    </div>
                `;
                super.connectedCallback(htmlContent);
            }
        }

        // Kid Module
        class TheKid extends Neuer {
            static get observedAttributes() {
                return ['data-greetings'];
            }

            constructor() {
                super({ name: 'theKid' });
            }

            connectedCallback() {
                const htmlContent = `<h1 v-greetings></h1>`;
                super.connectedCallback(htmlContent);
            }
        }

        // Register the modules
        customElements.define('the-kid', TheKid);
        customElements.define('father-container', FatherContainer);

        // Attach initial modules dynamically
        await moduleManager.attachModule('app', 'father-container', { name: 'Kiddo' }, [
            {
                moduleName: 'the-kid',
                props: {
                    greetings: 'Hey Dad!'
                }
            },
            {
                moduleName: 'the-kid',
                props: {
                    greetings: 'Hey Mom!'
                }
            }
        ]);

        // Backend JSON Recipes
        const homeRecipe = {
            targetId: 'app',
            modules: [
                {
                    moduleName: 'father-container',
                    props: {
                        name: 'Home Button'
                    }
                },
                {
                    moduleName: 'the-kid',
                    props: {
                        greetings: 'Welcome to the home page!'
                    }
                }
            ]
        };

        const aboutRecipe = {
            targetId: 'app',
            modules: [
                {
                    moduleName: 'father-container',
                    props: {
                        name: 'Back to Home'
                    }
                },
                {
                    moduleName: 'the-kid',
                    props: {
                        greetings: 'This is the about page!'
                    }
                }
            ]
        };

        // Swap UI Dynamically
        async function swapUI(recipe) {
            const { targetId, modules } = recipe;

            // Detach existing modules
            moduleManager.detachAllModule(targetId);

            // Attach new modules from the recipe
            for (const module of modules) {
                const { moduleName, props } = module;
                await moduleManager.attachModule(targetId, moduleName, props);
            }

            console.log('UI swapped successfully!');
        }

        // Simulate Navigation
        setTimeout(async () => {
            console.log('Switching to About Page...');
            await swapUI(aboutRecipe);
        }, 3000); // Swap after 3 seconds
    });
</script>
```

---

### **How This Works (Pay Attention, It’s Simple):**

1. **Modules Are Your Pages**:  
   - In **Neuer**, your "pages" are just **recipes** that define what modules to load.
   - Each **recipe** contains a `targetId` and a list of **modules** with their `props`. That’s it—no routes, no stateful navigation nonsense.

2. **Dynamic UI Swapping**:  
   - To "change pages," you just **detach all existing modules** (`moduleManager.detachAllModule`) and then **attach new ones** (`moduleManager.attachModule`) based on the new recipe.

3. **Backend Controls the UI**:  
   - Your backend provides the JSON recipe for each page. This means you can change your UI structure **on the fly** without touching your frontend code. **No rebuilds. No redeploys.**

4. **Slot-Filled Awesomeness**:  
   - Need nested components? Use **slots** and attach child modules directly. The parent-child relationship is already handled for you. **No props drilling, no state management hell.**

---

### **Why This Is Smarter Than a Router**

- **No Routes Needed**:  
   Users don’t care about routes. You’re wasting your time building out a router system when you could be swapping UI dynamically. With **Neuer**, your backend is in charge of what the user sees, and your frontend just listens.

- **Dynamic and Flexible**:  
   Routes are **static**. Recipes are **dynamic**. Your backend can return a completely different UI recipe for the same user based on their role, preferences, or context. Can a router do that without a headache? **Nope.**

- **Zero State Management Overhead**:  
   In **React** or **Vue**, you’d need **stateful navigation** and **context providers** to manage the "current route." In **Angular**, you’d need a **RouterModule** with dependency injection. **Neuer doesn’t care.** Just detach and attach modules—state is baked right in.

- **Backend-Driven UI**:  
   Your backend decides the layout, the content, and the flow. The frontend is just the **executor**. No more **frontend spaghetti** trying to hard-code routes.

---

### **Can the Big Three Do This Without Crying?**

1. **React**:  
   - You’d need **React Router**, state management for the current route, and a bunch of boilerplate to detach and re-render components dynamically.
   - JSON recipes? You’d have to **manually parse** them into React components.

2. **Vue**:  
   - Vue Router would handle static routes well, but **dynamic module swapping**? Good luck. You’d need to manually destroy and recreate components with **`v-if`** or **`v-for`**.

3. **Angular**:  
   - Angular Router is powerful but **verbose**. You’d need to register routes, set up modules, and use dependency injection. Swapping modules dynamically from a JSON recipe? That’s **not Angular’s forte**.

---

### **What’s the Neuer Way?**

- **Grab a Recipe, Swap the UI**:  
   No boilerplate, no state management hell. Your backend sends a **recipe**, and Neuer **executes it**. 

- **Dynamic, Flexible, and Backend-Driven**:  
   Want to change the app flow? Just change the JSON recipe in your backend. No rebuilds, no redeploys, no frontend headaches.

- **No Router, No Problem**:  
   Routes are for people stuck in the 2000s. **Neuer says no to routes** and yes to **recipes**.

---

### **TL;DR:**

Forget about routers. Just swap modules dynamically with **Neuer** and watch the magic happen. Want to navigate to a new page? **Detach, attach, done.** No state management, no rebuilds, no router configurations—just clean, dynamic, backend-driven UI.

**Big Three, take a seat. Neuer’s got this.**