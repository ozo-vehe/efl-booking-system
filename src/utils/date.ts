export const getDateRange = () => {
  const now = new Date(); // Get current date and time
  const hour = now.getHours();
  const startDate = new Date(now); // Clone the current date

  // If the time is past 5 PM, start from the next day
  if (hour >= 17) {
    startDate.setDate(startDate.getDate() + 1);
  }

  // Generate the range of 7 days, excluding weekends
  const range = [];
  const disabled_days = [];
  let i = 2;
  while (range.length < 7) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dayOfWeek = date.getDay();
    
    // Skip weekends (0 is Sunday, 6 is Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const available_day: string = `${
        date.getMonth() + 1
      }/${date.getDate()}/${date.getFullYear()}`;
      range.push(available_day);
    } else {
      const disabled_day: string = `${
        date.getMonth() + 1
      }/${date.getDate()}/${date.getFullYear()}`;
      disabled_days.push(disabled_day);
    }
    i++;
  }

  // getAvailableSlots(range);
  return { range, disabled_days };
};