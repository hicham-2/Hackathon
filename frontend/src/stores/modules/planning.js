import openaiService from '@/services/openaiService'
import planningService from '@/services/planningService'

export default {
  namespaced: true,
  
  state: {
    timeSlots: [],
    conflicts: [],
    currentSchedule: null,
    professorConstraints: [],
    roomAvailability: {},
    aiSuggestions: []
  },

  mutations: {
    SET_TIMESLOTS(state, timeSlots) {
      state.timeSlots = timeSlots
    },
    ADD_CONFLICT(state, conflict) {
      state.conflicts.push(conflict)
    },
    UPDATE_SCHEDULE(state, schedule) {
      state.currentSchedule = schedule
    },
    SET_PROFESSOR_CONSTRAINTS(state, constraints) {
      state.professorConstraints = constraints
    }
  },

  actions: {
    async generateSchedule({ commit, state }) {
      try {
        const constraints = {
          professors: state.professorConstraints,
          rooms: state.roomAvailability,
          currentSchedule: state.currentSchedule
        }
        
        const suggestions = await openaiService.optimizePlanning(constraints)
        const newSchedule = await planningService.implementSchedule(suggestions)
        
        commit('UPDATE_SCHEDULE', newSchedule)
        return { success: true, schedule: newSchedule }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    async checkConflicts({ commit }, timeSlot) {
      const conflicts = await planningService.checkConflicts(timeSlot)
      if (conflicts.length > 0) {
        commit('ADD_CONFLICT', conflicts[0])
        return conflicts[0]
      }
      return null
    }
  }
}