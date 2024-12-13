<template>
    <div class="calendar-container">
      <div ref="calendarEl"></div>
      <conflict-alert v-if="showConflictAlert" 
        :conflict="currentConflict" 
        @resolve="resolveConflict"
      />
    </div>
  </template>
  
  <script>
  import { Calendar } from '@fullcalendar/core'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
  
  export default {
    setup() {
      const calendarEl = ref(null)
      const store = useStore()
      const showConflictAlert = ref(false)
      const currentConflict = ref(null)
  
      const handleEventDrop = async (info) => {
        const conflict = await store.dispatch('planning/checkConflicts', {
          event: info.event,
          newTime: info.event.start
        })
        
        if (conflict) {
          showConflictAlert.value = true
          currentConflict.value = conflict
          info.revert()
        }
      }
  
      onMounted(() => {
        const calendar = new Calendar(calendarEl.value, {
          plugins: [timeGridPlugin, interactionPlugin],
          initialView: 'timeGridWeek',
          events: store.state.planning.timeSlots,
          editable: true,
          eventOverlap: false,
          eventDrop: handleEventDrop,
          slotMinTime: '08:00:00',
          slotMaxTime: '20:00:00',
          businessHours: {
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: '08:00',
            endTime: '20:00',
          }
        })
        calendar.render()
      })
  
      return {
        calendarEl,
        showConflictAlert,
        currentConflict
      }
    }
  }
  </script>