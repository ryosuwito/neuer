# Neuer – The Framework That Assembles the Web

### **THE FUTURE DOESN’T ASK FOR PERMISSION, BRO. IT JUST HAPPENS.**

Alright, here it is—**Neuer** is the thing you didn’t know you were **waiting** for, because frankly, you’ve been **lied to** for far too long. If you’re still pretending like React, Vue, or Angular are "cutting-edge," you’re living in a fantasy land. You’ve been sold the **illusion** that these bloated, ancient, excuse-for-frameworks are somehow “best practice.” **They're not**. They're an anchor, dragging you down into the abyss of complexity. Wake up. **Neuer** is your lifeline.

---

### **ARE YOU READY TO WAKE UP, OR DO YOU WANT TO KEEP CRAWLING IN THE DARK?**

Let’s be real: if you’re still on the **JSX struggle bus**, still choking on props like they're some sort of developer vitamin, then congratulations, you're part of the problem. How long are you gonna keep **pretending** like you're okay with frameworks that make you do cartwheels just to change a button’s color? Time’s up. It’s over. Neuer is **here**, and it's coming for your sad, bloated code.

You want a blog post? **You got it**. Clean. Fast. **Beautiful**. No, seriously, you’re gonna love how stupidly simple this is:

```html
<article class="blog-post">
    <div class="img-container">
        <img id="postImage" src="" alt="Blog Post Image" c-click="openOverlay" v-image="renderImage" />
    </div>
    <header>
        <h1 id="postTitle" v-title="renderTextContent"></h1>
        <p class="meta" v-author_date="renderTextContent"></p>
    </header>
    <section class="content">
        <p v-content="renderHtml"></p>
    </section>
    <footer>
        <div class="cta">
            <button c-click="readMore">Read More</button>
        </div>
    </footer>
    <!-- Full-screen Image Overlay -->
    <div id="imageOverlay" class="overlay" style="display: none;" c-click="closeOverlay">
        <div class="overlay-content" c-click="stopEventPropagation">
            <img id="overlayImage" src="" alt="Full-screen Image">
        </div>
    </div>
</article>
```

Yes, **that’s it**. It’s that simple. No fifty-billion hooks. No magic incantations. No need for 18 "use" functions to get this to work. Just **Neuer**, giving you the power to **build** things, not choke on over-engineered nonsense.

---

### **HOW DOES NEUER DO IT? LIKE A BOSS.**

You’re probably sitting there thinking, “Yeah, but how does this magic work?” So I’m gonna spell it out for you in words you can understand. **Neuer** handles everything. **Everything**. State, events, rendering—**it’s automatic**. No framework babysitting, no thousand-step tutorials. It just works.

When you build with Neuer, you’re not just writing code—you’re **orchestrating** greatness. You're the conductor of your own web symphony. No framework is holding your hand. Neuer is not just a tool—it’s a **mindset**.

---

### **THINK YOU’VE GOT A HANDLE ON THE “BEST PRACTICES”? THINK AGAIN.**

“Best practices”? More like “least-risky practices for cowards who don’t know how to innovate.” If you think following 800 pages of “best practices” is the way forward, **stop reading this** and go back to being a framework drone. **Neuer doesn’t follow rules**. Neuer **breaks them**. 

Here’s the deal: you want to build a blog post? Go ahead. 

```javascript
export class BlogPostWithImage extends BlogPost {
    constructor() {
        const config = {
            name: `blog-post-with-image-${Date.now()}`
        };
        super(config);
    }

    static get observedAttributes() {
        return [...super.observedAttributes, 'data-image'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-image') {
            this.image = newValue;
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    async connectedCallback() {
        const initialState = {
            image: '',
        };
        try {
            const htmlContent = __HTML__;
            const cssContent = __CSS__;
            await super.connectedCallback(htmlContent, cssContent, initialState);
            super.initializeFromDOM();
            super.initializeModule();
            this.initializeModule();
        } catch (error) {
            console.error("Error loading blog post with image content:", error);
        }
    }

    initializeModule() {
        this.state.setState('title', this.getAttribute('data-title'));
        this.state.setState('author_date', `${this.getAttribute('data-author')} - ${this.getAttribute('data-date')}`);
        this.state.setState('content', this.getAttribute('data-content'));
        this.state.setState('image', this.getAttribute('data-image'));
    }

    renderImage(value, element) {
        element.src = value;
    };

    openOverlay(event, element) {
        const imageSrc = event.target.src;
        const overlay = this.shadowRoot.querySelector('#imageOverlay');
        const overlayImage = this.shadowRoot.querySelector('#overlayImage');
        overlayImage.src = imageSrc;
        overlay.style.display = 'flex';
    };

    closeOverlay(event, element) {
        const overlay = this.shadowRoot.querySelector('#imageOverlay');
        overlay.style.display = 'none';
    };
}
```

There it is. **One class**, one method, and boom. **Done.** No fluff. No “advanced patterns.” Just the cleanest, most efficient way to get things **done**. Not 15 layers of indirection and brain-melting patterns. **Just simple, actionable code.**

---

### **“BEST PRACTICES” FOR WHAT?**

You know what’s hilarious? People are out there worshipping “best practices” while creating more work for themselves. **Best practices** are just someone else’s rules for how they built their framework 12 years ago. Neuer doesn’t care about them. Neuer **rewrites** the rules.

Check this out:

```javascript
{
    targetId: 'blog-posts-container',
    moduleName: 'blog-post-with-image',
    props: {
        title: 'Lorem Ipsum Dolor Sit Amet',
        author: 'Kemong',
        date: 'December 1 2024',
        content: '<p>This is a <strong>lorem ipsum</strong> paragraph for the blog post content.</p>',
        image: 'https://picsum.photos/200',
        readMore: (event, element) => {
            alert('Read more modified');
        },
    },
}

const module = await moduleManager.attachModule(targetId, moduleName, props, children);
console.log(`Module ${module.name} initialized with state:`, module?.getState());
```

No state management nightmare. No life cycle horrors. Just **state**, **state**, and more **state**—done in the most elegant, simple, and **manageable** way possible.

---

### **OVERRIDES? YEAH, YOU CAN DO THAT. IN FACT, WE ENCOURAGE IT.**

Still think this is some framework that tells you how to write your code? Think again. Neuer **loves** to be **broken**. You want to override a module? **Do it.** You want to modify things on a global level? **Go wild.** You wanna take control and bend Neuer to your will? **We support that too.**

##### **INSTANCE-LEVEL OVERRIDES (THE GOD MODE OF CODE)**

You want to control just one instance of a module? Of course you do. **Neuer’s got you covered.**

```javascript
const module = await moduleManager.attachModule("blog-posts-container", "blog-post-with-image", {
    title: "Instance-Specific Blog Post",
    content: "<p>Custom content for this instance only.</p>",
    renderTextContent: (value, element) => {
        element.textContent = `Instance-Level Override: ${value}`;
    },
});
```

You just took control like a **boss**. Let the framework live in your world.

##### **CLASS-LEVEL OVERRIDES: DO IT ON A GRAND SCALE**

Want to change everything for **all** instances of a module? Go ahead and subclass the hell out of it. **Neuer doesn’t care.**

```javascript
class BlogPostWithImageV2 extends BlogPostWithImage {
    renderTextContent(value, element) {
        element.textContent = `Class-Level Override: ${value}`;
    }
}
```

BOOM. You’re the **undisputed ruler** of your code. No rules, no limits. Just **freedom**.

##### **GLOBAL OVERRIDES: LET IT ALL FLOW**

Want to change everything everywhere? Sure. Go for it. **Neuer’s global overrides** let you be the **ultimate overlord** of your application.

```javascript
moduleManager.registerRenderer("renderTextContent", (value, element) => {
    element.textContent = `Global Overridden: ${value}`;
});

moduleManager.injectGlobalRenderer(BlogPostWithImage, ['renderTextContent']);
```

Done. You’ve just taken the **blue pill** and hacked reality.

##### **DEFAULT**

Neuer even has defaults, but you can break those too. You’re always in control.
Okay, let’s say you’re the type who’s into **simplicity**, who just wants things to work without thinking too hard. Well, guess what? **Neuer’s got you covered.** You don’t have to drown in a sea of JavaScript just to get something to display. **Declarative usage** to the rescue! 

```html
<div id="blog-posts-container">
    <blog-post-with-image 
        data-title="Declarative Blog Post" 
        data-content="<p>This blog post is defined declaratively.</p>" 
        data-image="path/to/image.png">
    </blog-post-with-image>
</div>
```

That’s it. The module’s ready to go. No JS? No problem. Just **write HTML**, and Neuer does the rest. It's like your **personal dev assistant**—only it’s not slow and it doesn’t need lunch breaks.

---

### **ARE YOU READY TO RULE YOUR CODE?**

Are you seriously gonna keep playing the same tired game of prop-passing, component obsession, and framework slavery? **Step up. Break free.** Neuer is here to **redefine** how you build.


##### **INSTALLATION**

Like, obviously, you’ve figured this part out by now. **Right?**

```bash
npm install neuer
```


##### **USAGE**

I’m not here to waste your time with fluff. You know how to use it. Here's the deal:

```javascript
<script type="module" src='./dist/neuer.es.js'></script>
<script defer>
    document.addEventListener('DOMContentLoaded', async () => {

        // moduleManager available globally when you use the embedded style
        moduleManager.attachModule('my-container', 'my-module', {
            prop1: 'value1',
            prop2: 'value2',
            // more props
        });
    });
</script>
```

Neuer’s here. It’s about time you figured out what that means. **Now get out there and build something that actually works.**
