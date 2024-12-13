/* eslint-disable no-undef */
// services/planningService.js
export default {
    async generateAutomaticPlanning() {
      const aiSuggestions = await openaiService.optimizePlanning()
      return this.implementSuggestions(aiSuggestions)
    },
    
    async checkConflicts(timeSlot) {
      const conflicts = await this.verifyConflicts(timeSlot) // vérification des conflits
      if (conflicts.length > 0) {
        return await openaiService.resolveConflicts(conflicts)
      }
    }
  }