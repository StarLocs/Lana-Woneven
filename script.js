// ==========================================
// --- LANA WOVEN SCRIPT (ПОЛНЫЙ СКРИПТ + ГУГЛ МОСТ) ---
// ==========================================

let cart = [];
let itemToRemoveId = null; 
let discountPercent = 0; 

try { if (localStorage.getItem('lana_cart')) cart = JSON.parse(localStorage.getItem('lana_cart')); } catch (e) {}
function saveCart() { try { localStorage.setItem('lana_cart', JSON.stringify(cart)); } catch (e) {} }

function createDeleteModal() {
    const oldModal = document.getElementById('delete-confirm-modal');
    if (oldModal) oldModal.remove();

    const modalHtml = `
        <div class="popup-overlay" id="delete-confirm-modal">
            <div class="popup-content" id="delete-modal-content">
                <h2 style="font-family: 'Tenor Sans', serif; margin-bottom: 15px; color: var(--dark); font-size: 24px; font-weight: normal;">Удалить товар?</h2>
                <p style="color: var(--gray); margin-bottom: 30px; font-family: 'Montserrat', sans-serif; font-size: 16px;">Вы уверены, что хотите убрать этот товар из корзины?</p>
                <div style="display: flex; gap: 15px;">
                    <button style="flex: 1; padding: 15px; font-size: 14px; border-radius: 40px; font-family: 'Montserrat', sans-serif; font-weight: 700; text-transform: uppercase; cursor: pointer; background: transparent; color: var(--dark); border: 2px solid var(--dark);" onclick="closeDeleteModal()">Отмена</button>
                    <button style="flex: 1; padding: 15px; font-size: 14px; border-radius: 40px; font-family: 'Montserrat', sans-serif; font-weight: 700; text-transform: uppercase; cursor: pointer; background: #e74c3c; color: white; border: none;" onclick="executeRemove()">Да, удалить</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

document.addEventListener("DOMContentLoaded", () => {
    createDeleteModal(); 

    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('header-scrolled');
            else header.classList.remove('header-scrolled');
        });
    }

    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && !document.getElementById('theme-toggle')) {
        const themeBtn = document.createElement('button');
        themeBtn.id = 'theme-toggle';
        themeBtn.className = 'theme-toggle-btn';
        
        if (localStorage.getItem('lana_theme') === 'dark') {
            document.body.classList.add('dark-theme');
            themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }

        const cartBtn = navMenu.querySelector('.cart-btn-nav');
        if (cartBtn) {
            navMenu.insertBefore(themeBtn, cartBtn);
        } else {
            navMenu.appendChild(themeBtn);
        }

        themeBtn.addEventListener('click', () => {
            document.documentElement.classList.add('theme-in-transition');
            setTimeout(() => { document.documentElement.classList.remove('theme-in-transition'); }, 800);

            document.body.classList.toggle('dark-theme');
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('lana_theme', 'dark');
                themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                localStorage.setItem('lana_theme', 'light');
                themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
    }

    const categoryBtns = document.querySelectorAll('.category-btn');
    const subcategoryBtns = document.querySelectorAll('.subcategory-btn');
    const productCards = document.querySelectorAll('.card[data-category]');
    const emptyMsg = document.getElementById('empty-category-msg');
    const subcatPots = document.getElementById('subcategory-pots');

    let currentCategory = 'all';
    let currentSubcategory = 'all';

    function filterCards() {
        let visibleCount = 0;
        productCards.forEach(card => card.classList.add('hide-anim'));
        if (emptyMsg) emptyMsg.style.display = 'none';

        setTimeout(() => {
            productCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                const cardSubcat = card.getAttribute('data-subcategory') || 'all';
                let matchCat = (currentCategory === 'all' || cardCat === currentCategory);
                let matchSubcat = true;
                if (currentCategory === 'pots' && currentSubcategory !== 'all') { matchSubcat = (cardSubcat === currentSubcategory); }

                if (matchCat && matchSubcat) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (emptyMsg && visibleCount === 0) emptyMsg.style.display = 'block';

            setTimeout(() => {
                productCards.forEach(card => {
                    if (card.style.display === 'flex') card.classList.remove('hide-anim');
                });
            }, 20);
        }, 300);
    }

    if (categoryBtns.length > 0 && productCards.length > 0) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) return; 
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = btn.getAttribute('data-filter');

                if (currentCategory === 'pots') {
                    if (subcatPots) subcatPots.classList.add('show');
                    currentSubcategory = 'all';
                    subcategoryBtns.forEach(b => b.classList.remove('active'));
                    document.querySelector('.subcategory-btn[data-subfilter="all"]').classList.add('active');
                } else {
                    if (subcatPots) subcatPots.classList.remove('show');
                }
                filterCards();
            });
        });

        subcategoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) return;
                subcategoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentSubcategory = btn.getAttribute('data-subfilter');
                filterCards();
            });
        });
    }

    const galleryData = {
        'page-hanging': ['img/black1.jpg', 'img/black2.jpg', 'img/black3.jpg', 'img/purple1.jpg', 'img/purple2.jpg', 'img/green1.jpg', 'img/orange1.jpg'],
        'page-floor': ['img/floor1.jpg', 'img/floor2.jpg', 'img/floor3.jpg', 'img/floor4.jpg', 'img/floor5.jpg'],
        'page-floor-pattern': ['img/floor_pattern1.jpg', 'img/floor_pattern2.jpg'],
        'page-mushroom': ['img/mushroom1.jpg', 'img/mushroom2.jpg'],
        'page-hanging2': ['img/hanging2_1.jpg', 'img/hanging2_2.jpg'],
        'page-floor-pattern2': ['img/floor_pattern_new1.jpg', 'img/floor_pattern_new2.jpg'],
        'page-floor2': ['img/floor2_1.jpg', 'img/floor2_2.jpg'],
        'page-trunk': ['img/trunk1.jpg', 'img/trunk2.jpg'],
        'page-vase': ['img/vase1.jpg', 'img/vase2.jpg'],
        'page-floor-20l': ['img/floor_20l_1.jpg', 'img/floor_20l_2.jpg'],
        'page-floor-12l': ['img/floor_12l_1.jpg', 'img/floor_12l_2.jpg'],
        'page-floor-12l-2': ['img/floor_12l_new1.jpg', 'img/floor_12l_new2.jpg']
    };

    const pageId = document.body.id;
    const thumbContainer = document.getElementById("thumbContainer");
    const mainPhoto = document.getElementById("mainPhoto");

    if (thumbContainer && mainPhoto && galleryData[pageId]) {
        galleryData[pageId].forEach((src, index) => {
            const img = document.createElement("img");
            img.src = src;
            img.className = "thumb" + (index === 0 ? " active-thumb" : "");
            img.addEventListener("click", () => {
                mainPhoto.style.opacity = "0";
                setTimeout(() => { mainPhoto.src = src; mainPhoto.style.opacity = "1"; }, 150);
                document.querySelectorAll(".thumb").forEach(t => t.classList.remove("active-thumb"));
                img.classList.add("active-thumb");
            });
            thumbContainer.appendChild(img);
        });
    }

    const colors = ['#2c2c2c', '#d35400', '#2c7a40', '#5c2c7a', '#f5f5dc', '#8b4513', '#708090', '#000', '#FFF', '#DAA520', '#A0522D', '#696969', '#FF4500', '#BDB76B', '#483D8B', '#B22222', '#CD853F', '#D2691E', '#DEB887', '#E9967A', '#F4A460', '#B8860B', '#2F4F4F', '#008080', '#556B2F', '#808000', '#800000', '#800080', '#000080', '#008000', '#BC8F8F', '#F5F5F5', '#7F8C8D', '#2C3E50', '#ECF0F1', '#D35400', '#E67E22', '#F39C12', '#F1C40F', '#27AE60'];
    const paletteGrid = document.getElementById("paletteGrid");
    if (paletteGrid) {
        colors.forEach(color => {
            const dot = document.createElement("div");
            dot.className = "palette-dot";
            dot.style.backgroundColor = color;
            dot.addEventListener('click', () => {
                document.querySelectorAll('.palette-dot').forEach(d => { d.style.borderColor = 'var(--gray)'; d.style.transform = 'scale(1)'; });
                dot.style.borderColor = 'var(--primary)';
                dot.style.borderWidth = '2px';
                dot.style.transform = 'scale(1.15)';
            });
            paletteGrid.appendChild(dot);
        });
    }

    updateHeaderCart();
    renderProductButtons();
    if (pageId === 'page-cart') renderCartPage();
});

window.applyPromo = function() {
    const input = document.getElementById('promo-code-input');
    const msg = document.getElementById('promo-message');
    const code = input.value.trim().toUpperCase(); 
    if (code === 'LANA10') {
        discountPercent = 10;
        msg.className = 'promo-message success';
        msg.innerHTML = '<i class="fas fa-check-circle"></i> Промокод успешно применен! Скидка 10%';
    } else if (code === '') {
        msg.className = 'promo-message error';
        msg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Введите промокод';
        discountPercent = 0;
    } else {
        msg.className = 'promo-message error';
        msg.innerHTML = '<i class="fas fa-times-circle"></i> Промокод не найден или устарел';
        discountPercent = 0;
    }
    renderCartPage(); 
    updateHeaderCart();
};

window.promptRemoveFromCart = function(id) {
    itemToRemoveId = id;
    const modal = document.getElementById('delete-confirm-modal');
    if (modal) {
        modal.classList.add('active');
    }
};

window.closeDeleteModal = function() {
    itemToRemoveId = null;
    const modal = document.getElementById('delete-confirm-modal');
    if (modal) {
        modal.classList.remove('active');
    }
};

window.executeRemove = function() {
    if (itemToRemoveId) {
        cart = cart.filter(item => item.id !== itemToRemoveId); 
        saveCart(); 
        renderProductButtons();
        updateHeaderCart(); 
        if (document.body.id === 'page-cart') renderCartPage();
        closeDeleteModal();
    }
};

window.onclick = function(event) {
    const modal = document.getElementById('delete-confirm-modal');
    if (event.target === modal) closeDeleteModal();
};

function updateHeaderCart() {
    const headerPrices = document.querySelectorAll('.header-cart-price');
    let subtotal = 0;
    cart.forEach(item => {
        if(!item.quantity) item.quantity = 1; 
        subtotal += (item.price * item.quantity);
    });
    let discountAmount = Math.round(subtotal * (discountPercent / 100));
    let finalTotal = subtotal - discountAmount;
    headerPrices.forEach(badge => {
        if (finalTotal > 0) {
            badge.style.display = 'inline-block';
            badge.innerText = finalTotal + ' ₽';
        } else {
            badge.style.display = 'none';
        }
    });
}

function renderProductButtons() {
    const actionsContainer = document.getElementById('cart-actions');
    if (!actionsContainer) return;
    const id = actionsContainer.getAttribute('data-id');
    const name = actionsContainer.getAttribute('data-name');
    const price = parseInt(actionsContainer.getAttribute('data-price'));
    const img = actionsContainer.getAttribute('data-img');
    const cartItem = cart.find(item => item.id === id);

    if (cartItem) {
        let currentQty = cartItem.quantity || 1;
        let currentSum = currentQty * price;
        actionsContainer.innerHTML = `
            <div style="display: flex; gap: 15px; width: 100%; flex-wrap: wrap;">
                <div class="cart-qty-controls" style="flex: 1; justify-content: space-between; min-width: 130px; margin: 0;">
                    <button class="qty-btn" onclick="changeQuantity('${id}', -1)">−</button>
                    <span class="qty-val">${currentQty}</span>
                    <button class="qty-btn" onclick="changeQuantity('${id}', 1)">+</button>
                </div>
                <button class="btn-main" style="flex: 2; font-size: 13px; padding: 18px 10px; min-width: 160px;" onclick="window.location.href='cart.html'">В корзине: ${currentSum} ₽</button>
            </div>
            <a href="index.html#catalog" class="btn-return"><i class="fas fa-arrow-left"></i> Вернуться в каталог</a>
        `;
    } else {
        actionsContainer.innerHTML = `
            <button class="btn-main" style="width: 100%;" onclick="addToCart('${id}', '${name}', ${price}, '${img}')">Добавить в корзину</button>
            <a href="index.html#catalog" class="btn-return"><i class="fas fa-arrow-left"></i> Вернуться в каталог</a>
        `;
    }
}

window.addToCart = function(id, name, price, img) {
    if (!cart.some(item => item.id === id)) { 
        cart.push({ id, name, price, img, quantity: 1 }); 
        saveCart(); 
        renderProductButtons(); 
        updateHeaderCart(); 
    }
};

window.clearCart = function() { 
    cart = []; 
    saveCart(); 
    discountPercent = 0; 
    if(document.getElementById('promo-code-input')) document.getElementById('promo-code-input').value = '';
    if(document.getElementById('promo-message')) document.getElementById('promo-message').style.display = 'none';
    updateHeaderCart(); 
    renderCartPage(); 
};

window.changeQuantity = function(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        if (item.quantity + delta <= 0) { promptRemoveFromCart(id); return; }
        item.quantity += delta;
        saveCart();
        renderCartPage();
        updateHeaderCart();
        renderProductButtons(); 
    }
};

function renderCartPage() {
    const itemsContainer = document.getElementById('cart-items');
    const summaryBlock = document.getElementById('cart-summary');
    const formBlock = document.getElementById('cart-form');
    const priceDisplay = document.getElementById('total-price');
    const clearBtn = document.getElementById('clear-cart-btn');
    const headerRow = document.getElementById('cart-header');
    const successBlock = document.getElementById('order-success-block');
    const subtotalRow = document.getElementById('cart-subtotal-row');
    const discountRow = document.getElementById('cart-discount-row');
    const subtotalDisplay = document.getElementById('subtotal-price');
    const discountDisplay = document.getElementById('discount-amount');

    if (!itemsContainer) return;
    
    if (successBlock) successBlock.style.display = 'none';
    if (headerRow) headerRow.style.display = 'flex';
    
    itemsContainer.innerHTML = '';

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<div style="text-align:center; padding:50px 0; font-size:18px; color: var(--gray); width: 100%;">Ваша корзина пока пуста. <br><br><button class="btn-main" onclick="window.location.href=\'index.html#catalog\'">В каталог</button></div>';
        if(summaryBlock) summaryBlock.style.display = 'none';
        if(formBlock) formBlock.style.display = 'none';
        if(clearBtn) clearBtn.style.display = 'none';
        return;
    }

    let subtotal = 0;
    cart.forEach(item => {
        if(!item.quantity) item.quantity = 1;
        let itemTotalSum = item.price * item.quantity;
        subtotal += itemTotalSum;

        itemsContainer.innerHTML += `
            <div class="cart-item-row">
                <div class="cart-item-img-wrapper"><img src="${item.img}"></div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price} ₽ / шт.</div>
                </div>
                <div class="cart-qty-controls">
                    <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">−</button>
                    <span class="qty-val">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                </div>
                <div class="cart-item-sum">${itemTotalSum} ₽</div>
                <button class="btn-outline" style="width: auto; padding: 10px 15px; font-size: 0.8rem; border-color: #e74c3c; color: #e74c3c; margin-left: auto;" onclick="promptRemoveFromCart('${item.id}')">✕</button>
            </div>
        `;
    });

    let discountAmount = Math.round(subtotal * (discountPercent / 100));
    let finalTotal = subtotal - discountAmount;

    if (discountPercent > 0) {
        subtotalRow.style.display = 'flex';
        discountRow.style.display = 'flex';
        subtotalDisplay.innerText = subtotal + ' ₽';
        discountDisplay.innerText = '-' + discountAmount + ' ₽';
    } else {
        if(subtotalRow) subtotalRow.style.display = 'none';
        if(discountRow) discountRow.style.display = 'none';
    }

    if(priceDisplay) priceDisplay.innerText = finalTotal;
    if(summaryBlock) summaryBlock.style.display = 'block';
    if(formBlock) formBlock.style.display = 'block';
    if(clearBtn) clearBtn.style.display = 'block';
}

// === ОТПРАВКА ЗАКАЗА ЧЕРЕЗ GOOGLE МОСТ (ОБХОД БЛОКИРОВОК) ===
window.submitOrder = function() {
    try {
        const name = document.getElementById('order-name').value;
        const phone = document.getElementById('order-phone').value;
        const comment = document.getElementById('order-comment').value;

        if(!name || !phone) { alert("❌ Пожалуйста, заполните имя и телефон для связи!"); return; }

        // ССЫЛКА НА ГУГЛ МОСТ
        const googleBridgeUrl = 'https://script.google.com/macros/s/AKfycbxrHBezQkkcN18Pthq6QdfA_xGNsQi5bDqB0du-Xl0wiVKRYrqFkxYs1SkEzHEyVHCf/exec'; 

        let orderText = `🚨 *Новый заказ с сайта LANA WOVEN!*\n\n👤 *Имя:* ${name}\n📞 *Телефон:* ${phone}\n`;
        if (comment) orderText += `💬 *Комментарий:* ${comment}\n`;
        orderText += `\n🛒 *Товары:*\n`;

        let subtotal = 0;
        cart.forEach(item => {
            let qty = item.quantity || 1;
            let sum = item.price * qty;
            subtotal += sum;
            orderText += `▪️ ${item.name} — ${qty} шт. (${sum} ₽)\n`;
        });

        let discountAmount = Math.round(subtotal * (discountPercent / 100));
        let finalTotal = subtotal - discountAmount;
        if (discountPercent > 0) orderText += `\n🎁 *Скидка:* -${discountAmount} ₽`;
        orderText += `\n💰 *ИТОГО:* ${finalTotal} ₽`;

        let loader = document.getElementById('loading-overlay');
        if (!loader) {
            document.body.insertAdjacentHTML('beforeend', `<div class="loading-overlay" id="loading-overlay"><i class="fas fa-hourglass-half hourglass-spinner"></i><div class="loading-text">Отправляем заказ...</div></div>`);
            loader = document.getElementById('loading-overlay');
        }
        loader.classList.add('active');

        fetch(googleBridgeUrl, {
            method: 'POST',
            mode: 'no-cors', 
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: orderText })
        })
        .then(() => {
            cart = []; saveCart(); discountPercent = 0; updateHeaderCart();
            document.getElementById('cart-items').style.display = 'none';
            document.getElementById('cart-summary').style.display = 'none';
            document.getElementById('cart-form').style.display = 'none';
            document.getElementById('cart-header').style.display = 'none';
            const successBlock = document.getElementById('order-success-block');
            if (successBlock) successBlock.style.display = 'block';
        })
        .catch(error => {
            alert('⚠️ Ошибка сети. Заказ мог не отправиться. Напишите нам в Телеграм напрямую.');
            console.error(error);
        })
        .finally(() => { loader.classList.remove('active'); });

    } catch (error) { alert("⚠️ Ошибка: " + error.message); }
};