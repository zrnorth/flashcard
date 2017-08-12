// --- This has been imported from wanakana.js: https://github.com/WaniKani/WanaKana

// These are the range of Kanji values in Unicode.
const UNICODE_KANJI_START = 0x4E00;
const UNICODE_KANJI_END = 0x9FAF;

/**
 * Checks if input string is empty
 * @param  {String} input text input
 * @return {Boolean} true if no input
 */
function isEmpty(input) {
  if (typeof input !== 'string') {
    return true;
  }
  return !input.length;
}

/**
 * Takes a character and a unicode range. Returns true if the char is in the range.
 * @param  {String}  char  unicode character
 * @param  {Number}  start unicode start range
 * @param  {Number}  end   unicode end range
 * @return {Boolean}
 */
function isCharInRange(char = '', start, end) {
  if (isEmpty(char)) return false;
  const code = char.charCodeAt(0);
  return start <= code && code <= end;
}

/**
 * Tests a character. Returns true if the character is a CJK ideograph (kanji).
 * @param  {String} char character string to test
 * @return {Boolean}
 */
exports.isCharKanji = function isCharKanji(char = '') {
  return isCharInRange(char, UNICODE_KANJI_START, UNICODE_KANJI_END);
}

// --- End of Wanakana.js code. My own code begins below.

function getJishoWebAddress(kanjiToSearch = '') {
  return `http://jisho.org/search/${kanjiToSearch}%20%23kanji`;
}

exports.getLookupsForAllKanjiInString = function getLookupsForAllKanjiInString(str = '') {
  var ret = [];
  for (var i = 0; i < str.length; i++) {
    const c = str.charAt(i);
    if (this.isCharKanji(c)) {
      ret.push({
        kanji: c,
        url: getJishoWebAddress(c)
      });
    }
  }
  return ret;
}