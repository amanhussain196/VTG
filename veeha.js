/* ============================================================
   VEEHA AI ASSISTANT — GLOBAL LOGIC
   ============================================================ */
(function() {
  'use strict';

  if (window.VEEHA_INITIALIZED) return;
  window.VEEHA_INITIALIZED = true;

  function initVeeha() {
    console.log('🤖 VEEHA Assistant Initializing...');
    
    // Check for existing wrapper
    if (document.querySelector('.veeha-chat-wrapper')) return;
    // Check if fonts are loaded or add them
    if (!document.querySelector('link[href*="Orbitron"]')) {
      const fonts = document.createElement('link');
      fonts.rel = 'stylesheet';
      fonts.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Inter:wght@400;700&display=swap';
      document.head.appendChild(fonts);
    }

    const chatHTML = `
      <div class="veeha-chat-wrapper" style="z-index: 2147483647 !important;">
        <div class="veeha-notification" id="veehaNotify"></div>
        <button class="veeha-trigger" id="veehaTrigger" title="Chat with VEEHA">
          <div class="veeha-trigger-glow"></div>
          <img src="veeha-avatar.png" alt="VEEHA" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; z-index: 2; border: 2px solid var(--veeha-cyan);">
        </button>
        <div class="veeha-chat-window" id="veehaWindow">
          <div class="veeha-chat-header">
            <div class="veeha-header-left">
              <div class="veeha-avatar" style="overflow: hidden; border: 1px solid rgba(255,255,255,0.2);">
                <img src="veeha-avatar.png" alt="VEEHA" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
              <div class="veeha-title-box">
                <span class="veeha-name">VEEHA</span>
                <span class="veeha-status">Online & Ready</span>
              </div>
            </div>
            <button class="veeha-close" id="veehaClose">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="veeha-messages" id="veehaMessages"></div>
          <div class="veeha-chat-input-area">
            <form class="veeha-input-container" id="veehaForm">
              <input type="text" class="veeha-input" id="veehaInput" placeholder="Type a message..." autocomplete="off">
              <button type="submit" class="veeha-send" id="veehaSend">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);

    const trigger = document.getElementById('veehaTrigger');
    const windowEl = document.getElementById('veehaWindow');
    const notifyEl = document.getElementById('veehaNotify');
    const closeBtn = document.getElementById('veehaClose');
    const form = document.getElementById('veehaForm');
    const input = document.getElementById('veehaInput');
    const messagesContainer = document.getElementById('veehaMessages');

    if (!trigger) {
      console.error('❌ VEEHA: Trigger button not found in DOM!');
      return;
    }
    console.log('✅ VEEHA: Elements linked, attaching click listener to:', trigger);

    let firstOpen = true;

    const pageContexts = {
      'ecommerce': "Need a shop that sells? 🛍️",
      'mobile-apps': "Thinking of an app? 📱",
      'web-applications': "Need a powerful platform? 🚀",
      'graphic-design': "Pixels or magic? 🎨",
      'seo': "Want the #1 spot? 🧗‍♀️",
      'custom-websites': "A fast site for you? ⚡",
      'index': "Need a digital guide? 😊"
    };

    const responses = {
      greeting: [
        "Hey! I'm VEEHA. Love the vibe here! What are we creating today? ✨",
        "Hi there! VEEHA here, ready to help. What's on your mind? 😊",
        "Hey! I was just organizing some pixels. How can I help you? 👧",
        "Hello! I'm VEEHA. Ready to turn some ideas into reality? 🚀"
      ],
      smalltalk: {
        'how are you': "I'm doing wonderful! Just vibing in the cloud. How are you? 😊",
        'how is the day': "My day is great! Helping people build cool things is the best. How's yours? ✨",
        'what are you doing': "Just thinking about how to make the internet a cooler place! And chatting with you, of course. 👧",
        'who are you': "I'm VEEHA, Vistara's AI assistant. Think of me as your digital bestie! 👧",
        'what can you do': "I can brainstorm ideas, guide you through our services, answer tech questions, or just chat! 🛠️",
        'hello': "Hi! Great to meet you. I'm VEEHA! ✨",
        'hey': "Hey! Hope you're having an awesome day. 😊",
        'hi': "Hi there! What's on your mind? ✨",
        'thanks': "You're so welcome! Happy to help. ❤️",
        'thank you': "Anytime! It's what I'm here for. 😊",
        'bye': "Catch you later! Don't be a stranger. 👋",
        'goodbye': "Bye! Have an amazing rest of your day. ✨"
      },
      formal: [
        "Vistara Tech Global specializes in high-performance digital solutions. How may I assist? 🏛️",
        "Greetings. I am VEEHA. I can certainly help with your project requirements today. 📊"
      ],
      casual: [
        "Haha, love the energy! ⚡ Let's build something epic!",
        "Nice! Tell me more about this idea of yours. 😊"
      ],
      contact: [
        "The best way is our contact form, or call us at +91 87490 74438! 📞",
        "You can reach us at info.vistaratechglobal@gmail.com anytime! 📧"
      ]
    };

    const brain = {
      company: {
        name: "Vistara Tech Global",
        mission: "Digitizing businesses with high-performance, scalable tech solutions.",
        contact: {
          email: "info.vistaratechglobal@gmail.com",
          phone: "+91 87490 74438",
          location: "Global / India"
        }
      },
      services: {
        ecommerce: {
          title: "E-Commerce Solutions",
          tech: ["Shopify", "WooCommerce", "Custom MERN", "Stripe", "Next.js"],
          features: ["Conversion optimization", "Multi-vendor support", "Payment gateways", "Inventory management"],
          pitch: "We build digital stores that don't just look good, but sell like crazy. 🛍️"
        },
        mobile: {
          title: "Mobile App Development",
          tech: ["Flutter", "React Native", "Swift", "Kotlin", "Firebase"],
          features: ["Cross-platform sync", "Offline mode", "Push notifications", "App Store optimization"],
          pitch: "Native performance with beautiful UI for iOS and Android. 📱"
        },
        webapps: {
          title: "Enterprise Web Applications",
          tech: ["Node.js", "Python/Django", "PostgreSQL", "AWS", "Docker"],
          features: ["99.9% Uptime", "SaaS architecture", "Real-time dashboards", "Microservices"],
          pitch: "Scalable platforms built to handle millions of users. 🏗️"
        },
        websites: {
          title: "Custom Websites",
          tech: ["React", "Astro", "Tailwind CSS", "GSAP", "Three.js"],
          features: ["Ultra-fast loading", "SEO-ready", "Animated UI", "CMS integration"],
          pitch: "Pixel-perfect sites that tell your story perfectly. 🌐"
        },
        seo: {
          title: "Organic Growth & SEO",
          tech: ["Ahrefs", "Semrush", "Google Search Console", "Technical SEO"],
          features: ["Keyword dominance", "Backlink strategy", "Content marketing", "Analytics"],
          pitch: "We get you to the first page of Google and keep you there. 📈"
        },
        design: {
          title: "Graphic & UI/UX Design",
          tech: ["Figma", "Adobe CC", "Blender", "After Effects"],
          features: ["Branding & Logos", "Design Systems", "3D Assets", "Marketing visuals"],
          pitch: "Visual magic that turns visitors into loyal fans. 🎨"
        }
      },
      process: ["Audit & Strategy", "Prototyping & Design", "Agile Development", "QA & Launch", "Ongoing Support"],
      industries: ["Healthcare", "Finance", "Retail", "Real Estate", "SaaS", "Education"]
    };

    function getCurrentContext() {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('ecommerce')) return pageContexts.ecommerce;
      if (path.includes('mobile-apps')) return pageContexts['mobile-apps'];
      if (path.includes('web-applications')) return pageContexts['web-applications'];
      if (path.includes('graphic-design')) return pageContexts['graphic-design'];
      if (path.includes('seo')) return pageContexts.seo;
      if (path.includes('custom-websites')) return pageContexts['custom-websites'];
      return pageContexts.index;
    }

    function addMessage(text, type = 'bot', action = null) {
      const msg = document.createElement('div');
      msg.className = `veeha-msg veeha-msg-${type}`;
      
      const span = document.createElement('span');
      msg.appendChild(span);
      messagesContainer.appendChild(msg);

      if (type === 'bot') {
        let i = 0;
        const speed = 15; // ms per char
        function typeChar() {
          if (i < text.length) {
            span.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
            i++;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            setTimeout(typeChar, speed);
          } else if (action && action.url) {
            const link = document.createElement('a');
            link.href = action.url;
            link.className = 'veeha-msg-link';
            link.innerHTML = `${action.text} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>`;
            msg.appendChild(link);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        }
        typeChar();
      } else {
        span.textContent = text;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }

    function showTyping() {
      const typing = document.createElement('div');
      typing.className = 'veeha-msg veeha-msg-bot veeha-typing';
      typing.id = 'veehaTyping';
      typing.innerHTML = '<div class="veeha-typing-orb"></div><text>Thinking...</text>';
      messagesContainer.appendChild(typing);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function removeTyping() {
      const typing = document.getElementById('veehaTyping');
      if (typing) typing.remove();
    }

    function getBotResponse(userText) {
      const text = userText.toLowerCase();
      
      // 1. Language Model "Understanding" Layer (Intent Mapping)
      const intents = {
        greeting: ['hello', 'hi', 'hey', 'greetings', 'sup', 'morning', 'evening'],
        capabilities: ['what can you do', 'help', 'features', 'abilities', 'who are you'],
        process: ['how do you work', 'process', 'steps', 'workflow', 'methodology'],
        technology: ['tech', 'stack', 'languages', 'tools', 'frameworks'],
        pricing: ['cost', 'price', 'pricing', 'quote', 'money', 'expensive', 'cheap'],
        contact: ['contact', 'email', 'phone', 'call', 'reach', 'office'],
        brainstorm: ['idea', 'brainstorm', 'suggest', 'concept', 'innovation'],
        services: ['service', 'ecommerce', 'mobile', 'web', 'app', 'design', 'seo']
      };

      // 2. Generate Content based on identified intents
      let response = { text: "", action: null };

      // Helper to check if text contains any of the intent keywords
      const hasIntent = (intent) => intents[intent].some(keyword => text.includes(keyword));

      if (hasIntent('brainstorm')) {
        const topics = {
          ecommerce: "For E-commerce, I'm thinking: **AI-Powered Virtual Try-ons**, **One-Click Crypto Checkout**, and **Social Commerce Integration**. 🛍️",
          mobile: "For Mobile, we could explore: **AR Navigation**, **Bio-metric multi-factor auth**, and **Edge computing for speed**. 📱",
          default: "I suggest focusing on **Hyper-Personalization** and **Sustainable Tech**. Want me to dive deeper into a specific niche? 💡"
        };
        response.text = text.includes('shop') || text.includes('ecommerce') ? topics.ecommerce : 
                        text.includes('app') || text.includes('mobile') ? topics.mobile : topics.default;
      }
      else if (hasIntent('process')) {
        response.text = `My logic follows the Vistara Protocol: \n1. **Discovery**: We audit your needs. \n2. **Design**: High-fidelity prototyping. \n3. **Development**: Agile sprints with clean code. \n4. **Deployment**: Scaling to the cloud. 🚀`;
      }
      else if (hasIntent('technology')) {
        response.text = "I recommend a hybrid stack: **Next.js & Tailwind** for the frontend, **Node.js/Go** for high-load backends, and **PostgreSQL** for data integrity. This is the 'gold standard' for 2026. 🛠️";
      }
      else if (hasIntent('pricing')) {
        response.text = "At Vistara, we operate on a strictly **Value-Based Pricing** model. Whether it's a fixed-price MVP or a dedicated team retainer, we optimize for ROI. 💰 Want a quick estimate?";
        response.action = { url: 'index.html#contact', text: 'Get Estimate' };
      }
      else if (hasIntent('capabilities') || hasIntent('greeting')) {
        const greet = responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
        response.text = `${greet} I'm an advanced AI tuned to Vistara's ecosystem. I can architect project roadmaps, suggest tech stacks, and explain our global services. What are we building? 👧`;
      }
      else if (hasIntent('services')) {
        for (const s in brain.services) {
          const service = brain.services[s];
          if (text.includes(s) || service.tech.some(t => text.includes(t.toLowerCase()))) {
            response.text = `${service.pitch} We specialize in ${service.tech.join(', ')}. Would you like to see our ${service.title} portfolio?`;
            response.action = { url: s === 'mobile' ? 'service-mobile-apps.html' : `service-${s}.html`, text: `View ${service.title}` };
            return response;
          }
        }
        response.text = "We offer a full suite of digital engineering: **E-Commerce**, **Mobile Apps**, **Cloud Platforms**, **SEO**, and **Visual Design**. Which area interests you most? 🛠️";
        response.action = { url: 'index.html#services', text: 'Browse All' };
      }
      else if (text.includes('thanks') || text.includes('thank')) {
        response.text = "You're very welcome! I'm here 24/7 to help you dominate the digital space. Anything else? ❤️";
      }
      else {
        // Fallback with "Reasoning" simulation
        response.text = "That's an interesting query! My knowledge base is deep but specific to Vistara's tech services. 🧠 Could you rephrase that, or would you like to speak to a human expert?";
        response.action = { url: 'index.html#contact', text: 'Connect with Human' };
      }

      return response;
    }

    function showPopup() {
      if (windowEl.classList.contains('veeha-active')) return;
      notifyEl.textContent = getCurrentContext();
      notifyEl.classList.add('veeha-active');
      setTimeout(() => notifyEl.classList.remove('veeha-active'), 6000);
    }

    // Proactive
    setTimeout(showPopup, 10000);
    setInterval(showPopup, 300000);

    trigger.addEventListener('click', (e) => {
      console.log('🔘 VEEHA Trigger Clicked!');
      e.preventDefault();
      e.stopPropagation();
      windowEl.classList.add('veeha-active');
      trigger.style.display = 'none'; // Hide instead of opacity for cleaner state
      notifyEl.classList.remove('veeha-active');
      if (firstOpen) {
        setTimeout(() => {
          showTyping();
          setTimeout(() => {
            removeTyping();
            addMessage(responses.greeting[Math.floor(Math.random() * responses.greeting.length)], 'bot');
            firstOpen = false;
          }, 1500);
        }, 800);
      }
    });

    closeBtn.addEventListener('click', () => {
      windowEl.classList.remove('veeha-active');
      trigger.style.display = 'block';
      trigger.style.opacity = '1';
      trigger.style.pointerEvents = 'auto';
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      addMessage(text, 'user');
      input.value = '';
      
      // Calculate dynamic typing delay based on response length
      const response = getBotResponse(text);
      const delay = Math.min(2500, Math.max(800, response.text.length * 15));
      
      setTimeout(() => {
        showTyping();
        setTimeout(() => {
          removeTyping();
          addMessage(response.text, 'bot', response.action);
        }, delay);
      }, 400);
    });
  }

  if (document.readyState === 'complete') {
    initVeeha();
  } else {
    window.addEventListener('load', initVeeha);
  }
})();
