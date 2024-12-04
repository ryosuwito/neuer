# **RECIPES (THIS IS HOW WE RUN THE SHOW)**  

---

### **WELCOME TO THE SECRET SAUCE OF NEUER: RECIPES**  

You want to build a UI? Cute. But let’s get one thing straight: **Neuer doesn’t care about your 50-step processes or build tool nightmares.** It doesn’t want your bloated configs, endless JSX files, or your six-hour debugging sessions trying to figure out why your props didn’t propagate.  

**Neuer wants one thing: your recipe.**  
That’s it. Write a simple JSON recipe, and Neuer handles the rest. Your modules fall into place, your data gets injected, and your app just works. No drama. No boilerplate. **It’s almost unfair how easy this is.**

---

### **WHAT IS A RECIPE? (A MASTERPIECE IN JSON FORM)**  

Recipes are **Neuer’s blueprint for greatness.** They tell Neuer:  
1. **Which modules** to load (because we all love options).  
2. **Where to put them** (no guesswork, no chaos).  
3. **What data to give them** (aka, make the modules do your bidding).  

If modules are the **LEGO bricks**, recipes are the **instruction manual—but cool, minimal, and way smarter.** Recipes are what let you stop writing static layouts and start **assembling dynamic UIs on the fly.**

Here’s what you don’t need with recipes:  
- Static HTML templates.  
- Endless "if" statements to determine layout.  
- Spaghetti JS to stitch it all together.  

**You give Neuer the recipe. Neuer does the rest.**

---

### **WHAT A RECIPE LOOKS LIKE (DON’T BLINK, YOU’LL MISS IT)**  

Here’s a recipe that defines a blog post page. Simple, elegant, and ridiculously effective:

```json
{
    "modules": [
        {
            "moduleName": "blog-post",
            "targetId": "blog-container",
            "props": {
                "title": "How Neuer Changed My Life",
                "content": "<p>Once I discovered Neuer, everything else felt obsolete.</p>",
                "image": "https://picsum.photos/300"
            }
        },
        {
            "moduleName": "sidebar",
            "targetId": "sidebar-container",
            "props": {
                "links": [
                    {"text": "Home", "url": "/"},
                    {"text": "About Neuer", "url": "/about"}
                ]
            }
        }
    ]
}
```

See? That’s your entire UI defined in JSON. No nested components. No lifecycle juggling. Just **modules, props, and brilliance.**

---

### **HOW TO WRITE A RECIPE (YOU’RE GONNA LOVE THIS)**  

1. **List Your Modules**  
   Start by listing the modules you want to include. Think of it as your app’s shopping list.  

2. **Define Targets**  
   Each module needs a `targetId`, which tells Neuer where to render it. No need to hardcode anything—just point it to the right container.  

3. **Pass Props**  
   Want your modules to do something useful? Pass them data through `props`. This is where the magic happens.

Here’s another simple recipe, because we know you’re already hooked:  

```json
{
    "modules": [
        {
            "moduleName": "hero-banner",
            "targetId": "hero-container",
            "props": {
                "title": "Welcome to Neuer",
                "subtitle": "The future of web dev starts here."
            }
        },
        {
            "moduleName": "feature-list",
            "targetId": "features-container",
            "props": {
                "features": [
                    "No boilerplate",
                    "Dynamic UIs",
                    "Zero rebuilds"
                ]
            }
        }
    ]
}
```

Plug it into **Neuer**, and boom—you’ve got a hero banner and a feature list **without writing a single line of static HTML.**

---

### **WHY PROPS ARE THE MVP OF YOUR RECIPES**  

Props are the **lifeblood** of your recipes. They’re what make your modules dynamic, flexible, and smarter than your average framework.  

- **Props customize your modules** without ever touching their code.  
- Want to change a title? Pass a new `title` prop.  
- Need to update content? Just tweak the `content` prop.  

Here’s an example of a fully loaded module with props:  

```json
{
    "moduleName": "blog-post",
    "targetId": "blog-container",
    "props": {
        "title": "10 Reasons Neuer Is Better Than Your Current Framework",
        "author": "The Neuer Team",
        "content": "<p>Reason #1: It’s Neuer.</p>",
        "image": "https://picsum.photos/400"
    }
}
```

Your module is now fully equipped to render whatever content you throw at it. And guess what? **No re-compiling, no drama.**

---

### **DYNAMIC RECIPES (BECAUSE STATIC UIs ARE BORING)**  

Static recipes are cool, but dynamic ones are where **Neuer truly shines.** Imagine fetching data from your backend and feeding it straight into your recipe—no middlemen, no headaches.  

Here’s how you do it:  

```javascript
async function loadRecipe() {
    const response = await fetch('/api/recipe');
    const recipe = await response.json();

    for (const module of recipe.modules) {
        await moduleManager.attachModule(module.targetId, module.moduleName, module.props);
    }
}
loadRecipe();
```

Your backend serves the recipe, your frontend consumes it, and **Neuer assembles your app in real-time.** It’s almost unfair how easy this is.

---

### **BACKEND MAGIC: SERVING RECIPES LIKE A PRO**  

Let’s make your backend the star of the show. Recipes are just JSON, so serve them up however you like. Here’s how it works in **Node.js/Express**:  

```javascript
app.get('/api/recipe', (req, res) => {
    res.json({
        modules: [
            {
                moduleName: "hero-banner",
                targetId: "hero-container",
                props: {
                    title: "Welcome to Neuer",
                    subtitle: "The last framework you'll ever need."
                }
            },
            {
                moduleName: "blog-post",
                targetId: "blog-container",
                props: {
                    title: "How Neuer Works",
                    content: "<p>It’s simpler than you think.</p>",
                    image: "https://picsum.photos/300"
                }
            }
        ]
    });
});
```

That’s it. Your backend dynamically assembles the recipe, and **Neuer brings it to life on the frontend.** This isn’t just frontend-backend harmony—it’s **a symphony.**

---

### **WHY RECIPES MAKE EVERY OTHER FRAMEWORK LOOK DUMB**  

Recipes aren’t just cool—they’re **game-changing.** While other frameworks are still debating the best way to pass props through nested components, **Neuer eliminates the problem entirely.**  

- **No rebuilds.** Just update your recipe, and Neuer takes care of the rest.  
- **No spaghetti JS.** Your UI structure is now data-driven.  
- **No headaches.** Recipes are so simple, your grandma could write one.  

---

### **FINAL WORD: RECIPES ARE HOW YOU WIN**  

With recipes, you stop coding and start **orchestrating.** You define your UI with data, and Neuer does all the heavy lifting.  

Other frameworks want you to believe building UIs has to be hard. **Neuer knows better.**  

Recipes are **modular, dynamic, and borderline magical.** Write them, tweak them, and watch your app evolve in real-time.  

Welcome to the **Neuer way**, where simplicity and brilliance reign supreme. Now go write some recipes and show the world what real innovation looks like.