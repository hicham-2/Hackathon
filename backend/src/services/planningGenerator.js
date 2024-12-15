export class PlanningGenerator {
  constructor(schoolDays, schoolHours, data) {
    this.schoolDays = schoolDays;
    this.schoolHours = schoolHours;
    this.data = data;
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

  generateSchoolSchedule() {
    const planning = [];
    try {
      // Start scheduling
      let currentDate = new Date(); // Start today
      if (currentDate.getDay() === 0) {
        currentDate = this.getNextSchoolDay(currentDate);
      }

      currentDate.setHours(10, 0, 0, 0); // Start at 10:00 AM

      // Loop through each course
      this.data.courses.forEach((course) => {
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

            if (availableProfessor && remainingHours > 0) {
              // Schedule the class
              planning.push({
                title: `Cour de ${course.name} avec ${availableProfessor.firstName} ${availableProfessor.lastName}`,
                start: sessionStart.toISOString(),
                end: new Date(
                  sessionStart.getTime() + 3 * 60 * 60 * 1000
                ).toISOString(), // 3 hours added
                backgroundColor: "blue",
              });

              // Deduct 3 hours from remaining hours
            } else if (professorMaybeAvailable && remainingHours > 0) {
              planning.push({
                title: `Cour de ${course.name} (à confirmer) avec ${professorMaybeAvailable.firstName} ${professorMaybeAvailable.lastName}`,
                start: sessionStart.toISOString(),
                end: new Date(
                  sessionStart.getTime() + 3 * 60 * 60 * 1000
                ).toISOString(), // 3 hours added
                backgroundColor: "green",
              });
            }
            remainingHours -= 3;
          }

          // Move to the next valid school day
          currentDate = this.getNextSchoolDay(currentDate);
          currentDate.setHours(10, 0, 0, 0); // Reset to 10:00 AM
        }
      });

      return planning;
    } catch (error) {
      console.log("Error generating school schedule", error);
    }
  }
}
