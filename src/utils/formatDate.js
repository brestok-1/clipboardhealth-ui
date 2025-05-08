export const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
 
    const day = date.getDate(); 
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timeString = `${formattedHours}:${formattedMinutes}`;
 
    const getSuffix = (d) => {
       if (d === 1 || d === 21 || d === 31) return "st";
       if (d === 2 || d === 22) return "nd";
       if (d === 3 || d === 23) return "rd";
       return "th";
    };
 
    return `${month} ${day}${getSuffix(day)}, ${year} ${timeString}`;
 };
 