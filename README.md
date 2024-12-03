# Neuer – The Framework That Assembles the Web

### **THE FUTURE DOESN’T ASK FOR PERMISSION, BRO. IT JUST HAPPENS.**
Alright, listen up: Neuer isn’t just a framework—it’s a statement. It’s the thing you didn’t know you were waiting for, because honestly, you’ve been lied to. If you think React, Vue, or Angular are "cutting-edge," it’s time to wake up. You’ve been sold the illusion that these bloated, over-engineered excuses for frameworks are somehow "best practice." They’re not. They’re anchors—dragging you into the abyss of complexity.

Neuer is the **anti-framework** framework, and it’s here to save you from framework hell.

---

### **ARE YOU READY TO WAKE UP, OR DO YOU WANT TO KEEP CRAWLING IN THE DARK?**
You want to create a **blog post**? Boom. Clean. Fast. Beautiful. And let’s show you just how stupidly simple it is:

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

- Modular Magic: Build less. Assemble more.
- Infinite Overrides: Class? Instance? Global? You’re the boss.
- Dynamic Assembly: No rebuilds. No redeploys. It’s all live.
- Declarative Simplicity: Write HTML, let Neuer do the heavy lifting.
- Hot-Swappable Modules: Drop them in. Take them out. No drama.
- Global, Agnostic Power: Works anywhere. Plays nice with anything.

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

Neuer’s here. It’s about time you figured out what that means. **Now get out there and build something that actually works.**

```
### **QUESTIONS? PLEASE, WE'RE BUSY BEING AWESOME.**  
If you’ve got questions about Neuer, take a deep breath and **read the README again.** Seriously, we’ve covered it all.  

Still stuck? Okay, fine:  
- Open an issue, but keep it **polite**. Remember, you’re talking to the **framework that assembles the web.**  
- If your question starts with “Can Neuer do...” the answer is probably **yes**, so just try it first.  

---

### **ISSUES: NOT OUR PROBLEM, BUT FINE.**  
If you find a bug (unlikely, but sure), you can file an issue. But let’s set some ground rules:  
- Don’t open an issue unless you’re **100% sure it’s not your code**. We’re not here to debug your spaghetti.  
- If it’s a legit bug, describe it well. No vague “it doesn’t work” nonsense—we’re not mind readers.  

And remember, every issue slows us down from making Neuer even cooler. So... think twice, maybe?  

---

### **STAY IN TOUCH: BUT DON’T BE CLINGY.**  
Want to stay updated on Neuer’s greatness?  
No, we don’t have a newsletter. **Neuer doesn’t do spam.**  

---

### **CONTRIBUTION: BECAUSE YOU CAN’T RESIST.**  
Feeling inspired? Great! We **welcome contributions**, but only if:  
1. Your code is **cleaner than your desk** (low bar, we know).  
2. You bring fresh ideas, not just “can you make it work like [insert legacy framework]?”  
3. You’re ready to handle feedback like a champ, because we don’t sugarcoat things.  

Fork it. PR it. **Blow our minds.**  

---

### **SPONSORS: SHOUTOUT TO MY MOM.**  
Neuer is powered by:  
- **Our brains**, fueled by caffeine and sarcasm.  
- **Our moms**, who still think we “do something with computers.”  

Want to sponsor us? Sure!  
- Send snacks, coffee, or a heartfelt thank-you note.  
- Money’s cool too, but honestly, we’re not in it for the cash—we’re here to **change the web**.  

---

### **LICENSE: THE "NEUER KNOWS IT’S BETTER" LICENSE**  
#### **COPYRIGHT 2024, THE NEUER TEAM**

---

#### **PERMISSION GRANTED (LIKE, WHATEVER, DUDE)**  
Permission is granted, free of charge, to any person obtaining a copy of this software (the “Software”), to do **pretty much whatever you want**:  
- Run it.  
- Modify it.  
- Build something ridiculous with it (seriously, go wild).  
- Rename it “Framework McAwesome” and take all the credit. **But don’t lie to yourself—we know who’s doing the heavy lifting here.**  

**Neuer doesn’t care.** Just don’t do anything illegal, evil, or, like, catastrophically dumb. Deal? Cool.  

---

#### **THE COMMANDMENTS (BECAUSE NEUER IS A RELIGION NOW)**  

1. **Thou Shalt Acknowledge Neuer’s Greatness**  
   - Publicly admit that Neuer made your life easier.  
     - Slack? Tweet? Write it in the sky with a plane—whatever works for you.  
   - If you’re ditching React, Vue, or Angular, let your team know you’ve upgraded to **the future**.  

2. **Thou Shalt Not Screw It Up**  
   - If you modify Neuer, **keep it clean**. Don’t turn it into another unmaintainable horror story.  
   - If you break it, don’t come crying. You’re not five, and this isn’t daycare.  

3. **Thou Shalt Flaunt Thy Awesomeness**  
   - If you build something cool, **brag about it**. Share it everywhere, even that group chat you muted two years ago.  
   - Didn’t build something cool? That’s on **you**, pal. Neuer gave you greatness, and you squandered it. Shame.

---

#### **DISCLAIMERS (READ THIS IF YOU HAVE A LAWYER)**  

1. **Neuer takes no responsibility if you**:  
   - Realize your old framework was garbage and start questioning your life choices.  
   - Blow everyone’s minds at work and get promoted too quickly to handle the pressure.  
   - Lose hours admiring how smooth your app runs now. (Hey, productivity’s your problem, not ours.)  

2. **Neuer won’t help if you**:  
   - Use it to build something world-ending. If you make a doomsday app, **that’s on you, Dr. Evil.**  
   - Complain that “it doesn’t work like my old framework.” **Buddy, we’re not React. We’re better. Adapt.**  

3. **THE SOFTWARE IS PROVIDED “AS IS,” WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.**  
   - If it breaks, it’s either your fault or your karma. Either way, figure it out.
