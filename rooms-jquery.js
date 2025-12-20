$(document).ready(function () {

    /* ===============================
       MOBILE MENU
    ================================ */
    $('.hamburger').on('click', function () {
        $('.nav-links').toggleClass('active');
        $(this).toggleClass('active');
    });

    /* ===============================
       RESERVE ROOM & REDIRECT
    ================================ */
    $('.btn-room').on('click', function (e) {
        if ($(this).text().trim() === 'Rezervo') {
            e.preventDefault();

            const roomName = $(this)
                .closest('.room-card')
                .find('.room-title')
                .text();

            // Ruaj dhomën e zgjedhur
            localStorage.setItem('selectedRoom', roomName);

            // Shko te faqja e rezervimit
            window.location.href = 'rezervimi.html';
        }
    });

    console.log('Rooms page (jQuery) loaded');
});
$(document).ready(function () {

    const selectedRoom = localStorage.getItem('selectedRoom');

    if (selectedRoom) {
        const roomMap = {
            "Dhoma Superiore": "standard",
            "Dhoma Deluxe": "deluxe",
            "Grand Deluxe": "suite",
            "Deluxe Triple": "suite",
            "Dhoma Familjare": "suite",
            "Suite Ekzekutiv": "presidential",
            "Emerald Suite": "presidential"
        };

        if (roomMap[selectedRoom]) {
            $('#roomType').val(roomMap[selectedRoom]).trigger('change');
        }
    }

});

