<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Contenu principal -->
    <div class="planning-page flex-1 p-8 bg-gray-100">
      <h1 class="text-3xl font-bold mb-4">Planning</h1>
     
      <div class="calendar-container">
        <FullCalendar
          ref="calendar"
          :options="calendarOptions"
        />
      </div>
    </div>
  </div>
</template>

<script>
import frLocale from '@fullcalendar/core/locales/fr';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendar from '@fullcalendar/vue3';
import Sidebar from '../components/common/Sidebar.vue';

export default {
  name: 'Planning',
  components: {
    Sidebar,
    FullCalendar,
    
    
  },
  data() {
    return {
      calendarOptions: {
        plugins: [timeGridPlugin, interactionPlugin ],
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
          right: 'timeGridDay,timeGridWeek'
        },
        eventClick: this.handleEventClick,
        select: this.handleDateSelect,
        eventChange: this.handleEventChange,
        events: [],
        eventTimeFormat: {
          hour: 'numeric',
          minute: '2-digit',
          meridiem: false,
        },
        eventContent: (info) => {
          return {
            html: `
              <div>
                <strong>${info.event.title}</strong>
                <br>
                ${info.timeText}
              </div>
            `,
          };
        },
      },
    };
  },
  methods: {
    handleDateSelect(selectInfo) {
      const title = 'Disponible';
      const calendarApi = selectInfo.view.calendar;
      calendarApi.addEvent({
        title,
        start: selectInfo.start,
        end: selectInfo.end,
        backgroundColor: '#4CAF50',
      });
    },
    handleEventClick(clickInfo) {
      if (confirm('Supprimer cette disponibilité ?')) {
        clickInfo.event.remove();
      }
    },
    handleEventChange(changeInfo) {
      // Mettre à jour les données du calendrier en fonction des modifications
    },
  },
};
</script>

<style scoped>
.planning-page {
  padding: 20px;
  background-color: #f7fafc;
}

.planning-page h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.calendar-container {
  width: 100%;
  max-width: 1200px;
}
</style>
