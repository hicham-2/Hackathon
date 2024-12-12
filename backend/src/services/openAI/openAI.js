import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });

const openai = new OpenAI();

const planningRequest = {
    "courses": [
        { "id": 1, "name": "Mathématiques", "duration": 2, "priority": "high" },
        { "id": 2, "name": "Informatique", "duration": 3, "priority": "high" },
        { "id": 3, "name": "Physique", "duration": 1, "priority": "medium" },
        { "id": 4, "name": "Chimie", "duration": 2, "priority": "low" },
        { "id": 5, "name": "Biologie", "duration": 2, "priority": "medium" },
        { "id": 6, "name": "Histoire", "duration": 1, "priority": "medium" },
        { "id": 7, "name": "Géographie", "duration": 1, "priority": "low" },
        { "id": 8, "name": "Anglais", "duration": 2, "priority": "high" },
        { "id": 9, "name": "Français", "duration": 2, "priority": "medium" },
        { "id": 10, "name": "Sport", "duration": 1, "priority": "low" }
    ],
    "teachers": [
        {
            "id": 1,
            "name": "Prof. Dupont",
            "availability": {
                "Monday": ["09:00-11:00", "13:00-15:00"],
                "Tuesday": ["10:00-12:00", "16:00-18:00"],
                "Wednesday": ["09:00-11:00"],
                "Thursday": ["13:00-15:00", "16:00-18:00"],
                "Friday": ["09:00-11:00"]
            }
        },
        {
            "id": 2,
            "name": "Prof. Martin",
            "availability": {
                "Monday": ["10:00-12:00", "14:00-16:00"],
                "Tuesday": ["09:00-11:00", "14:00-16:00"],
                "Wednesday": ["10:00-12:00"],
                "Thursday": ["14:00-16:00"],
                "Friday": ["10:00-12:00", "14:00-16:00"]
            }
        },
        {
            "id": 3,
            "name": "Prof. Lefevre",
            "availability": {
                "Monday": ["08:00-10:00", "12:00-14:00"],
                "Tuesday": ["10:00-12:00"],
                "Wednesday": ["08:00-10:00", "12:00-14:00"],
                "Thursday": ["08:00-10:00"],
                "Friday": ["12:00-14:00"]
            }
        },
        {
            "id": 4,
            "name": "Prof. Bertrand",
            "availability": {
                "Monday": ["09:00-11:00", "15:00-17:00"],
                "Tuesday": ["09:00-11:00"],
                "Wednesday": ["15:00-17:00"],
                "Thursday": ["09:00-11:00"],
                "Friday": ["15:00-17:00"]
            }
        }
    ],
    "classes": [
        { "id": 1, "name": "Classe A", "studentsCount": 30 },
        { "id": 2, "name": "Classe B", "studentsCount": 25 },
        { "id": 3, "name": "Classe C", "studentsCount": 28 },
        { "id": 4, "name": "Classe D", "studentsCount": 32 },
        { "id": 5, "name": "Classe E", "studentsCount": 22 },
        { "id": 6, "name": "Classe F", "studentsCount": 26 }
    ],
    "rooms": [
        { "id": 1, "name": "Salle 101", "capacity": 35 },
        { "id": 2, "name": "Salle 102", "capacity": 30 },
        { "id": 3, "name": "Salle 103", "capacity": 20 },
        { "id": 4, "name": "Salle 104", "capacity": 40 },
        { "id": 5, "name": "Salle 105", "capacity": 25 },
        { "id": 6, "name": "Salle 106", "capacity": 35 }
    ],
    "constraints": {
        "max_daily_hours": 6,
        "breaks": "20 minutes every 2 hours",
        "max_classes_per_day": 4
    }
};


const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
        { 
            role: "system", 
            content: "You are a helpful assistant that optimizes schedules based on available teachers, classes, and time constraints." 
        },
        {
            role: "user",
            content: `Please generate an optimized schedule in JSON format based on the following data. Give me the full JSON: ${JSON.stringify(planningRequest)}`
        },
    ],
});

const schedule = completion.choices[0].message.content;

console.log(schedule);
