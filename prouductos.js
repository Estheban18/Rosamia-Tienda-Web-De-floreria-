                // Extraer el precio numérico del texto
                const precios = precioTexto.match(/\d+/g);
                if (precios && precios.length > 0) {
                    // Tomamos el primer precio encontrado (puedes ajustar esto según tus necesidades)
                    precio = parseFloat(precios[0]);
                }
                
                // Verificar si el producto ya está en el carrito
                const productoExistente = carrito.find(item => item.id === id);
                
                if (productoExistente) {
                    productoExistente.cantidad += 1;
                } else {
                    carrito.push({
                        id: id,
                        titulo: titulo,
                        precio: precio,
                        cantidad: 1
                    });
                }
                
                // Actualizar el contador del carrito
                actualizarContadorCarrito();
                
                // Mostrar notificación
                mostrarNotificacion(`${titulo} añadido al carrito`);
          
        
        // Evento para vaciar el carrito
        vaciarCarritoBtn.addEventListener('click', function() {
            carrito = [];
            actualizarContadorCarrito();
            actualizarCarrito();
            mostrarNotificacion('Carrito vaciado');
        });
        
        // Evento para pagar
        pagarCarritoBtn.addEventListener('click', function() {
            // Calcular total
            const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
            totalPagar.textContent = `S/ ${total.toFixed(2)}`;
            
            // Mostrar modal de pago
            carritoModal.hide();
            pagoModal.show();
        });
        
        // Evento para seleccionar método de pago
        document.querySelectorAll('.metodo-pago').forEach(metodo => {
            metodo.addEventListener('click', function() {
                // Quitar clase active de todos los métodos
                document.querySelectorAll('.metodo-pago').forEach(m => {
                    m.classList.remove('active');
                });
                
                // Agregar clase active al método seleccionado
                this.classList.add('active');
                
                // Mostrar botón de confirmar pago
                confirmarPagoBtn.classList.remove('d-none');
            });
        });
        
        // Evento para confirmar pago
        confirmarPagoBtn.addEventListener('click', function() {
            // Mostrar confirmación
            confirmacionPago.classList.remove('d-none');
            confirmarPagoBtn.classList.add('d-none');
            
            // Vaciar carrito después de 3 segundos
            setTimeout(() => {
                carrito = [];
                actualizarContadorCarrito();
                pagoModal.hide();
                confirmacionPago.classList.add('d-none');
            }, 3000);
        });
        
        // Función para actualizar el contador del carrito
        function actualizarContadorCarrito() {
            const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
            contadorCarrito.textContent = totalItems;
        }
        
        // Función para actualizar la vista del carrito
        function actualizarCarrito() {
            itemsCarrito.innerHTML = '';
            
            if (carrito.length === 0) {
                itemsCarrito.innerHTML = '<div class="alert alert-info">Tu carrito está vacío</div>';
                totalCarrito.textContent = 'S/ 0.00';
                return;
            }
            
            let total = 0;
            
            carrito.forEach(item => {
                const subtotal = item.precio * item.cantidad;
                total += subtotal;
                
                const itemHTML = `
                    <div class="item-carrito d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h6>${item.titulo}</h6>
                            <div class="d-flex align-items-center">
                                <button class="btn btn-sm btn-outline-secondary btn-restar" data-id="${item.id}">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="mx-2">${item.cantidad}</span>
                                <button class="btn btn-sm btn-outline-secondary btn-sumar" data-id="${item.id}">
                                    <i class="fas fa-plus"></i>
                                </button>
                                <span class="ms-3">S/ ${item.precio.toFixed(2)} c/u</span>
                            </div>
                        </div>
                        <div>
                            <span class="fw-bold">S/ ${subtotal.toFixed(2)}</span>
                            <button class="btn btn-sm btn-outline-danger btn-eliminar ms-2" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                
                itemsCarrito.innerHTML += itemHTML;
            });
            
            // Agregar eventos a los botones de cantidad
            document.querySelectorAll('.btn-restar').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const item = carrito.find(item => item.id === id);
                    
                    if (item.cantidad > 1) {
                        item.cantidad -= 1;
                    } else {
                        carrito = carrito.filter(item => item.id !== id);
                    }
                    
                    actualizarContadorCarrito();
                    actualizarCarrito();
                });
            });
            
            document.querySelectorAll('.btn-sumar').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const item = carrito.find(item => item.id === id);
                    item.cantidad += 1;
                    
                    actualizarContadorCarrito();
                    actualizarCarrito();
                });
            });
            
            document.querySelectorAll('.btn-eliminar').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    carrito = carrito.filter(item => item.id !== id);
                    
                    actualizarContadorCarrito();
                    actualizarCarrito();
                    mostrarNotificacion('Producto eliminado');
                });
            });
            
            totalCarrito.textContent = `S/ ${total.toFixed(2)}`;
        }
        
        // Función para mostrar notificaciones
        function mostrarNotificacion(mensaje) {
            const notificacion = document.createElement('div');
            notificacion.className = 'position-fixed bottom-0 end-0 p-3';
            notificacion.style.zIndex = '11';
            
            notificacion.innerHTML = `
                <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-primary text-white">
                        <strong class="me-auto">Rosamía</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        ${mensaje}
                    </div>
                </div>
            `;
            
            document.body.appendChild(notificacion);
            
            // Eliminar la notificación después de 3 segundos
            setTimeout(() => {
                notificacion.remove();
            }, 3000);
        }

