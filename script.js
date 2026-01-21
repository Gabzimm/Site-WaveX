// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initStats();
    setupEventListeners();
    simulateOnlineUsers();
    observeElements();
    updateCart();
});

// Configurar event listeners
function setupEventListeners() {
    // Menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile
                const navLinks = document.querySelector('.nav-links');
                if (window.innerWidth <= 768 && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
    
    // Formulário de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
        });
    }
    
    // Newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        const newsletterBtn = newsletterForm.querySelector('button');
        newsletterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            if (email && email.includes('@')) {
                alert('Obrigado por se inscrever! Você receberá nossas novidades.');
                newsletterForm.querySelector('input').value = '';
            } else {
                alert('Por favor, insira um email válido.');
            }
        });
    }
}

// Menu mobile
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Sistema de Carrinho
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Funções do Carrinho
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

function addToCart(productName, price, type = 'individual') {
    const existingItem = cart.find(item => 
        item.name === productName && item.type === type
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            type: type,
            quantity: 1
        });
    }
    
    updateCart();
    saveCart();
    
    showNotification(`"${productName}" adicionado ao carrinho!`);
}

function addCartIndividual() {
    const checkboxes = document.querySelectorAll('.feature-selector input[type="checkbox"]:checked');
    if (checkboxes.length === 0) {
        showNotification('Selecione pelo menos um módulo!');
        return;
    }
    
    checkboxes.forEach(checkbox => {
        const label = checkbox.nextElementSibling.textContent;
        const productName = label.split('(+')[0].trim();
        const priceMatch = label.match(/R\$ (\d+,\d+)/);
        if (priceMatch) {
            const price = parseFloat(priceMatch[1].replace(',', '.'));
            addToCart(productName, price, 'individual');
        }
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    saveCart();
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        updateCart();
        saveCart();
    }
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.querySelector('.cart-count');
    
    // Atualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Atualizar lista de itens
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        cartTotal.textContent = 'R$ 0,00';
        return;
    }
    
    let total = 0;
    let itemsHTML = '';
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemsHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${index})">Remover</button>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = itemsHTML;
    cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
        cart = [];
        updateCart();
        saveCart();
        showNotification('Carrinho limpo com sucesso!');
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Sistema de Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Adicione itens ao carrinho antes de finalizar a compra!');
        return;
    }
    
    // Modal de checkout
    const modalHTML = `
        <div class="checkout-modal">
            <div class="checkout-header">
                <h2><i class="fas fa-credit-card"></i> Finalizar Compra</h2>
                <button class="close-checkout">&times;</button>
            </div>
            <div class="checkout-body">
                <div class="payment-methods">
                    <h3>Escolha a forma de pagamento:</h3>
                    <div class="method-grid">
                        <div class="method-option" onclick="selectPayment('pix')">
                            <div class="method-icon pix">
                                <i class="fas fa-qrcode"></i>
                            </div>
                            <span>PIX</span>
                            <p>Pagamento instantâneo</p>
                        </div>
                        <div class="method-option" onclick="selectPayment('credit')">
                            <div class="method-icon credit">
                                <i class="fas fa-credit-card"></i>
                            </div>
                            <span>Cartão</span>
                            <p>Mastercard/Visa</p>
                        </div>
                        <div class="method-option" onclick="selectPayment('paypal')">
                            <div class="method-icon paypal">
                                <i class="fab fa-paypal"></i>
                            </div>
                            <span>PayPal</span>
                            <p>Pagamento internacional</p>
                        </div>
                    </div>
                </div>
                
                <div class="order-summary">
                    <h3>Resumo do Pedido</h3>
                    <div class="summary-items">
                        ${cart.map(item => `
                            <div class="summary-item">
                                <span>${item.name} x${item.quantity}</span>
                                <span>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="summary-total">
                        <strong>Total:</strong>
                        <strong id="checkoutTotal">R$ ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2).replace('.', ',')}</strong>
                    </div>
                </div>
                
                <div class="checkout-actions">
                    <button class="btn-back" onclick="closeCheckout()">Voltar</button>
                    <button class="btn-confirm" onclick="processPayment()">
                        <i class="fas fa-lock"></i> Confirmar Pagamento
                    </button>
                </div>
            </div>
        </div>
        <div class="checkout-overlay"></div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Adicionar event listeners
    document.querySelector('.close-checkout').addEventListener('click', closeCheckout);
    document.querySelector('.checkout-overlay').addEventListener('click', closeCheckout);
    
    // Selecionar PIX por padrão
    selectPayment('pix');
}

function selectPayment(method) {
    const methods = document.querySelectorAll('.method-option');
    methods.forEach(m => m.classList.remove('selected'));
    
    const selectedMethod = document.querySelector(`[onclick="selectPayment('${method}')"]`);
    if (selectedMethod) {
        selectedMethod.classList.add('selected');
    }
}

function processPayment() {
    showNotification('Processando pagamento... Aguarde!');
    
    // Simular processamento
    setTimeout(() => {
        showNotification('🎉 Pagamento realizado com sucesso! Em breve você receberá o bot.');
        
        // Simular envio de email
        setTimeout(() => {
            showNotification('📧 Instruções de instalação enviadas para seu email!');
        }, 2000);
        
        // Limpar carrinho após sucesso
        cart = [];
        updateCart();
        saveCart();
        
        closeCheckout();
        toggleCart(); // Fechar carrinho
    }, 3000);
}

function closeCheckout() {
    const modal = document.querySelector('.checkout-modal');
    const overlay = document.querySelector('.checkout-overlay');
    
    if (modal) modal.remove();
    if (overlay) overlay.remove();
}

// Estatísticas dinâmicas
const stats = {
    activeUsers: 1247,
    totalSales: 589,
    activeBots: 2841,
    rating: 4.9
};

function initStats() {
    // Animar números iniciais
    animateCounter('activeUsers', stats.activeUsers);
    animateCounter('totalSales', stats.totalSales);
    animateCounter('activeBots', stats.activeBots);
    
    // Atualizar periodicamente
    setInterval(updateStats, 8000);
}

function animateCounter(elementId, finalValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let start = 0;
    const duration = 2000;
    const increment = finalValue / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= finalValue) {
            element.textContent = finalValue.toLocaleString();
            element.classList.add('animated');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString();
        }
    }, 16);
}

function updateStats() {
    // Pequenas variações aleatórias
    const variations = {
        activeUsers: Math.floor(Math.random() * 20) - 10,
        totalSales: Math.floor(Math.random() * 3),
        activeBots: Math.floor(Math.random() * 30) - 15
    };
    
    // Atualizar valores
    stats.activeUsers = Math.max(1200, stats.activeUsers + variations.activeUsers);
    stats.totalSales += variations.totalSales;
    stats.activeBots = Math.max(2800, stats.activeBots + variations.activeBots);
    
    // Atualizar display (sem animação para não distrair)
    const activeUsersEl = document.getElementById('activeUsers');
    const totalSalesEl = document.getElementById('totalSales');
    const activeBotsEl = document.getElementById('activeBots');
    
    if (activeUsersEl) activeUsersEl.textContent = stats.activeUsers.toLocaleString();
    if (totalSalesEl) totalSalesEl.textContent = stats.totalSales.toLocaleString();
    if (activeBotsEl) activeBotsEl.textContent = stats.activeBots.toLocaleString();
}

// Simular usuários online
function simulateOnlineUsers() {
    const onlineCounter = document.getElementById('onlineUsers');
    if (!onlineCounter) return;
    
    // Criar elemento se não existir
    if (!document.querySelector('.online-counter')) {
        const counterHTML = `
            <div class="online-counter">
                <div class="online-dot"></div>
                <span class="online-count">25</span> pessoas online agora
            </div>
        `;
        onlineCounter.innerHTML = counterHTML;
    }
    
    // Atualizar contador
    setInterval(() => {
        const count = Math.floor(Math.random() * 15) + 20;
        const countEl = document.querySelector('.online-count');
        if (countEl) {
            countEl.textContent = count;
        }
    }, 15000);
}

// Observar elementos para animação
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observar cards e timeline
    document.querySelectorAll('.product-card, .why-card, .pricing-card, .timeline-item').forEach(el => {
        observer.observe(el);
    });
}

// Atualizar preço do plano individual
function updatePrice() {
    const checkboxes = document.querySelectorAll('.feature-selector input[type="checkbox"]');
    let total = 0;
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const label = checkbox.nextElementSibling.textContent;
            const priceMatch = label.match(/R\$ (\d+,\d+)/);
            if (priceMatch) {
                const price = parseFloat(priceMatch[1].replace(',', '.'));
                total += price;
            }
        }
    });
    
    const priceElement = document.getElementById('individualPrice');
    if (priceElement) {
        priceElement.textContent = total.toFixed(2).replace('.', ',');
    }
}

// Notificação
function showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
    // Mostrar e depois remover
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Inicializar preço
updatePrice();
// Funções do Modal
function openModal(modalId) {
    const modal = document.getElementById(modalId + 'Modal');
    const overlay = document.getElementById('modalOverlay');
    
    if (modal) {
        modal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Previne scroll no body
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId + 'Modal');
    const overlay = document.getElementById('modalOverlay');
    
    if (modal) {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restaura scroll
    }
}

// Fechar modal com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal('compras');
    }
});

// Função de preço individual (de volta!)
function updatePrice() {
    const checkboxes = document.querySelectorAll('.feature-selector input[type="checkbox"]');
    let total = 0;
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const label = checkbox.nextElementSibling.textContent;
            const priceMatch = label.match(/R\$ (\d+,\d+)/);
            if (priceMatch) {
                const price = parseFloat(priceMatch[1].replace(',', '.'));
                total += price;
            }
        }
    });
    
    const priceElement = document.getElementById('individualPrice');
    if (priceElement) {
        priceElement.textContent = total.toFixed(2).replace('.', ',');
    }
}

// Adicionar módulos individuais ao carrinho
function addCartIndividual() {
    const checkboxes = document.querySelectorAll('.feature-selector input[type="checkbox"]:checked');
    if (checkboxes.length === 0) {
        showNotification('Selecione pelo menos um módulo!');
        return;
    }
    
    checkboxes.forEach(checkbox => {
        const label = checkbox.nextElementSibling.textContent;
        const productName = label.split('(+')[0].trim();
        const priceMatch = label.match(/R\$ (\d+,\d+)/);
        if (priceMatch) {
            const price = parseFloat(priceMatch[1].replace(',', '.'));
            addToCart(productName, price, 'individual');
        }
    });
}

// Adicionar evento de clique no overlay para fechar modal
document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal('compras');
    }
});

// Modificar setupEventListeners para incluir modal
function setupEventListeners() {
    // Menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }
    
    // Smooth scroll (exceto para botões que abrem modal)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#comprar' || this.classList.contains('btn-buy-now')) {
                e.preventDefault();
                openModal('compras');
                return;
            }
            
            e.preventDefault();
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile
                const navLinks = document.querySelector('.nav-links');
                if (window.innerWidth <= 768 && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
    
    // Formulário de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
        });
    }
    
    // Newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        const newsletterBtn = newsletterForm.querySelector('button');
        newsletterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            if (email && email.includes('@')) {
                alert('Obrigado por se inscrever! Você receberá nossas novidades.');
                newsletterForm.querySelector('input').value = '';
            } else {
                alert('Por favor, insira um email válido.');
            }
        });
    }
    
    // Botões que abrem modal
    document.querySelectorAll('.btn-buy-now, .btn-primary[onclick*="compras"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (!this.getAttribute('href') || this.getAttribute('href') === '#comprar') {
                e.preventDefault();
                openModal('compras');
            }
        });
    });
}

// Inicializar preço do módulo individual
document.addEventListener('DOMContentLoaded', function() {
    initStats();
    setupEventListeners();
    simulateOnlineUsers();
    observeElements();
    updateCart();
    updatePrice(); // Inicializar preço
});
