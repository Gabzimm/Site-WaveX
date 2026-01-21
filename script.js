// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initStats();
    setupEventListeners();
    simulateOnlineUsers();
    observeElements();
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
    const onlineUsers = document.getElementById('onlineUsers');
    if (!onlineUsers) return;
    
    setInterval(() => {
        const count = Math.floor(Math.random() * 15) + 20; // 20-35 pessoas
        const countEl = onlineUsers.querySelector('.online-count');
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

// Carrinho (simulação)
function addToCart(type) {
    let message = '';
    
    switch(type) {
        case 'individual':
            const checkboxes = document.querySelectorAll('.feature-selector input[type="checkbox"]:checked');
            if (checkboxes.length === 0) {
                message = 'Selecione pelo menos um módulo!';
            } else {
                message = 'Módulos adicionados ao carrinho!';
            }
            break;
            
        case 'complete':
            message = 'Pacote completo adicionado ao carrinho!';
            break;
            
        default:
            message = 'Produto adicionado ao carrinho!';
    }
    
    showNotification(message);
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
    
    // Estilo da notificação
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100%);
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
        }
        
        .notification.show {
            transform: translateX(-50%) translateY(0);
        }
        
        .notification i {
            font-size: 20px;
        }
    `;
    
    if (!document.querySelector('style[data-notification]')) {
        style.setAttribute('data-notification', 'true');
        document.head.appendChild(style);
    }
    
    // Mostrar e depois remover
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Inicializar preço
updatePrice();
