document.addEventListener('DOMContentLoaded', () => {
    const serviceButtons = document.querySelectorAll('.service-btn');
    const scheduleSection = document.getElementById('schedule');
    const datePicker = document.getElementById('datePicker');
    const timeSlotsDiv = document.getElementById('timeSlots');
    const confirmationSection = document.getElementById('confirmation');
    const bookingForm = document.getElementById('bookingForm');

    let selectedService = '';
    let selectedDate = '';
    let selectedTime = '';

    serviceButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedService = button.dataset.service;
            scheduleSection.classList.remove('hidden');
        });
    });

    datePicker.addEventListener('change', (e) => {
        selectedDate = e.target.value;
        generateTimeSlots(selectedDate);
    });

    timeSlotsDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('time-slot')) {
            selectedTime = e.target.dataset.time;
            confirmationSection.classList.remove('hidden');
        }
    });

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        scheduleAppointment(selectedService, selectedDate, selectedTime, name, phone);
    });

    function generateTimeSlots(date) {
        const day = new Date(date).getDay();
        let slots = [];
        
        if (day >= 1 && day <= 5) { // Monday to Friday
            slots = generateSlots(8, 12).concat(generateSlots(14, 20));
        } else if (day === 6) { // Saturday
            slots = generateSlots(8, 12).concat(generateSlots(14, 17));
        } else {
            slots = [];
        }

        timeSlotsDiv.innerHTML = slots.map(slot => `<button class="time-slot" data-time="${slot}">${slot}</button>`).join('');
    }

    function generateSlots(startHour, endHour) {
        let slots = [];
        for (let hour = startHour; hour < endHour; hour++) {
            slots.push(`${hour}:00 - ${hour + 1}:00`);
        }
        return slots;
    }

    function scheduleAppointment(service, date, time, name, phone) {
        gapi.load('client:auth2', () => {
            gapi.auth2.init({client_id: 'YOUR_CLIENT_ID'}).then(() => {
                gapi.client.load('calendar', 'v3', () => {
                    const event = {
                        'summary': service,
                        'description': `Cliente: ${name}, Telefone: ${phone}`,
                        'start': {
                            'dateTime': `${date}T${time.split(' - ')[0]}:00:00`,
                            'timeZone': 'America/Sao_Paulo'
                        },
                        'end': {
                            'dateTime': `${date}T${time.split(' - ')[1]}:00:00`,
                            'timeZone': 'America/Sao_Paulo'
                        }
                    };

                    gapi.client.calendar.events.insert({
                        'calendarId': 'primary',
                        'resource': event
                    }).then((response) => {
                        console.log('Event created: ', response.htmlLink);
                        alert('Agendamento Confirmado!');
                    });
                });
            });
        });
    }
});
