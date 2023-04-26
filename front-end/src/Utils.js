export const dateFormat = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }

export function getTimeElapsedString(unixTimestamp) {
    unixTimestamp = new Date(unixTimestamp).getTime()
    const now = Date.now()
    const elapsed = now - unixTimestamp // Subtract now from unixTimestamp to get elapsed time

    // Calculate the number of minutes, hours, or days that have elapsed
    const minutes = Math.floor(elapsed / 60000) // 1 minute = 60,000 milliseconds
    const hours = Math.floor(elapsed / 3600000) // 1 hour = 3,600,000 milliseconds
    const days = Math.floor(elapsed / 86400000) // 1 day = 86,400,000 milliseconds
    // Return a string with the appropriate time elapsed unit
    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else {
        return 'just now'
    }
}

