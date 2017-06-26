// Helper to add days correctly to a js Date object (https://stackoverflow.com/a/563442)
Date.prototype.addDays = function(days) {
    var d = new Date(this.valueOf())
    d.setDate(d.getDate() + days);
    return d;
}

// Helper to get a Date object rounded to current day(no hours, seconds, etc)
Date.simpleToday = function() {
    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    return today;
}