<template>
  <div class="calendar-container overflow-y-auto">
    <FullCalendar
      ref="calendar"
      :options="calendarOptions"
    />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'

export default {
  name: 'GlobalCalendarViewÒ',
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarOptions: {
        plugins: [timeGridPlugin, interactionPlugin],
        initialView: 'timeGridWeek',
        locale: frLocale,
        selectable: true,
        editable: true,
        selectMirror: true,
        weekends: false,
        slotMinTime: '08:00:00',
        slotMaxTime: '20:00:00',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,timeGridDay'
        },
        eventClick: this.handleEventClick,
        select: this.handleDateSelect,
        eventChange: this.handleEventChange,
        events: [
          // Données initiales des événements
        ],
        eventTimeFormat: {
          hour: 'numeric',
          minute: '2-digit',
          meridiem: false
        },
        eventContent: (info) => {
          return {
            html: `
              <div>
                <strong>${info.event.title}</strong>
                <br>
                ${info.timeText}
              </div>
            `
          }
        }
      }
    }
  },
  methods: {
    handleDateSelect(selectInfo) {
      const title = 'Disponible'
      const calendarApi = selectInfo.view.calendar
      calendarApi.addEvent({
        title,
        start: selectInfo.start,
        end: selectInfo.end,
        backgroundColor: '#4CAF50'
      })
    },
    handleEventClick(clickInfo) {
      if (confirm('Supprimer cette disponibilité ?')) {
        clickInfo.event.remove()
      }
    },
    handleEventChange(changeInfo) {
      // Mettre à jour les données du calendrier en fonction des modifications
    }
  }
}
</script>

<style scoped>
.calendar-container {
  width: 100%;
  max-width: 1200px;
}
</style>