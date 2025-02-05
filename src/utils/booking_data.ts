export const getDateRange = () => {
  const now = new Date(); // Get current date and time
  const hour = now.getHours();
  const startDate = new Date(now); // Clone the current date

  // If the time is past 5 PM, start from the next day
  if (hour >= 17) {
    startDate.setDate(startDate.getDate() + 1);
  }

  // Generate the range of 7 days
  const range = [];
  for (let i = 8; i < 15; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const available_day: string = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

    range.push(available_day);  }
  
  // getAvailableSlots(range);
  return range;
};
