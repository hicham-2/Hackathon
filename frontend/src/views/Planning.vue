<template>
  <div class="flex min-h-screen">
    <Sidebar />
    <div class="flex-1 mx-24">
      <!-- Header avec les contrôles -->
      <div class="bg-white shadow-sm p-6">
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-semibold text-gray-800">Planning</h1>
            <div class="flex space-x-4"></div>
          </div>

          <!-- Filtres -->
          <div class="grid grid-cols-2 gap-4 mt-4">
            <!-- Filtre Filières -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Filière</label>
              <select 
                v-model="filters.sector"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                @change="changeSector"
              >
                <option value="">Toutes les filières</option>
                <option v-for="sector in sectors" :key="sector.id" :value="sector.id">
                  {{ sector.name }}
                </option>
              </select>
            </div>

            <!-- Filtre Classes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Classes</label>
              <select 
                v-model="filters.classe"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                @change="fetchAvailabilities"
              >
                <option value="">Toutes les classes</option>
                <option v-for="classe in classes" :key="classe.id" :value="classe.id">
                  {{ classe.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendrier -->
      <div class="p-6">
        <div class="bg-white rounded-xl shadow-sm">
          <FullCalendar ref="calendar" :options="calendarOptions" />
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
      filters: {
        sector: '',
        classe: '',
      },
      sectors: [],
      classes: [],
      calendarOptions: {
        plugins: [timeGridPlugin, interactionPlugin],
        initialView: 'timeGridWeek',
        locale: frLocale,
        selectable: true,
        editable: true,
        selectMirror: true,
        weekends: true,
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
  async mounted() {
    await this.fetchSectors();
    await this.fetchClasses();
  },

  methods: {
    async fetchSectors() {
      try {
        const response = await fetch('http://localhost:8080/sector');
        if (!response.ok) throw new Error('Erreur lors de la récupération des sectors');

        const sectors = await response.json();
        this.sectors = sectors;
      } catch (error) {
        console.error('Erreur lors de la récupération des sectors:', error);
      }
    },
    async fetchClasses() {
      try {
        const response = await fetch('http://localhost:8080/sector/classes');
        if (!response.ok) throw new Error('Erreur lors de la récupération des classes');

        const classes = await response.json();
        this.classes = classes;
      } catch (error) {
        console.error('Erreur lors de la récupération des classes:', error);
      }
    },
    async fetchAvailabilities() {
      const token = localStorage.getItem('token');

      if (!token) {
        alert("Utilisateur non trouvé. Veuillez vous connecter.");
        return;
      }

      try {

        const response = await fetch(`http://localhost:8080/planning/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            classId: this.filters.classe,
          }),
        });

        if (!response.ok) throw new Error("Erreur lors de la récupération du planning.");

        const availabilities = await response.json();

        this.calendarOptions.events = availabilities;
      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
      }
    },
    handleDateSelect(selectInfo) {
      const title = 'Disponible';
      const calendarApi = selectInfo.view.calendar;
      calendarApi.addEvent({
        title,
        start: selectInfo.start,
        end: selectInfo.end,
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
        textColor: '#ffffff',
      });
    },

    handleEventClick(clickInfo) {
      if (confirm('Supprimer cet événement ?')) {
        clickInfo.event.remove();
      }
    },

    handleEventChange(changeInfo) {
      // Mettre à jour les données du calendrier en fonction des modifications
      console.log("Événement modifié:", changeInfo.event);
    },
  }
};
</script>