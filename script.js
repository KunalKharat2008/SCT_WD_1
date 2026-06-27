document.addEventListener("DOMContentLoaded", () => {

    // Dynamic Navbar (Task 1 Scroll Requirement)       
    const navbar = document.querySelector('.top-nav');
    window.addEventListener('scroll', () => {

        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 1. Custom Parallax Logic
       
    const parallaxElements = document.querySelectorAll('.parallax');
    const container = document.querySelector('.parallax-container');

    if (container && window.innerWidth > 768) {
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            parallaxElements.forEach((el) => {
                const speed = el.getAttribute('data-speed');
                const x = (mouseX * speed) / 100;
                const y = (mouseY * speed) / 100;
                el.style.transform = `translate(${x}px, ${y}px)`;
                el.style.transition = 'transform 0.1s ease-out';
            });
        });

        container.addEventListener('mouseleave', () => {
            parallaxElements.forEach((el) => {
                el.style.transform = `translate(0px, 0px)`;
                el.style.transition = 'transform 0.5s ease-out';
            });
        });
    }

    
    // 2. Scroll Reveal Animations
       
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));


    
    // 3. FAQ Accordion Logic
       
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentNode;
            const answer = item.querySelector('.faq-answer');

            item.classList.toggle('active');

            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
                answer.style.paddingTop = "10px";

                answer.style.paddingTop = "0";
            } else {
                answer.style.maxHeight = "0px";
            }
        });
    });
});


// 4. Modal & Overlay Management
   
const overlay = document.getElementById("overlay");

function openModal(modalId) {
    overlay.classList.add("active");
    document.getElementById(modalId).classList.add("active");
    overlay.onclick = closeModals;
}

function closeModals() {
    overlay.classList.remove("active");
    document.querySelectorAll('.glass-modal, .cart-sidebar').forEach(modal => {
        modal.classList.remove("active");
    });
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}


// 5. Functional Cart Logic
   
let cart = [];

function addToCart(name, price) {
    cart.push({ name, price, id: Date.now() });
    updateCartUI();
    triggerToast(`${name} added to cart!`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total-price");

    cartCount.innerText = cart.length;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        cartTotal.innerText = '$0.00';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price;
        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";
        itemElement.innerHTML = `
            <div>
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    cartTotal.innerText = `$${total.toFixed(2)}`;
}

function checkout() {
    if (cart.length === 0) {
        triggerToast("Your cart is empty.");
        return;
    }
    triggerToast("Processing checkout securely...");
    setTimeout(() => {
        cart = [];
        updateCartUI();
        closeModals();
        triggerToast("Order placed successfully!");
    }, 1500);
}


// 6. Form & Button Interactions
   
function handleLogin(e) {
    e.preventDefault();
    closeModals();
    triggerToast("Authentication successful. Welcome!");
}

function handleSearch() {
    const query = document.getElementById("search-input").value;
    if (query) {
        closeModals();
        triggerToast(`Searching acoustic database for "${query}"...`);
        document.getElementById("search-input").value = '';
    } else {
        triggerToast("Please enter a search term.");
    }
}


// 7. Global Toast Notification System
   
const toast = document.getElementById("toast");
let toastTimeout;

function triggerToast(message) {
    toast.innerText = message;
    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}