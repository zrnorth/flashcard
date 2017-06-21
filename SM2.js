// SM2 is explained here: https://www.supermemo.com/english/ol/sm2.htm

exports.getUpdatedDifficulty = function(oldDifficulty, responseQuality) {
    var newDifficulty =  (oldDifficulty - 0.8) + 
                         (0.28 * responseQuality) - 
                         (0.02 * responseQuality * responseQuality);
    // difficulty has to be in the range [1.3, 2.5].
    if (newDifficulty < 1.3) {
        newDifficulty = 1.3;
    }
    else if (newDifficulty > 2.5) {
        newDifficulty = 2.5;
    }
    return round(newDifficulty, 4);
}

exports.getDaysUntilNextReview = function(reps, difficulty) {
    // if I(reps) == interval until next review,
    // I(0) == 0 -- this is not in the official alg, but i added it. requires 2 correct reviews on first day
    // I(1) == 1
    // I(2) == 6
    // n>2: I(n) == I(n-1) * difficulty.

    if (reps < 0) {
        throw 'Number of reps must be positive';
    }
    difficulty = round(difficulty, 6); // dealing with weird js decimal bullshit
    if (difficulty < 1.3 || difficulty > 2.5) {
        throw 'Difficulty rating must be between [1.3, 2.5]';
    }

    switch(reps) {
        case 0:
            return 0;
        case 1:
            return 1;
        case 2:
            return 6;
        default: // reps > 2
            return Math.ceil(this.getDaysUntilNextReview((reps - 1), difficulty) * difficulty);
    }
}

// helper to round a decimal: http://www.jacklmoore.com/notes/rounding-in-javascript/
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}