# **OVERRIDES (BECAUSE YOU'RE IN CHARGE, DUH)**

---

### **DEFAULTS? LOL, NOT IN THIS FRAMEWORK.**

Let’s get one thing straight: **Neuer doesn’t care about “defaults.”** This isn’t some rigid, one-size-fits-all framework where you’re stuck coloring inside the lines. **Neuer hands you the paintbrush and tells you to go wild.** Want to tweak a module? Do it. Want to rip apart the rendering logic and rewrite it in your own image? Do that too. **This is your playground. Go nuts.**

In Neuer, **overrides are power moves.** You’re not just building apps—you’re bending them to your will. With **instance-level**, **class-level**, and **global overrides**, you’ve got the keys to the kingdom. 

---

### **INSTANCE-LEVEL OVERRIDES (SMALL BUT MIGHTY)**  

Sometimes you just need to tweak **one little thing**. Maybe it’s a title, a custom event, or some special logic for that one VIP client who always asks for “something different.”  

Enter **instance-level overrides**: your tool for precision tweaking. Change one module without touching the others. It’s surgical. It’s clean. It’s **your secret weapon.**

#### **Example: A Blog Post That Screams "SPECIAL"**

```javascript
const module = await moduleManager.attachModule("blog-post-container", "blog-post-with-image", {
    title: "Exclusive Content for Cool Kids",
    content: "<p>This is for our elite users only.</p>",
    renderTextContent: (value, element) => {
        element.textContent = `✨ ${value} ✨`;
    },
});
```

And just like that, you’ve created a **one-of-a-kind module**. The rest of your blog posts stay untouched while this one sparkles. **Now tell me React could do that with this much swagger.**

---

### **CLASS-LEVEL OVERRIDES (BECAUSE WHY NOT CHANGE EVERYTHING?)**  

Alright, let’s turn it up a notch. With **class-level overrides**, you’re not just tweaking one instance—you’re redefining the rules for every instance of a module. This is where you start flexing.

Need every `blog-post` module in your app to look and behave differently? Done. Need to slap a custom feature across every sidebar? Easy. **You’re no longer just a developer—you’re a dictator of design.**

#### **Example: Every Blog Post, but Better**

```javascript
class BlogPostWithImageV2 extends BlogPostWithImage {
    renderTextContent(value, element) {
        element.textContent = `🔥 ${value} 🔥`; // Set EVERYTHING on fire.
    }

    renderImage(value, element) {
        element.src = `https://cdn.awesomeapp.com/${value}`; // CDN everything, because why not?
        element.style.borderRadius = '12px';
    }
}
customElements.define('blog-post-with-image-v2', BlogPostWithImageV2);
```

Now, **every single instance** of `blog-post-with-image-v2` is upgraded, sexier, and ready for prime time. **This is global impact, done your way.**

---

### **GLOBAL OVERRIDES (WELCOME TO THE TOP OF THE FOOD CHAIN)**  

Are you ready to rule your entire app with an iron fist? Because **global overrides** are the ultimate flex. Change how every module behaves everywhere, forever. This isn’t just control—it’s **domination.**

Global overrides let you rewrite the rules for **all instances** of a specific behavior. Want to globally change how every module renders text? Done. Want to ensure every button looks like it was designed by the gods? You’ve got it.

#### **Example: Universal Title Makeover**

```javascript
moduleManager.registerRenderer("renderTextContent", (value, element) => {
    element.textContent = `🌟 ${value.toUpperCase()} 🌟`;
});

moduleManager.injectGlobalRenderer(BlogPostWithImage, ['renderTextContent']);
```

Congratulations, you’ve just made sure every blog post in your app has **titles that scream confidence.** This is **next-level customization** that makes other frameworks look like they’re still learning HTML.

---

### **CUSTOM RENDERERS: NEUER LETS YOU HAVE IT YOUR WAY**  

Neuer understands that sometimes you just want things **your way**. That’s why it lets you inject **custom rendering logic** directly into modules. No begging. No fighting with core framework devs. Just you, your vision, and Neuer doing what you tell it to.

#### **Example: Custom Image Rendering with Extra Sass**

```javascript
moduleManager.registerRenderer('renderImage', (value, element) => {
    element.src = `https://mycustomcdn.com/images/${value}`;
    element.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.25)';
    element.style.transition = 'transform 0.2s';
    element.addEventListener('mouseenter', () => {
        element.style.transform = 'scale(1.05)';
    });
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1)';
    });
});
```

Boom. Now every image module in your app has **custom hover effects** and pulls assets from your own CDN. **Neuer doesn’t just enable creativity—it demands it.**

---

### **BEST PRACTICES FOR OVERLORDS (AKA "HOW NOT TO BURN THE HOUSE DOWN")**  

Look, we know you’re excited. You’ve got all this power, and you’re ready to flex it. But even the most brilliant overlords need a code of conduct. Here’s how to wield your newfound dominance responsibly:

1. **Don’t Go Crazy with Globals**  
   Global overrides are fun until they break your entire app. Use them wisely. Don’t turn every title into a screaming uppercase monster unless you really mean it.  

2. **Keep Instance Overrides Specific**  
   If you’re tweaking one module, keep it laser-focused. Don’t write a novel in your instance override function—save that for your global flexes.  

3. **Document Your Class-Level Changes**  
   If you’re overriding an entire class, **write it down.** Nobody likes trying to figure out why every button in the app suddenly has a neon glow.

4. **Test Your Overrides**  
   It’s all fun and games until your overrides break something three levels deep. Test them. **Be the brilliant dev your team thinks you are.**

---

### **OVERRIDES: THE FINAL WORD**

Overrides are Neuer’s way of telling you, **"You’re in charge."** No more begging for flexibility. No more hacking your way around framework limitations. Neuer gives you the power to create, tweak, and **rule** every aspect of your app.

So go ahead.  
- Change one instance.  
- Redefine a class.  
- Take over your entire app.  

**Neuer doesn’t care what you do—it just works.** Welcome to the future of frontend development. Now go break something (and then make it amazing).  