export const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
 
    const day = date.getUTCDate(); 
    const month = date.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
    const year = date.getUTCFullYear();
 
    const getSuffix = (d) => {
       if (d === 1 || d === 21 || d === 31) return "st";
       if (d === 2 || d === 22) return "nd";
       if (d === 3 || d === 23) return "rd";
       return "th";
    };
 
    return `${month} ${day}${getSuffix(day)}, ${year}`;
 };
 