// Calculate the start date based on the type (weekly or monthly)
exports.calculateStartDate = (type) => {
  const currentDate = new Date();
  if (type === 'weekly') {
    // For weekly goals, set the start date to the first day of the current week
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
  } else if (type === 'monthly') {
    // For monthly goals, set the start date to the first day of the current month
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  }
};
