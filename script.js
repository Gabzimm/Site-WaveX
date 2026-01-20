// Menu mobile (opcional)
function toggleMobileMenu() {
    const nav = document.querySelector('.nav-links');
    nav.classList.toggle('active');
}

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Atualizar status do bot
async function updateBotStatus() {
    try {
        // URL do seu bot no Render
        const response = await fetch('https://discord-hospicio.onrender.com/');
        
        const statusElement = document.querySelector('.status-online');
        if (statusElement) {
            if (response.ok) {
                statusElement.textContent = '● Online';
                statusElement.style.color = '#57F287';
            } else {
                statusElement.textContent = '● Offline';
                statusElement.style.color = '#ED4245';
            }
        }
    } catch (error) {
        console.log('Não foi possível verificar status do bot');
        const statusElement = document.querySelector('.status-online');
        if (statusElement) {
            statusElement.textContent = '● Offline';
            statusElement.style.color = '#ED4245';
        }
    }
}

// Verificar status a cada 30 segundos
setInterval(updateBotStatus, 30000);
updateBotStatus();
