// Generated by CoffeeScript 1.6.3
var blacklist, chunker, recognizer, spotter, tagger;

tagger = require("./tagger");

recognizer = require("./helpers/recognizer");

chunker = require("./helpers/chunker");

blacklist = require("./helpers/blacklist");

spotter = (function() {
  var cleanup, rank, set_options;
  set_options = function(style) {
    var options;
    if (style == null) {
      style = "";
    }
    options = {};
    if (style === "verbose") {
      options.gerund = true;
      options.stick_adjectives = true;
      options.stick_prepositions = true;
      options.stick_the = true;
      options.want_quotations = true;
      options.subnouns = true;
      options.match_whole = true;
      options.case_sensitive = false;
      options.kill_numbers = false;
      options.kill_quotes = false;
    }
    if (style === "selective") {
      options.gerund = false;
      options.stick_adjectives = false;
      options.stick_prepositions = false;
      options.stick_the = false;
      options.subnouns = false;
      options.want_quotations = false;
      options.match_whole = false;
      options.kill_numbers = true;
      options.kill_quotes = true;
    }
    return options;
  };
  cleanup = function(nouns) {
    var i;
    for (i in nouns) {
      nouns[i].word = nouns[i].word.replace(/("|,|\)|\(|!)/g, "");
      nouns[i].word = nouns[i].word.replace(/'s$/, "");
      nouns[i].word = nouns[i].word.replace(/[\.\?,!:;\/\)]*$/, "");
      nouns[i].word = nouns[i].word.replace(/^[\(\/]*/g, "");
      nouns[i].word = nouns[i].word.replace(/[\(\/\)\\;:,]/g, " ");
      nouns[i].word = nouns[i].word.replace(RegExp("  ", "g"), " ");
      nouns[i].word = nouns[i].word.replace(/\W*$/, "");
      nouns[i].word = nouns[i].word.replace(/^\W*/, "");
      if (!nouns[i].word.match(/^the ./)) {
        nouns[i].word = singularize(nouns[i].word);
      }
      if (!options.case_sensitive) {
        nouns[i].word = nouns[i].word.toLowerCase();
      }
    }
    return nouns;
  };
  rank = function(results) {
    var i;
    for (i in results) {
      results[i].score = 0;
      results[i].score += results[i].count * 10;
      if (results[i].rule === "capital") {
        results[i].score += 10;
      }
      if (results[i].rule === "lexicon") {
        results[i].score += 7;
      }
      if (results[i].rule === "group_prep") {
        results[i].score -= 4;
      }
    }
    results = results.sort(function(a, b) {
      return b.score - a.score;
    });
    return results;
  };
  spotter = function(str, style) {
    var chunks, nouns, options, tags;
    if (str == null) {
      str = "";
    }
    if (style == null) {
      style = "selective";
    }
    console.log("here");
    options = set_options("selective");
    console.log("here");
    tags = tagger(str, options);
    console.log(tags);
    chunks = chunker(tags, options);
    console.log("here");
    nouns = recognizer(chunks, options);
    return nouns;
  };
  if (typeof define !== "undefined" && define.amd) {
    define([], function() {
      return spotter;
    });
  } else {
    if (typeof module !== "undefined" && module.exports) {
      module.exports = spotter;
    }
  }
  return spotter;
})();

// console.log(spotter("sally walked to the store"));
