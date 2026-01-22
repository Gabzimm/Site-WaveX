// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initStats();
    setupEventListeners();
    simulateOnlineUsers();
    updateCart();
    updatePrice();
});

// Sistema de Páginas
function openCompras() {
    const homePage = document.getElementById('homePage');
    const comprasPage = document.getElementById('comprasPage');
    
    homePage.classList.remove('active');
    comprasPage.classList.add('active');
    
    // Atualizar URL
    window.history.pushState({page: 'compras'}, '', '#compras');
    
    // Scroll para topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goHome() {
    const homePage = document.getElementById('homePage');
    const comprasPage = document.getElementById('comprasPage');
    
    comprasPage.classList.remove('active');
    homePage.classList.add('active');
    
    // Atualizar URL
    window.history.pushState({page: 'home'}, '', '#home');
    
    // Scroll para topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Gerenciar histórico do navegador
window.addEventListener('popstate', function(event) {
    if (window.location.hash === '#compras') {
        openCompras();
    } else {
        goHome();
    }
});

// Verificar URL inicial
if (window.location.hash === '#compras') {
    document.getElementById('homePage').classList.remove('active');
    document.getElementById('comprasPage').classList.add('active');
}

// Event Listeners
function setupEventListeners() {
    // Menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#compras') return;
            
            e.preventDefault();
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
    
    // Newsletter
    const newsletterBtn = document.querySelector('.newsletter-form button');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', subscribeNewsletter);
    }
}

// Menu mobile
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Newsletter
function subscribeNewsletter() {
    const input = document.querySelector('.newsletter-form input');
    const email = input.value;
    
    if (email && email.includes('@')) {
        alert('Obrigado por se inscrever! Você receberá nossas novidades.');
        input.value = '';
    } else {
        alert('Por favor, insira um email válido.');
    }
}

// Estatísticas
const stats = {
    activeUsers: 1247,
    totalSales: 589,
    activeBots: 2841,
    rating: 4.9
};

function initStats() {
    // Animar contadores
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
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString();
        }
    }, 16);
}

function updateStats() {
    // Variações aleatórias
    const variations = {
        activeUsers: Math.floor(Math.random() * 20) - 10,
        totalSales: Math.floor(Math.random() * 3),
        activeBots: Math.floor(Math.random() * 30) - 15
    };
    
    // Atualizar valores
    stats.activeUsers = Math.max(1200, stats.activeUsers + variations.activeUsers);
    stats.totalSales += variations.totalSales;
    stats.activeBots = Math.max(2800, stats.activeBots + variations.activeBots);
    
    // Atualizar display
    document.getElementById('activeUsers').textContent = stats.activeUsers.toLocaleString();
    document.getElementById('totalSales').textContent = stats.totalSales.toLocaleString();
    document.getElementById('activeBots').textContent = stats.activeBots.toLocaleString();
}

// Usuários online simulados
function simulateOnlineUsers() {
    const onlineUsers = document.querySelector('.online-users');
    if (!onlineUsers) return;
    
    setInterval(() => {
        const count = Math.floor(Math.random() * 15) + 20;
        const countEl = onlineUsers.querySelector('.online-count');
        if (countEl) {
            countEl.textContent = count;
        }
    }, 15000);
}

// Sistema de Preços
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

// Sistema de Carrinho
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    updateCart();
    saveCart();
    
    showNotification(`"${productName}" adicionado ao carrinho!`);
}

function addIndividualToCart() {
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
            addToCart(productName, price);
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
    
    // Atualizar lista
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

// Carrinho UI
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

// Checkout
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
    
    // Event listeners
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
    
    setTimeout(() => {
        showNotification('🎉 Pagamento realizado com sucesso! Em breve você receberá o bot.');
        
        setTimeout(() => {
            showNotification('📧 Instruções de instalação enviadas para seu email!');
        }, 2000);
        
        // Limpar carrinho
        cart = [];
        updateCart();
        saveCart();
        
        closeCheckout();
        toggleCart();
    }, 3000);
}

function closeCheckout() {
    const modal = document.querySelector('.checkout-modal');
    const overlay = document.querySelector('.checkout-overlay');
    
    if (modal) modal.remove();
    if (overlay) overlay.remove();
}

// Notificações
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Estilo básico da notificação
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: var(--gradient);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: var(--shadow);
        transition: transform 0.3s ease;
        z-index: 3000;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
