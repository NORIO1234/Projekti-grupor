// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Form Validation and Submission
const reservationForm = document.getElementById('reservationForm');

if (reservationForm) {
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const checkin = document.getElementById('checkin').value;
        const checkout = document.getElementById('checkout').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const roomType = document.getElementById('roomType').value;
        const terms = document.getElementById('terms').checked;
        
        if (!checkin || !checkout || !firstName || !lastName || !email || !phone || !roomType) {
            alert('Ju lutem plotësoni të gjitha fushat e detyrueshme.');
            return;
        }
        
        if (!terms) {
            alert('Ju duhet të pranoni kushtet dhe kushtet për të vazhduar.');
            return;
        }
        
        // Check if check-in date is before check-out date
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        
        if (checkinDate >= checkoutDate) {
            alert('Data e check-out duhet të jetë pas datës së check-in.');
            return;
        }
        
        // Calculate number of nights
        const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        if (nights <= 0) {
            alert('Ju duhet të rezervoni të paktën 1 natë.');
            return;
        }
        
        // If all validations pass
        const roomPrices = {
            'standard': 89,
            'deluxe': 129,
            'suite': 199,
            'presidential': 299
        };
        
        const totalPrice = roomPrices[roomType] * nights;
        
        alert(`Rezervimi juaj u pranua me sukses!\n\nDetajet e rezervimit:\n- Emri: ${firstName} ${lastName}\n- Data e check-in: ${checkin}\n- Data e check-out: ${checkout}\n- Numri i netëve: ${nights}\n- Lloji i dhomës: ${roomType}\n- Çmimi total: €${totalPrice}\n\nDo të kontaktoheni së shpejti për konfirmim.`);
        reservationForm.reset();
    });
}

// Set minimum date for check-in to today
const today = new Date().toISOString().split('T')[0];
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');

if (checkinInput) {
    checkinInput.setAttribute('min', today);
}

// Update check-out min date when check-in changes
if (checkinInput && checkoutInput) {
    checkinInput.addEventListener('change', function() {
        const checkinDate = this.value;
        checkoutInput.setAttribute('min', checkinDate);
        
        // If checkout date is before new checkin date, reset it
        if (checkoutInput.value && checkoutInput.value < checkinDate) {
            checkoutInput.value = '';
        }
    });
}

// Room type change handler
const roomTypeSelect = document.getElementById('roomType');
if (roomTypeSelect) {
    roomTypeSelect.addEventListener('change', function() {
        // You can add dynamic pricing updates here
        console.log('Room type selected:', this.value);
    });
}

// Close mobile menu when clicking on a link
const navLinksItems = document.querySelectorAll('.nav-links a');
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});