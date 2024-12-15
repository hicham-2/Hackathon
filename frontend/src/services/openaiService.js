import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.VUE_APP_OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

export default {
  async optimizePlanning(constraints) {
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: `Tu es un expert en planification de cours. 
          Optimise le planning en tenant compte des contraintes suivantes:
          - Disponibilité des professeurs
          - Capacité des salles
          - Durée des cours
          - Contraintes horaires`
        }, {
          role: "user",
          content: JSON.stringify(constraints)
        }]
      })
      
      return this.parseSuggestions(response.data.choices[0].message.content)
    } catch (error) {
      console.error('Erreur OpenAI:', error)
      throw error
    }
  },

  parseSuggestions(aiResponse) {
    // Convertir la réponse en format utilisable
    try {
      return JSON.parse(aiResponse)
    } catch {
      return {
        success: false,
        message: "Impossible de parser la réponse"
      }
    }
  }
}