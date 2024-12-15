import { Op } from "sequelize"; // Sequelize operator for comparisons
import { SequelizeService } from "./sequelize/sequelizeService.js";
export class PlanningGenerator {
  constructor(schoolDays, schoolHours, data) {
    this.schoolDays = schoolDays;
    this.schoolHours = schoolHours;
    this.data = data;
  }

  // Function to check if a room is available for a specific time range
  async firstRoomAvailable(allRooms, startDateTime, endDateTime) {
    const sequelizeService = await SequelizeService.get();
    let overlappingSlots = [];

    // Loop through each room and check if it's available
    for (const room of allRooms) {
      overlappingSlots = await sequelizeService.slotService.model.findAll({
        where: {
          room_id: room.id,
          [Op.or]: [
            {
              startDateTime: {
                [Op.between]: [startDateTime, endDateTime], // Check if event starts within the range
              },
            },
            {
              endDateTime: {
                [Op.between]: [startDateTime, endDateTime], // Check if event ends within the range
              },
            },
            {
              [Op.and]: [
                { startDateTime: { [Op.lte]: startDateTime } }, // Check if the event starts before and ends after
                { endDateTime: { [Op.gte]: endDateTime } },
              ],
            },
          ],
        },
      });
    }

    if (overlappingSlots.length === 0) {
      return allRooms[0]; // Return the first available room
    }

    // If no room is available, return null or a custom message
    return null; // No available room found
  }

  async addEventToRoom(
    courseId,
    professorId,
    roomId,
    startDateTime,
    endDateTime
  ) {
    if (!isAvailable) {
      console.log("Room is already booked during this time.");
      return; // Or handle this case appropriately, like scheduling for the next available slot
    }

    // Room is available, create a new slot (event)
    try {
      const newSlot = await Slot.create({
        startDateTime,
        endDateTime,
        room_id: roomId,
        course_id: courseId,
        classe_id: professorId, // Assuming you have a relation to professors or classes here
      });

      console.log("Event added successfully:", newSlot);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  }

  isProfessorAvailable(professorId, dateTime, duration) {
    const startTime = new Date(dateTime);
    const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000); // Add duration in hours

    return this.data.professorsAvailable.some((availability) => {
      const availableStart = new Date(availability.start_datetime);
      const availableEnd = new Date(availability.end_datetime);

      return (
        availability.user_id === professorId &&
        availability.is_available &&
        startTime >= availableStart &&
        endTime <= availableEnd
      );
    });
  }
  isProfessorMaybeAvailable(professorId, startDateTime, durationInHours) {
    // Get the start and end time of the requested slot
    const startTime = new Date(startDateTime);
    const endTime = new Date(
      startTime.getTime() + durationInHours * 60 * 60 * 1000
    ); // Duration in milliseconds

    // Check if the professor has any availability for the requested time
    return !this.data.professorsAvailable.some((availability) => {
      const availableStart = new Date(availability.start_datetime);
      const availableEnd = new Date(availability.end_datetime);

      return (
        availability.user_id === professorId &&
        !availability.is_available &&
        startTime >= availableStart &&
        endTime <= availableEnd
      );
    });
  }

  getNextSchoolDay(currentDate) {
    let nextDate = new Date(currentDate);

    // Assuming schoolDays is an array like ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    do {
      nextDate.setDate(nextDate.getDate() + 1); // Move to the next day
    } while (
      !this.schoolDays.includes(
        nextDate.toLocaleDateString("en-US", { weekday: "long" }) // Check if the day is a valid school day
      ) ||
      nextDate.getDay() === 0 // Exclude Sunday (getDay() === 0 for Sunday)
    );

    return nextDate;
  }

  async addEventToRoom(
    courseID,
    professorId,
    roomId,
    startDateTime,
    endDateTime
  ) {
    const sequelizeService = await SequelizeService.get();

    const newSlot = await sequelizeService.slotService.model.create({
      startDateTime,
      endDateTime,
      room_id: roomId,
      course_id: courseID,
      classe_id: professorId, // Assuming you have a relation to professors or classes here
    });
  }

  async generateSchoolSchedule() {
    const planning = [];
    const sequelizeService = await SequelizeService.get();

    try {
      const allRooms = await sequelizeService.roomService.model.findAll(); // Get all rooms
      // Start scheduling
      let currentDate = new Date(); // Start today
      if (currentDate.getDay() === 0) {
        currentDate = this.getNextSchoolDay(currentDate);
      }

      currentDate.setHours(10, 0, 0, 0); // Start at 10:00 AM

      // Loop through each course
      for (const course of this.data.courses) {
        let remainingHours = course.duration;

        // Find professors teaching this course
        const courseProfessors = this.data.professors.filter((prof) =>
          prof.courses.some((c) => c.id === course.id)
        );

        while (remainingHours > 0) {
          for (const session of this.schoolHours) {
            const sessionStart = new Date(currentDate);
            const [startHours, startMinutes] = session.start.split(":");
            sessionStart.setHours(startHours, startMinutes);

            // Check if a professor is available during this time
            const availableProfessor = courseProfessors.find((prof) =>
              this.isProfessorAvailable(prof.id, sessionStart, 3)
            );

            const professorMaybeAvailable = courseProfessors.find((prof) =>
              this.isProfessorMaybeAvailable(prof.id, sessionStart, 3)
            );
            // Check if the room is available
            const isRoomAvailable = await this.firstRoomAvailable(
              allRooms,
              sessionStart,
              sessionStart.getTime() + 3 * 60 * 60 * 1000
            );

            if (isRoomAvailable) {
              if (availableProfessor && remainingHours > 0) {
                // Schedule the class
                planning.push({
                  title: `Cour de ${course.name} avec ${availableProfessor.firstName} ${availableProfessor.lastName} | ${isRoomAvailable.name}`,
                  start: sessionStart.toISOString(),
                  end: new Date(
                    sessionStart.getTime() + 3 * 60 * 60 * 1000
                  ).toISOString(), // 3 hours added
                  backgroundColor: "blue",
                });

                title: `Cour de ${course.name} (à confirmer) avec ${professorMaybeAvailable.firstName} ${professorMaybeAvailable.lastName}`,
                this.addEventToRoom(
                  course.id,
                  availableProfessor.id,
                  isRoomAvailable.id,
                  sessionStart,
                  new Date(sessionStart.getTime() + 3 * 60 * 60 * 1000)
                );

                // Deduct 3 hours from remaining hours
              } else if (professorMaybeAvailable && remainingHours > 0) {
                planning.push({
                  title: `Cour de ${course.name} (à confirmer) avec ${professorMaybeAvailable.firstName} ${professorMaybeAvailable.lastName} | ${isRoomAvailable.name}`,
                  start: sessionStart.toISOString(),
                  end: new Date(
                    sessionStart.getTime() + 3 * 60 * 60 * 1000
                  ).toISOString(), // 3 hours added
                  backgroundColor: "green",
                });

                this.addEventToRoom(
                  course.id,
                  professorMaybeAvailable.id,
                  isRoomAvailable.id,
                  sessionStart,
                  new Date(sessionStart.getTime() + 3 * 60 * 60 * 1000)
                );
              }

              remainingHours -= 3;
            }
          }

          // Move to the next valid school day
          currentDate = this.getNextSchoolDay(currentDate);
          currentDate.setHours(10, 0, 0, 0); // Reset to 10:00 AM
        }
      }

      return planning;
    } catch (error) {
      console.log("Error generating school schedule", error);
    }
  }
}
