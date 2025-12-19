// Wait for DOM to be fully loaded
$(document).ready(function() {
    
    // Mobile Navigation Toggle with jQuery
    $('.hamburger').on('click', function() {
        $('.nav-links').toggleClass('active');
        $(this).toggleClass('active');
    });

    // Form Validation and Submission with jQuery
    $('#reservationForm').on('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        $(this).addClass('loading');
        $('.submit-btn').html('Duke përpunuar...');
        
        // Clear previous errors
        $('.error-message').remove();
        $('.form-group').removeClass('form-error');
        
        let isValid = true;
        
        // Validate each required field
        const requiredFields = ['#checkin', '#checkout', '#firstName', '#lastName', '#email', '#phone', '#roomType'];
        
        requiredFields.forEach(field => {
            const $field = $(field);
            if (!$field.val().trim()) {
                showError($field, 'Kjo fushë është e detyrueshme');
                isValid = false;
            }
        });
        
        // Validate dates
        const checkin = new Date($('#checkin').val());
        const checkout = new Date($('#checkout').val());
        
        if (checkin >= checkout) {
            showError($('#checkout'), 'Data e check-out duhet të jetë pas datës së check-in');
            isValid = false;
        }
        
        // Validate email
        const email = $('#email').val();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError($('#email'), 'Ju lutem vendosni një email adresë të vlefshme');
            isValid = false;
        }
        
        // Validate phone
        const phone = $('#phone').val();
        const phoneRegex = /^[0-9\s\-\+\(\)]{8,}$/;
        if (!phoneRegex.test(phone)) {
            showError($('#phone'), 'Ju lutem vendosni një numër telefoni të vlefshëm');
            isValid = false;
        }
        
        // Check terms
        if (!$('#terms').is(':checked')) {
            showError($('#terms').parent(), 'Ju duhet të pranoni kushtet dhe kushtet');
            isValid = false;
        }
        
        if (isValid) {
            // Calculate price
            calculateAndShowTotal();
            
            // Simulate form submission
            setTimeout(function() {
                $('#reservationForm').removeClass('loading');
                $('.submit-btn').html('Rezervo Tani');
                
                // Show success message
                showSuccessMessage();
                
                // You would normally send data to server here
                console.log('Form data:', {
                    checkin: $('#checkin').val(),
                    checkout: $('#checkout').val(),
                    adults: $('#adults').val(),
                    children: $('#children').val(),
                    roomType: $('#roomType').val(),
                    firstName: $('#firstName').val(),
                    lastName: $('#lastName').val(),
                    email: $('#email').val(),
                    phone: $('#phone').val(),
                    specialRequests: $('#specialRequests').val(),
                    payment: $('input[name="payment"]:checked').val()
                });
                
                // Reset form after 3 seconds
                setTimeout(function() {
                    $('#reservationForm')[0].reset();
                    $('.price-total').fadeOut();
                    resetFormStyles();
                }, 3000);
                
            }, 2000);
        } else {
            $('#reservationForm').removeClass('loading');
            $('.submit-btn').html('Rezervo Tani');
            
            // Scroll to first error
            $('html, body').animate({
                scrollTop: $('.form-error:first').offset().top - 100
            }, 500);
        }
    });

    // Set minimum date for check-in to today
    const today = new Date().toISOString().split('T')[0];
    $('#checkin').attr('min', today);
    
    // Update check-out min date when check-in changes
    $('#checkin').on('change', function() {
        const checkinDate = $(this).val();
        $('#checkout').attr('min', checkinDate);
        
        // If checkout date is before new checkin date, reset it
        if ($('#checkout').val() && $('#checkout').val() < checkinDate) {
            $('#checkout').val('');
        }
        
        // Animate the field
        $(this).addClass('pulse');
        setTimeout(() => $(this).removeClass('pulse'), 500);
        
        // Update price if room is selected
        if ($('#roomType').val()) {
            calculateAndShowTotal();
        }
    });

    // Update price when room type changes
    $('#roomType').on('change', function() {
        const roomType = $(this).val();
        
        // Highlight corresponding room preview
        $('.preview-item').removeClass('selected');
        $(`.preview-item:eq(${getRoomIndex(roomType)})`).addClass('selected');
        
        // Animate selection
        $(`.preview-item:eq(${getRoomIndex(roomType)})`).addClass('pulse');
        setTimeout(() => $(`.preview-item:eq(${getRoomIndex(roomType)})`).removeClass('pulse'), 500);
        
        // Calculate and show total
        calculateAndShowTotal();
    });

    // Calculate total price
    function calculateAndShowTotal() {
        const roomPrices = {
            'standard': 89,
            'deluxe': 129,
            'suite': 199,
            'presidential': 299
        };
        
        const roomType = $('#roomType').val();
        const checkin = $('#checkin').val();
        const checkout = $('#checkout').val();
        
        if (roomType && checkin && checkout) {
            const nights = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 3600 * 24));
            const pricePerNight = roomPrices[roomType];
            const total = pricePerNight * nights;
            
            // Create or update price summary
            let $priceTotal = $('.price-total');
            if ($priceTotal.length === 0) {
                $priceTotal = $('<div class="price-total"></div>');
                $('#reservationForm').prepend($priceTotal);
            }
            
            $priceTotal.html(`
                <h4>Detajet e Çmimit</h4>
                <ul class="price-breakdown">
                    <li>Çmimi për natë: <span>€${pricePerNight}</span></li>
                    <li>Numri i netëve: <span>${nights}</span></li>
                    <li style="font-weight: bold; border-top: 2px solid #000; margin-top: 5px; padding-top: 5px;">
                        Totali: <span>€${total}</span>
                    </li>
                </ul>
                <p><small>Çmimi përfshin taksën. Nuk përfshin shërbime shtesë.</small></p>
            `).fadeIn();
        }
    }

    // Helper functions
    function showError($element, message) {
        $element.addClass('form-error');
        $element.after(`<div class="error-message">${message}</div>`);
        $element.next('.error-message').fadeIn();
    }

    function showSuccessMessage() {
        const $successMsg = $('<div class="success-message">Rezervimi juaj u pranua me sukses! Do të kontaktoheni për konfirmim brenda 24 orëve.</div>');
        $('#reservationForm').before($successMsg);
        $successMsg.fadeIn();
        
        setTimeout(() => $successMsg.fadeOut(), 5000);
    }

    function resetFormStyles() {
        $('.form-group').removeClass('form-error form-success');
        $('.error-message').remove();
        $('.preview-item').removeClass('selected');
    }

    function getRoomIndex(roomType) {
        const rooms = ['standard', 'deluxe', 'suite', 'presidential'];
        return rooms.indexOf(roomType);
    }

    // Close mobile menu when clicking on a link
    $('.nav-links a').on('click', function() {
        $('.nav-links').removeClass('active');
        $('.hamburger').removeClass('active');
    });

    // Form field focus effects
    $('input, select, textarea').on('focus', function() {
        $(this).closest('.form-group').addClass('form-success');
        $(this).closest('.form-section').addClass('highlight-section');
    }).on('blur', function() {
        $(this).closest('.form-group').removeClass('form-success');
        $(this).closest('.form-section').removeClass('highlight-section');
    });

    // Process step animation on scroll
    $(window).on('scroll', function() {
        $('.step').each(function() {
            const elementTop = $(this).offset().top;
            const elementBottom = elementTop + $(this).outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('step-active');
            } else {
                $(this).removeClass('step-active');
            }
        });
    });

    // Room preview hover effects with jQuery
    $('.preview-item').hover(
        function() {
            $(this).find('.preview-image img').css('transform', 'scale(1.1)');
            $(this).css('transform', 'translateY(-10px)');
        },
        function() {
            $(this).find('.preview-image img').css('transform', 'scale(1)');
            $(this).css('transform', 'translateY(0)');
        }
    );

    // Click on room preview to select room type
    $('.preview-item').on('click', function() {
        const index = $(this).index();
        const roomTypes = ['standard', 'deluxe', 'suite', 'presidential'];
        
        $('.preview-item').removeClass('selected');
        $(this).addClass('selected');
        $('#roomType').val(roomTypes[index]).trigger('change');
        
        // Scroll to form
        $('html, body').animate({
            scrollTop: $('#roomType').offset().top - 100
        }, 500);
    });

    // FAQ accordion effect
    $('.faq-item h3').on('click', function() {
        $(this).next('p').slideToggle();
        $(this).parent('.faq-item').toggleClass('active');
    });

    // Initialize FAQ items
    $('.faq-item p').hide();
    $('.faq-item').first().addClass('active').find('p').show();

    // Add smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(e) {
        if ($(this).attr('href').length > 1) {
            e.preventDefault();
            const target = $(this.hash);
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 800);
            }
        }
    });

    // Payment method selection styling
    $('input[name="payment"]').on('change', function() {
        $('.payment-option').removeClass('selected');
        $(this).parent('.payment-option').addClass('selected');
    });

    // Initialize date field with tomorrow as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    $('#checkin').val(tomorrow.toISOString().split('T')[0]);
    
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    $('#checkout').val(dayAfterTomorrow.toISOString().split('T')[0]);
    $('#checkout').attr('min', $('#checkin').val());

    // Add active state to current nav link
    const currentPage = window.location.pathname.split('/').pop();
    $('.nav-links a').each(function() {
        if ($(this).attr('href') === currentPage) {
            $(this).addClass('active');
        }
    });

    // Form auto-save to localStorage (optional feature)
    function autoSaveForm() {
        const formData = {};
        $('#reservationForm').serializeArray().forEach(item => {
            formData[item.name] = item.value;
        });
        localStorage.setItem('reservationFormData', JSON.stringify(formData));
    }

    // Load saved form data
    const savedData = localStorage.getItem('reservationFormData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        Object.keys(formData).forEach(key => {
            $(`[name="${key}"]`).val(formData[key]);
        });
        
        // Show restore notification
        const $restoreMsg = $('<div class="success-message" style="background-color: #ff9900;">Formulari u rikthye automatikisht nga ruajtja e mëparshme.</div>');
        $('#reservationForm').before($restoreMsg);
        $restoreMsg.fadeIn().delay(3000).fadeOut();
    }

    // Auto-save on form change
    $('#reservationForm').on('change keyup', 'input, select, textarea', function() {
        autoSaveForm();
    });

    // Clear saved data on successful submission
    $('#reservationForm').on('submit', function() {
        localStorage.removeItem('reservationFormData');
    });

    console.log('Hotel SHAH Reservation System initialized with jQuery');
});
