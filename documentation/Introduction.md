# **NEUER DOCUMENTATION**  
#### **The Framework That Assembles the Web (And Honestly, Everything Else You’ve Messed Up)**  

---

Welcome to **Neuer’s Overriding Superpowers**. With Neuer, you’re not just **using** components—you’re **bending them to your will**. In the code below, we show you how to override the default behavior of a module, change its rendering logic, and keep everything clean and simple. Can the big three do this without breaking a sweat? Nah. Neuer does it **effortlessly**.

Let’s break down how you can take control of your modules, customize them, and **override anything** like a true web dev champ.

---

### **The Code: Overriding Made Simple**

Here’s the code that shows how to **override** module behavior at runtime:

```html
<custom-button data-label="Hi mom!"></custom-button>
<div id="app"></div>

<script>
    document.addEventListener('DOMContentLoaded', async () => {
        // Create a custom button class extending Neuer
        class CustomButton extends Neuer {
            static get observedAttributes() {
                return ['data-label'];
            }

            constructor() {
                super({ name: 'customButton' });
            }

            // Setup the module content and inject HTML
            connectedCallback() {
                const htmlContent = `<button v-label='renderTextContent'></button>`;
                super.connectedCallback(htmlContent);
            }
        }

        // Register the custom button element
        customElements.define('custom-button', CustomButton);

        // Dynamically attach the first instance of the custom button
        const dynamicButton = await moduleManager.attachModule('app', 'custom-button', { label: 'Click Me' });

        // Change the state of the dynamic button from outside
        dynamicButton.setState('label', 'Can you big three do this shit?');

        // Create another button instance with a custom renderer
        const overridenButton = await moduleManager.attachModule('app', 'custom-button', { label: 'Click Me' });

        // Override the default rendering function of the button
        overridenButton.renderTextContent = (value, element) => {
            console.log('We are overriding anything like a champ!');
            element.textContent = 'NeuerRocks : ' + value;
        };

        // Change the state again, triggering the overridden rendering logic
        overridenButton.setState('label', 'Yes it is!');
    });
</script>
```

---

### **How This Works:**

1. **Create and Register the Custom Module**:  
   First, we create a new custom element, `CustomButton`, which extends `Neuer`. We define the attribute `data-label` that will control the button's label.

2. **Attach the Module Dynamically**:  
   We use `moduleManager.attachModule()` to dynamically attach the `custom-button` to the page, placing it inside the `#app` container. The button’s initial label is set to `"Click Me"`. This is the **declarative** side of Neuer.

3. **State Change with `setState`**:  
   Once the button is attached, we can change its state dynamically with `dynamicButton.setState()`. In this case, we change the `label` state to `"Can you big three do this shit?"`, and Neuer **automatically updates** the UI without a rebuild.

4. **Overriding the Module's Renderer**:  
   Here comes the fun part: we **override the module’s behavior**. After attaching another instance of `custom-button`, we override the default `renderTextContent` function.

   - The `renderTextContent` function controls how the label text is rendered inside the button.  
   - By assigning a custom function to `renderTextContent`, we change how the label is **displayed** when the button’s state is updated.
   - Our new `renderTextContent` function appends `"NeuerRocks : "` to the button’s label and logs a message to the console.

5. **Triggering the Override**:  
   After overriding the button's renderer, we **set the state** again with `overridenButton.setState('label', 'Yes it is!')`. This triggers the **overridden renderer**, which outputs `"NeuerRocks : Yes it is!"` inside the button.

---

### **Why This Is Impossible (for the Big Three)**

Let’s be real—**React**, **Vue**, and **Angular** are powerful, but can they do this without massive boilerplate or reconfiguring the entire component lifecycle? Not a chance. Here's why:

1. **Dynamically Attaching and Updating Modules**:  
   - In **React** and **Vue**, dynamically attaching components from outside is not **as simple** as `moduleManager.attachModule()`. You’d need **component lifecycle hooks**, state management, and re-renders—tons of **manual control**.
   - In **Angular**, you’d need to manually trigger **component change detection** and update the view, not to mention dealing with **input bindings** and **lifecycle hooks**.

2. **Overriding Module Logic at Runtime**:  
   - **React** requires using **hooks** and **higher-order components (HOCs)** to modify behavior, but this is **static** at the component level and requires more setup.
   - **Vue** allows some flexibility with custom renderers, but it’s still reliant on **template structures** and **two-way data binding**. Overriding methods in Vue requires a lot of **manual changes** to the component, and you can’t easily inject new behavior dynamically like Neuer does.
   - **Angular** would require complex **decorators**, **services**, and **change detection** strategies to achieve a similar outcome. Changing logic at runtime requires deep integration with Angular's **dependency injection** system, **ngOnChanges**, or **ngModel**.

3. **No Rebuilds or Complex Configuration**:  
   - **Neuer** does everything in a **live, dynamic** fashion—**no rebuilds**, **no complex setup**. Just modify the **state** or **renderer** and watch the magic happen.
   - The **Big Three** require you to manage **state** and **props** at multiple levels, **rebuild** components when something changes, and often deal with **lifecycle intricacies** to get this dynamic behavior working.

---
## **YOU’RE HERE BECAUSE YOU’VE FINALLY HAD ENOUGH**

Let’s not pretend. If everything was sunshine and rainbows in your frontend stack, you wouldn’t be here. You’d still be fighting React's 47 different "best practices," Vue's endless prop chains, or Angular’s bureaucratic nonsense. Instead, you stumbled into Neuer—**the framework you didn’t know you needed but now can’t unsee**.  

**Neuer isn’t just another framework. Neuer is an intervention.**  

You’ve been trapped in a hamster wheel of boilerplate, lifecycle shenanigans, and the constant dread of a single typo breaking your app. That ends now. Neuer doesn’t just fix your code; it fixes your entire approach to development.  

Don’t feel bad. You didn’t know better. But now you do. So buckle up, because we’re about to drag you (and your app) into the future.

---

## **WHY YOU’LL NEVER LOOK BACK**  

You’ve been promised the moon by other frameworks and handed a bag of rocks instead. Neuer is the first framework that actually **delivers.**  

- No bloated libraries.  
- No cryptic lifecycle BS.  
- Just fast, efficient, scalable apps that make you look like the genius you’ve always claimed to be.  

---

## **FINAL WORD: THE LAST FRAMEWORK YOU’LL EVER NEED**

Here’s the truth: you’ve wasted enough time wrestling with frameworks that promised simplicity but delivered complexity. Neuer is here to put an end to the madness.  

It’s lean. It’s dynamic. It’s modular. And it’s here to **reshape the web**—one glorious app at a time.  

**Join the revolution, or get left behind. Neuer doesn’t wait for anyone.**  
