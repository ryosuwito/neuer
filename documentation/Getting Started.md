# **GETTING STARTED: NEXT STEP, LEGEND**

---

#### **WELCOME TO NEUER: WHERE YOUR WEB DEV SINS ARE FORGIVEN**

So, you’ve finally decided to step out of the stone age and give **Neuer** a shot. Good. Welcome to the framework that’s going to **save you from yourself**. This isn’t some half-baked, over-engineered Frankenstein you’re used to. Neuer is **simple, powerful, and probably smarter than you.**

Let’s get you started. Don’t worry if you’ve been brainwashed by React, Vue, or Angular. Neuer is so intuitive, your cat could ship a scalable SaaS app before you finish reading this doc.

---

### **STEP 1: INSTALL NEUER (EVEN YOU CAN’T MESS THIS UP)**  

Every framework starts with installation. But with Neuer, it’s not a chore. It’s a declaration.  

#### **Option A: Be a Cool Kid with npm**  
```bash
npm install neuer
```

#### **Option B: Keep It Simple, Genius**  
Don’t need npm? No problem. Just drop this in your HTML like it’s 2012 and you’re **living your best life.**  
```html
<script type="module" src="./dist/neuer.es.js"></script>
```

Neuer doesn’t judge your workflow. It just makes it better.  

---

### **STEP 2: SET UP YOUR ENVIRONMENT (NO BUILD TOOLS, NO CRYING)**  

Unlike those other frameworks that demand a doctorate in config files, Neuer requires nothing but a browser, an HTML file, and **a will to build greatness.**

Here’s your boilerplate. Spoiler: it’s not a mess.  

```html
<!DOCTYPE html>
<html>
<head>
    <script type="module" src="./dist/neuer.es.js"></script>
</head>
<body>
    <div id="app"></div>
    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            await moduleManager.attachModule('app', 'blog-post-with-image', {
                title: 'Welcome to Neuer',
                content: '<p>This is the future of web dev.</p>',
                image: 'https://picsum.photos/200',
            });
        });
    </script>
</body>
</html>
```

**No Webpack. No Babel. No BS.** Just copy, paste, and you’re live.  

---

### **STEP 3: MODULES: THE BUILDING BLOCKS OF AWESOMENESS**  

In Neuer, **everything is a module.** Buttons? Modules. Headers? Modules. The overly-complicated feature your product manager just dreamed up? Still a module.  

Here’s how you create one in seconds (not hours):  

```javascript
class CustomButton extends Module {
    connectedCallback() {
        this.innerHTML = `<button>${this.props.label}</button>`;
    }
}
customElements.define('custom-button', CustomButton);
```

Now, attach it to any container like the coding rockstar you are:  

```javascript
await moduleManager.attachModule('app', 'custom-button', { label: 'Click Me' });
```

Congratulations, you just wrote a fully functioning button. Meanwhile, React developers are still debating whether to use `useEffect` or `useRef`.

---

### **STEP 4: RECIPES: WHY WRITE CODE WHEN YOU CAN JUST COMMAND IT?**  

Recipes are what make Neuer truly **next level.** They’re JSON blueprints that tell Neuer how to assemble your app. You write the instructions, Neuer builds the magic.  

Here’s an example recipe for a blog page:  

```json
{
    "modules": [
        {
            "moduleName": "blog-post-with-image",
            "targetId": "blog-container",
            "props": {
                "title": "My First Post",
                "content": "<p>Look how easy this is.</p>",
                "image": "https://picsum.photos/300"
            }
        }
    ]
}
```

Serve this recipe from your backend, and Neuer handles everything else. **Your app builds itself while you sip coffee and bask in your brilliance.**

---

### **STEP 5: OVERRIDES: BECAUSE RULES ARE FOR SUCKERS**  

Other frameworks make you work within their limits. Neuer invites you to **break everything and make it your own.**  

#### **Instance-Level Overrides**  
Want to tweak just one module? Go ahead. Neuer loves rebels.  

```javascript
await moduleManager.attachModule('app', 'blog-post-with-image', {
    title: 'Custom Title',
    content: '<p>Special snowflake content here.</p>',
    renderTextContent: (value, element) => {
        element.textContent = `Custom Override: ${value}`;
    },
});
```

#### **Global Overrides**  
Feel like rewriting the rules for everyone? Neuer says: **Do it.**  

```javascript
moduleManager.registerRenderer('renderTextContent', (value, element) => {
    element.textContent = `Global Override: ${value}`;
});
```

React wishes it could.

---

### **STEP 6: PROFIT (OR JUST FLEX HARD)**  

You’ve done it. Your first Neuer app is live. It’s clean. It’s fast. It’s better than anything your team has ever seen. Now it’s time to:
1. Post it on Twitter and let the likes roll in.  
2. Send it to your boss and demand a raise.  
3. Look at your old projects and laugh.  

---

#### **FAQ FOR THE INITIATED (AKA YOU, NOW)**  

- **What happens if I break something?**  
  You won’t. But if you do, remember: **Neuer doesn’t break. You do.**  

- **What backend works best with Neuer?**  
  Anything that outputs JSON. Seriously, we don’t care if it’s PHP or an API you wrote in a fever dream.  

- **Can I mix Neuer with React/Vue/Angular?**  
  Sure, but you’ll eventually wonder why you bothered. Neuer is the main course. They’re just side dishes.  

---

### **FINAL THOUGHT: YOU’RE WELCOME.**

By now, you’ve had your first taste of **Neuer’s genius**. It’s fast, flexible, and ridiculously simple. And let’s face it: **you’re never going back to the old ways.**  

Neuer doesn’t just improve your workflow. It redefines it. Welcome to the future, champ.