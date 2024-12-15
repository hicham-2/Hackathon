<template>
  <div class="flex min-h-screen">
    <Sidebar />
    <div class="flex-1 mx-20">
      <!-- Header avec les contrôles -->
      <div class="bg-white shadow-sm p-6">
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-semibold text-gray-800">Planning</h1>
            <div class="flex space-x-4"></div>
          </div>
 
          <!-- Inputs pour les dates et heures -->
          
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
  
 };
 </script>
 
