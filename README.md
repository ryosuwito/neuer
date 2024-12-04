# Neuer – The Framework That Assembles the Web


### **"BEST PRACTICES"? PLEASE. MORE LIKE "BEST EXCUSES."**

Let’s not sugarcoat it: the current state of frontend development is a bloated dumpster fire, and you're just another coder fanning the flames. You've been spoon-fed lies about how "innovative" React, Vue, and Angular are—when in reality, they're just the same old concepts, duct-taped together with buzzwords like "virtual DOM" and "component lifecycle."

**It’s time to wake up.**  
**It’s time for Neuer.**

We’re not here to hold your hand. Neuer doesn’t have a 100-page “getting started” guide because you don’t need one. It’s not another shiny Goliath telling you how to do your job. **It’s David with a slingshot**, here to remind you that sometimes all it takes to knock a giant down is a simple, beautifully executed idea.

---

### **ARE YOU STILL WRITING CODE, OR ARE YOU JUST ASSEMBLING CHAOS?**

You’ve been building “modern” web apps, but are they really modern?  
**Neuer’s here to tell you they’re not.**

Want to make a blog post? Sure, let’s do it **without** the 500 lines of boilerplate and 47 npm packages:

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

**That’s it.** No `useState`. No `useEffect`. No "advanced patterns" designed to break your brain and your spirit. Just HTML that works. Neuer sees the Rube Goldberg machine your app has become, and it says, **"Let’s strip this down to what actually matters."**

---

### **NEUER DOESN’T FOLLOW RULES. IT WRITES THEM.**

Here’s how Neuer rolls:  
- **State? Managed.**  
- **Events? Handled.**  
- **Rendering? Automatic.**  
No need for “hooks,” “context providers,” or any of that nonsense. Neuer makes the magic happen while you’re still Googling how to fix your component tree.

---

### **YOU’RE NOT READY FOR THIS LEVEL OF FREEDOM.**

Still not convinced? Here’s how Neuer makes your precious “frameworks” look like the over-engineered disasters they are.

Want to add an image to a blog post? Check this out:

```javascript
import { BlogPost } from './BlogPost.js';

/**
 * BlogPostWithImage class extends the BlogPost class to include an image in the blog post.
 * It provides additional functionality for rendering the image and showing a full-screen
 * overlay when the image is clicked.
 * 
 * @extends BlogPost
 */
export class BlogPostWithImage extends BlogPost {
    constructor() {
        const config = {
            name: `blog-post-with-image`
        };
        super(config);
    }

    static get observedAttributes() {
        return [...super.observedAttributes, 'data-image'];
    }

    async connectedCallback() {
        const initialState = {
            image: '',
        };
        try {
            const htmlContent = __HTML__;
            const cssContent = __CSS__;

            await super.connectedCallback(htmlContent, cssContent, initialState);
            this.initializeModule();
        } catch (error) {
            console.error("Error loading blog post with image content:", error);
        }
    }

    initializeModule() {
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

customElements.define('blog-post-with-image', BlogPostWithImage);
```

**One class. One method. Infinite possibilities.**  
No “advanced architecture discussions.” No debates over whether to use Redux or Context. Just **get it done.**

---

### **“BUT WHAT ABOUT STATE MANAGEMENT?”**

Oh, you mean the thing that other frameworks make you rip your hair out over? Neuer handles state like a pro:

```javascript
{
    targetId: 'blog-posts-container',
    moduleName: 'blog-post-with-image',
    props: {
        title: 'Lorem Ipsum Dolor Sit Amet',
        author: 'Kemong',
        date: 'December 1, 2024',
        content: '<p>This is a <strong>lorem ipsum</strong> paragraph for the blog post content.</p>',
        image: 'https://picsum.photos/200',
        readMore: (event, element) => {
            alert('Read more modified');
        },
    },
}

const module = await moduleManager.attachModule(targetId, moduleName, props);
console.log(`Module ${module.name} initialized with state:`, module?.getState());
```

No reducers. No sagas. No headaches. Just **state, simplified.**

---

### **YOU DON’T ADAPT TO NEUER. NEUER ADAPTS TO YOU.**

Want to tweak a specific instance? Do it:

```javascript
const module = await moduleManager.attachModule("blog-posts-container", "blog-post-with-image", {
    title: "Instance-Specific Blog Post",
    content: "<p>Custom content for this instance only.</p>",
    renderTextContent: (value, element) => {
        element.textContent = `Instance-Level Override: ${value}`;
    },
});
```

Want to rewrite everything? Go global:

```javascript
moduleManager.registerRenderer("renderTextContent", (value, element) => {
    element.textContent = `Global Override: ${value}`;
});

moduleManager.injectGlobalRenderer(BlogPostWithImage, ['renderTextContent']);
```

Neuer doesn’t just let you customize—it **dares** you to.

---

### **INSTALLATION: AS EASY AS WE ARE BRILLIANT.**

```bash
npm install neuer
```

---

### **USAGE: EVEN YOUR DOG COULD DO THIS.**

```html
<script type="module" src='./dist/neuer.es.js'></script>
<script defer>
    document.addEventListener('DOMContentLoaded', async () => {
        moduleManager.attachModule('my-container', 'my-module', {
            prop1: 'value1',
            prop2: 'value2',
        });
    });
</script>
```

Done. You’re welcome.

Neuer’s here. It’s about time you figured out what that means. **Now get out there and build something that actually works.**

---


### **QUESTIONS? WE'RE TOO BUSY REDEFINING EXCELLENCE.**
Got questions about Neuer? Take a breath, hit pause on your doubt, and **read the README again.** We've crafted it to answer even those questions you haven't thought of yet.  

Still puzzled? Fine:
- Open an issue, but keep it **polite**. You're not just talking to a framework; you're addressing the future of web development.
- Wondering, “Can Neuer do...?” Trust us, the answer is a resounding **yes**—just give it a whirl before you ask.

---

### **ISSUES: YOUR MISTAKES, NOT OURS.**
Found a bug? That’s a bold claim. Let’s make some things crystal clear:
- Don’t open an issue unless you’re absolutely, positively, **100% sure it’s not just your code** misbehaving. We’re not here to sift through your code mess.
- Got a real issue? Describe it like you're talking to someone who’s not a mind reader (which we're not, despite the rumors).

Remember, every minute we spend fixing your “bugs” is a minute we're not making Neuer mind-blowingly awesome. So, think before you click.

---

### **STAY IN TOUCH: KEEP IT COOL, DON'T CLING.**
Want to stay in the loop with Neuer’s march towards web domination?
- Sorry, no newsletters here. **Neuer doesn’t spam; it innovates.**

---

### **CONTRIBUTION: NOT FOR THE FAINT-HEARTED.**
Feeling a surge of inspiration? We welcome contributions that match our brilliance:
1. Your code better be **cleaner than a surgeon’s scalpel**.
2. Bring fresh, groundbreaking ideas, not recycled tweaks. We're not here to retrofit old cars; we're crafting rockets.
3. Ready for brutally honest feedback? Great, because we’re here to forge excellence, not coddle mediocrity.

Fork it, clone it, and push it to the limits. **Impress or go home.**

---

### **SPONSORS: CHEERS TO THE BRAVE.**
Powering Neuer:
- **Our brilliant minds**, fueled by unrelenting ambition and possibly too much coffee.
- **Our moms**, who still think we’re just “playing on our computers.”

Want to sponsor this revolution?
- Send caffeine, inspiring notes, or just pure admiration our way.
- Money? Sure, it's accepted, but know this—we're here to make history, not just profits.

---

## **LICENSE: THE NEUER-DO-WHAT-YOU-WANT LICENSE**
#### **COPYRIGHT 2024, THE NEUER TEAM**

**PERMISSION GRANTED (LIKE, YEAH, WHATEVER)**

Do whatever your genius mind decides:
- Run it.
- Modify it.
- Create the unthinkable with it.
- Call it “SuperCoolFramework” if you like—just know deep down, it’s still our Neuer running the show.

**Neuer doesn’t sweat the small stuff.** Just steer clear of the illegal, the unethical, or the outright stupid.

---

### **THE NEUER COMMANDMENTS**
1. **Thou Shalt Recognize Neuer's Superiority**
   - Shout it from rooftops, tweet it into the void—let the world know Neuer simplified your life.
   - Upgraded from React or Angular? Tell your team you’ve seen the light.

2. **Thou Shalt Not Botch It**
   - Modify Neuer? Keep it classy and clean. No junk code.
   - Break something? Remember, Neuer’s not your mom. We don’t do tears.

3. **Thou Shalt Boast Loudly**
   - Created something awesome? Declare your genius far and wide.
   - Fall short? That’s on you. Neuer handed you the tools; you just had to wield them.

---

### **DISCLAIMERS FOR THE WISE**
1. **Neuer's Not To Blame If:**
   - You suddenly realize your old tools were toys.
   - Your career skyrockets to uncomfortable heights.
   - You lose time marveling at how brilliantly your project runs.

2. **Don’t Come Crying If:**
   - You concoct a world-ending algorithm. Seriously, keep that ambition positive.
   - You whine about Neuer not being like your ex-framework. We're not them. We’re better.

3. **NO WARRANTIES, EXPRESS OR IMPLIED.**
   - It breaks? Look in the mirror. That’s on you, champ.

Embrace Neuer—start building the future, not just software.
