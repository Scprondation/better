 Загрузка пользовательских настроек при загрузке страницы
        document.addEventListener('DOMContentLoaded', function() {
            loadUserSettings();
            loadProducts();
            updateStats();
            
             Обработчик формы добавления продукта
            document.getElementById('productForm').addEventListener('submit', function(e) {
                e.preventDefault();
                addProduct();
            });
            
             Предпросмотр изображения продукта
            document.getElementById('productImage').addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const preview = document.getElementById('imagePreview');
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                    }
                    reader.readAsDataURL(file);
                }
            });
            
             Настройки панели
            document.getElementById('settingsToggle').addEventListener('click', function() {
                document.getElementById('settingsPanel').classList.add('active');
            });
            
            document.getElementById('closeSettings').addEventListener('click', function() {
                document.getElementById('settingsPanel').classList.remove('active');
            });
            
             Выбор цвета
            document.querySelectorAll('.color-option').forEach(option = {
                option.addEventListener('click', function() {
                    document.querySelectorAll('.color-option').forEach(opt = {
                        opt.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    const color = this.getAttribute('data-color');
                    applyColorScheme(color);
                    saveUserSettings();
                });
            });
            
             Пользовательский выбор цвета
            document.getElementById('customColor').addEventListener('input', function() {
                const color = this.value;
                applyColorScheme(color);
                saveUserSettings();
            });
            
             Загрузка фона
            document.getElementById('uploadBackgroundBtn').addEventListener('click', function() {
                document.getElementById('backgroundUpload').click();
            });
            
            document.getElementById('backgroundUpload').addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const preview = document.getElementById('backgroundPreview');
                        const url = e.target.result;
                        
                        if (file.type.startsWith('image')) {
                            preview.innerHTML = `img src=${url} alt=Background Preview`;
                        } else if (file.type.startsWith('video')) {
                            preview.innerHTML = `video autoplay muted loopsource src=${url} type=${file.type}video`;
                        }
                        
                        preview.style.display = 'block';
                        
                         Сохраняем фон в настройках
                        const settings = getUserSettings();
                        settings.background = url;
                        settings.backgroundType = file.type.startsWith('video')  'video'  'image';
                        localStorage.setItem('userSettings', JSON.stringify(settings));
                        
                        applyUserSettings(settings);
                    }
                    reader.readAsDataURL(file);
                }
            });
            
             Слайдеры
            document.getElementById('blurSlider').addEventListener('input', function() {
                const value = this.value + 'px';
                document.getElementById('blurValue').textContent = value;
                document.documentElement.style.setProperty('--background-blur', value);
                
                const settings = getUserSettings();
                settings.backgroundBlur = value;
                localStorage.setItem('userSettings', JSON.stringify(settings));
            });
            
            document.getElementById('brightnessSlider').addEventListener('input', function() {
                const value = this.value + '%';
                document.getElementById('brightnessValue').textContent = value;
                document.documentElement.style.setProperty('--background-brightness', value);
                
                const settings = getUserSettings();
                settings.backgroundBrightness = value;
                localStorage.setItem('userSettings', JSON.stringify(settings));
            });
            
             Сброс фона
            document.getElementById('resetBackground').addEventListener('click', function() {
                const settings = getUserSettings();
                settings.background = '';
                settings.backgroundType = '';
                localStorage.setItem('userSettings', JSON.stringify(settings));
                
                document.getElementById('backgroundPreview').style.display = 'none';
                document.getElementById('backgroundPreview').innerHTML = '';
                document.documentElement.style.setProperty('--background-image', 'none');
            });
            
             Помощь по хостингу
            document.getElementById('showHostingHelp').addEventListener('click', function() {
                alert(`ПОДРОБНАЯ ИНСТРУКЦИЯ ПО ХОСТИНГУ В ЛОКАЛЬНОЙ СЕТИ

1. Узнайте IP-адрес вашего компьютера
   - Windows откройте командную строку и введите ipconfig
   - MacLinux откройте терминал и введите ifconfig

2. Запустите локальный сервер
   - Установите Python, затем в папке с сайтом выполните 
     python -m http.server 8000
   - Или используйте расширение для браузера Web Server for Chrome

3. Другие пользователи в вашей сети откройте в браузере
   http[ВАШ_IP]8000

Например, если ваш IP 192.168.1.5, то адрес будет http192.168.1.58000`);
            });
        });
        
         Функции для работы с настройками пользователя
        function getUserSettings() {
            return JSON.parse(localStorage.getItem('userSettings'))  {};
        }
        
        function saveUserSettings() {
            const settings = getUserSettings();
            
             Сохраняем текущий цвет
            const activeColor = document.querySelector('.color-option.active');
            if (activeColor) {
                settings.color = activeColor.getAttribute('data-color');
            }
            
             Сохраняем пользовательский цвет
            const customColor = document.getElementById('customColor').value;
            if (customColor && customColor !== '#000000') {
                settings.customColor = customColor;
            }
            
            localStorage.setItem('userSettings', JSON.stringify(settings));
        }
        
        function loadUserSettings() {
            const settings = getUserSettings();
            applyUserSettings(settings);
        }
        
        function applyUserSettings(settings) {
             Применяем цветовую схему
            if (settings.color) {
                applyColorScheme(settings.color);
                
                 Активируем соответствующую кнопку цвета
                document.querySelectorAll('.color-option').forEach(option = {
                    if (option.getAttribute('data-color') === settings.color) {
                        option.classList.add('active');
                    } else {
                        option.classList.remove('active');
                    }
                });
            } else if (settings.customColor) {
                applyColorScheme(settings.customColor);
                document.getElementById('customColor').value = settings.customColor;
            }
            
             Применяем фон
            if (settings.background) {
                document.documentElement.style.setProperty('--background-image', `url(${settings.background})`);
                
                const preview = document.getElementById('backgroundPreview');
                if (settings.backgroundType === 'video') {
                    preview.innerHTML = `video autoplay muted loopsource src=${settings.background}video`;
                } else {
                    preview.innerHTML = `img src=${settings.background} alt=Background Preview`;
                }
                preview.style.display = 'block';
            }
            
             Применяем настройки размытия и яркости
            if (settings.backgroundBlur) {
                document.documentElement.style.setProperty('--background-blur', settings.backgroundBlur);
                document.getElementById('blurSlider').value = parseInt(settings.backgroundBlur);
                document.getElementById('blurValue').textContent = settings.backgroundBlur;
            }
            
            if (settings.backgroundBrightness) {
                document.documentElement.style.setProperty('--background-brightness', settings.backgroundBrightness);
                document.getElementById('brightnessSlider').value = parseInt(settings.backgroundBrightness);
                document.getElementById('brightnessValue').textContent = settings.backgroundBrightness;
            }
        }
        
        function applyColorScheme(color) {
            document.documentElement.style.setProperty('--accent-primary', color);
            
             Создаем более светлый оттенок для вторичного акцента
            const hex = color.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            
            const lighterR = Math.min(255, r + 40);
            const lighterG = Math.min(255, g + 40);
            const lighterB = Math.min(255, b + 40);
            
            const lighterColor = `#${lighterR.toString(16).padStart(2, '0')}${lighterG.toString(16).padStart(2, '0')}${lighterB.toString(16).padStart(2, '0')}`;
            
            document.documentElement.style.setProperty('--accent-secondary', lighterColor);
        }
        
         Остальные функции для работы с продуктами (из предыдущего кода)
        function loadProducts() {
            const products = JSON.parse(localStorage.getItem('fridgeProducts'))  [];
            const productsGrid = document.getElementById('productsGrid');
            
            productsGrid.innerHTML = '';
            
            if (products.length === 0) {
                productsGrid.innerHTML = `
                    div class=empty-state style=grid-column 1  -1;
                        i class=fas fa-inboxi
                        h3Холодильник пустh3
                        pДобавьте продукты, используя форму вышеp
                    div
                `;
                return;
            }
            
            products.forEach(product = {
                addProductToGrid(product);
            });
            
            updateStats();
        }
        
        function addProduct() {
            const nameInput = document.getElementById('productName');
            const quantityInput = document.getElementById('productQuantity');
            const imageInput = document.getElementById('productImage');
            
            const name = nameInput.value.trim();
            const quantity = parseInt(quantityInput.value);
            
            if (!name) {
                alert('Пожалуйста, введите название продукта');
                return;
            }
            
            let imageData = '';
            if (imageInput.files.length  0) {
                const file = imageInput.files[0];
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    imageData = e.target.result;
                    saveProduct(name, quantity, imageData);
                };
                
                reader.readAsDataURL(file);
            } else {
                saveProduct(name, quantity, imageData);
            }
        }
        
        function addQuickProduct(name) {
            document.getElementById('productName').value = name;
            document.getElementById('productQuantity').value = 1;
            document.getElementById('productImage').value = '';
            document.getElementById('imagePreview').style.display = 'none';
            
             Фокусируемся на поле названия для быстрого редактирования
            document.getElementById('productName').focus();
        }
        
        function saveProduct(name, quantity, imageData) {
            const products = JSON.parse(localStorage.getItem('fridgeProducts'))  [];
            
             Проверяем, существует ли уже продукт с таким именем
            const existingProductIndex = products.findIndex(p = p.name === name);
            
            if (existingProductIndex !== -1) {
                 Если продукт уже существует, увеличиваем его количество
                products[existingProductIndex].quantity += quantity;
            } else {
                 Иначе создаем новый продукт
                const product = {
                    id Date.now(),
                    name name,
                    quantity quantity,
                    image imageData,
                    dateAdded new Date().toISOString()
                };
                products.push(product);
            }
            
             Сохраняем в localStorage
            localStorage.setItem('fridgeProducts', JSON.stringify(products));
            
             Перезагружаем список продуктов
            loadProducts();
            
             Очищаем форму
            document.getElementById('productForm').reset();
            document.getElementById('imagePreview').style.display = 'none';
            
             Показываем анимацию успешного добавления
            showSuccessAnimation();
        }
        
        function addProductToGrid(product) {
            const productsGrid = document.getElementById('productsGrid');
            
             Удаляем сообщение о пустом холодильнике, если оно есть
            const emptyState = productsGrid.querySelector('.empty-state');
            if (emptyState) {
                emptyState.remove();
            }
            
            const productCard = document.createElement('div');
            productCard.className = 'product-card fade-in';
            productCard.dataset.id = product.id;
            
            productCard.innerHTML = `
                ${product.image  `img src=${product.image} class=product-image alt=${product.name}`  
                `div class=product-image style=display flex; align-items center; justify-content center; background linear-gradient(135deg, #333, #444);
                    i class=fas fa-image style=font-size 48px; color #666;i
                div`}
                div class=product-info
                    div class=product-name${product.name}div
                    div class=product-quantity
                        div class=quantity-controls
                            button class=quantity-btn onclick=changeQuantity(${product.id}, -1)
                                i class=fas fa-minusi
                            button
                            span class=quantity-value${product.quantity}span
                            button class=quantity-btn onclick=changeQuantity(${product.id}, 1)
                                i class=fas fa-plusi
                            button
                        div
                        div class=product-actions
                            button class=delete-btn onclick=deleteProduct(${product.id})
                                i class=fas fa-trashi Удалить
                            button
                        div
                    div
                div
            `;
            
            productsGrid.appendChild(productCard);
        }
        
        function changeQuantity(productId, change) {
            const products = JSON.parse(localStorage.getItem('fridgeProducts'))  [];
            const productIndex = products.findIndex(p = p.id === productId);
            
            if (productIndex !== -1) {
                products[productIndex].quantity += change;
                
                 Если количество стало 0 или меньше, удаляем продукт
                if (products[productIndex].quantity = 0) {
                    products.splice(productIndex, 1);
                }
                
                 Сохраняем изменения
                localStorage.setItem('fridgeProducts', JSON.stringify(products));
                
                 Перезагружаем список продуктов
                loadProducts();
            }
        }
        
        function deleteProduct(productId) {
            if (confirm('Вы уверены, что хотите удалить этот продукт')) {
                const products = JSON.parse(localStorage.getItem('fridgeProducts'))  [];
                const updatedProducts = products.filter(p = p.id !== productId);
                
                localStorage.setItem('fridgeProducts', JSON.stringify(updatedProducts));
                loadProducts();
            }
        }
        
        function updateStats() {
            const products = JSON.parse(localStorage.getItem('fridgeProducts'))  [];
            
             Общее количество продуктов
            document.getElementById('totalProducts').textContent = products.length;
            document.getElementById('cardTotal').textContent = products.length;
            
             Общее количество единиц продуктов
            const totalQuantity = products.reduce((sum, product) = sum + product.quantity, 0);
            document.getElementById('totalQuantity').textContent = totalQuantity;
            
             Количество продуктов с малым запасом (меньше 3)
            const lowStockCount = products.filter(product = product.quantity  3).length;
            document.getElementById('lowStock').textContent = lowStockCount;
            document.getElementById('cardLow').textContent = lowStockCount;
            
             Количество категорий (уникальных названий)
            const categories = [...new Set(products.map(product = product.name))].length;
            document.getElementById('cardCategories').textContent = categories;
            
             Количество добавленных сегодня продуктов
            const today = new Date().toISOString().split('T')[0];
            const addedToday = products.filter(product = 
                product.dateAdded && product.dateAdded.startsWith(today)
            ).length;
            document.getElementById('cardAdded').textContent = addedToday;
        }
        
        function showSuccessAnimation() {
            const button = document.querySelector('.btn-primary');
            const originalText = button.innerHTML;
            
            button.innerHTML = 'i class=fas fa-checki Добавлено!';
            button.style.background = 'linear-gradient(135deg, #2dcc70, #27ae60)';
            
            setTimeout(() = {
                button.innerHTML = originalText;
                button.style.background = 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))';
            }, 2000);
        }