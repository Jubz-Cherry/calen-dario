document.addEventListener('DOMContentLoaded', function () {
  console.log('main.js carregado!');

  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'pt-br'
  });

  calendar.render();
});
