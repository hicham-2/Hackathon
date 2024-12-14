<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />
    
    <!-- Contenu principal -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow-sm px-8 py-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-semibold text-gray-800">Planning</h1>
          <div class="flex space-x-4">
            <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Aujourd'hui
            </button>
          </div>
        </div>
      </header>

      <!-- Contenu du calendrier -->
      <div class="flex-1 p-8">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <FullCalendar
            ref="calendar"
            :options="calendarOptions"
            class="fc-theme-standard"
          />
        </div>
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
          left: 'prev,next',
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
        eventContent: (info) => ({
          html: `
            <div class="p-2">
              <div class="font-semibold">${info.event.title}</div>
              <div class="text-sm mt-1">${info.timeText}</div>
            </div>
          `
        }),
        // Personnalisation supplémentaire
        height: 'auto',
        allDaySlot: false,
        slotDuration: '01:00:00',
        businessHours: {
          daysOfWeek: [1, 2, 3, 4, 5],
          startTime: '08:00',
          endTime: '20:00',
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
        backgroundColor: '#4F46E5', // Couleur Indigo de Tailwind
        borderColor: '#4F46E5',
        textColor: '#ffffff',
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

<style>
/* Personnalisation du calendrier */
:deep(.fc) {
  @apply font-sans;
}

:deep(.fc-toolbar-title) {
  @apply text-gray-800 text-xl font-semibold;
}

:deep(.fc-button-primary) {
  @apply bg-gray-100 text-gray-700 border-0 shadow-sm hover:bg-gray-200 !important;
}

:deep(.fc-button-primary:not(:disabled).fc-button-active) {
  @apply bg-indigo-600 text-white !important;
}

:deep(.fc-timegrid-slot) {
  @apply h-16 !important;
}

:deep(.fc-timegrid-event) {
  @apply rounded-md shadow-sm !important;
}

:deep(.fc-event) {
  @apply border-0 rounded-lg overflow-hidden;
}

:deep(.fc-scrollgrid) {
  @apply border-gray-200;
}

:deep(.fc-col-header-cell) {
  @apply bg-gray-50 py-4;
}

:deep(.fc-timegrid-axis) {
  @apply border-r border-gray-200;
}

:deep(.fc-timegrid-slot-label) {
  @apply text-sm text-gray-600;
}
</style>