// Generated by CoffeeScript 1.6.3
var chunker, chunks, data, nouns, options, recognizer, set_options, str, tag, tags, tokenizer, words;

data = require("./helpers/data");

recognizer = require("./helpers/recognizer");

chunker = require("./helpers/chunker");

tokenizer = require("./helpers/tokenizer");

tag = (function() {
  var suggest_adjective_phrase, suggest_adverb_phrase, suggest_noun_phrase, suggest_verb_phrase;
  suggest_noun_phrase = function(o, rule, results, options) {
    var i, top;
    top = results.length;
    i = o + 1;
    while (i < top) {
      if (results[i].pos.parent === "noun") {
        return results;
      }
      if (results[i].pos.parent === "verb" && results[i].pos.tag !== "RB") {
        results[i].pos = data.parts_of_speech["NN"];
        results[i].rule = rule;
        return results;
      }
      if (results[i + 1]) {
        if (results[i].pos.parent === "adj" || results[i].pos.tag === "RB") {
          results[i].pos.parent = "adjective";
          results[i].rule = rule;
        }
      } else {
        results[i].pos = data.parts_of_speech["NN"];
        results[i].rule = rule;
      }
      i++;
    }
    return results;
  };
  suggest_verb_phrase = function(o, rule, results, options) {
    var i, top;
    top = results.length;
    i = o + 1;
    while (i < top) {
      if (results[i].pos.parent === "verb") {
        return results;
      }
      if (results[i].pos.parent === "noun") {
        results[i].pos = data.parts_of_speech["VB"];
        results[i].rule = rule;
        return results;
      }
      if (results[i + 1]) {
        if (results[i].pos.parent === "adj" || results[i].pos.tag === "RB") {
          results[i].pos.parent = "verb";
          results[i].rule = rule;
        }
      } else {
        results[i].pos = data.parts_of_speech["VB"];
        results[i].rule = rule;
      }
      i++;
    }
    return results;
  };
  suggest_adjective_phrase = function(o, rule, results, options) {
    var i, top;
    top = results.length;
    i = o + 1;
    while (i < top) {
      if (results[i].pos.parent === "adjective") {
        return results;
      }
      if (results[i].pos.tag === "DT" || results[i].pos.tag === "CP") {
        return results;
      }
      if (results[i].pos.parent === "noun" || results[i].pos.parent === "verb") {
        results[i].pos = data.parts_of_speech["JJ"];
        results[i].rule = rule;
        return results;
      }
      if (results[i + 1]) {
        if (results[i].pos.tag === "RB") {
          results[i].pos.parent = "adjective";
          results[i].rule = rule;
        }
      } else {
        if (options.strong) {
          results[i].pos = data.parts_of_speech["JJ"];
          results[i].rule = rule;
        }
      }
      i++;
    }
    return results;
  };
  suggest_adverb_phrase = function(o, rule, results, options) {
    var i, top;
    top = results.length;
    i = o + 1;
    while (i < top) {
      if (results[i].pos.parent === "adjective" || results[i].pos.parent === "verb") {
        return results;
      }
      if (results[i].pos.parent === "noun") {
        results[i].pos = data.parts_of_speech["JJ"];
        results[i].rule = rule;
        return results;
      }
      if (results[i + 1]) {
        if (results[i].pos.tag === "RB") {
          results[i].pos.parent = "adjective";
          results[i].rule = rule;
        }
      } else {
        if (options.strong) {
          results[i].pos = data.parts_of_speech["JJ"];
          results[i].rule = rule;
        }
      }
      i++;
    }
    return results;
  };
  tag = function(words, options) {
    var i, last, lex, o, patterns, results, word;
    results = [];
    for (i in words) {
      word = words[i];
      results[i] = {
        word: word,
        pos: null,
        clues: []
      };
      patterns = [
        {
          reg: /[a-z]\-[a-z]/,
          pos: "JJ"
        }, {
          reg: /^de\-[a-z]../,
          pos: "VB"
        }, {
          reg: /^un\-[a-z]../,
          pos: "VB"
        }, {
          reg: /^re\-[a-z]../,
          pos: "VB"
        }, {
          reg: /.*ould$/,
          pos: "MD"
        }, {
          reg: /..*ing$/,
          pos: "VBG"
        }, {
          reg: /..*'n$/,
          pos: "VBG"
        }, {
          reg: /...*ed$/,
          pos: "VBD"
        }, {
          reg: /.*ness$/,
          pos: "NN"
        }, {
          reg: /.*ment$/,
          pos: "NN"
        }, {
          reg: /.*full?$/,
          pos: "JJ"
        }, {
          reg: /.*ous$/,
          pos: "JJ"
        }, {
          reg: /.*ble$/,
          pos: "JJ"
        }, {
          reg: /.*ic$/,
          pos: "JJ"
        }, {
          reg: /..*ive$/,
          pos: "JJ"
        }, {
          reg: /..*ic$/,
          pos: "JJ"
        }, {
          reg: /..*est$/,
          pos: "JJ"
        }, {
          reg: /.*ical$/,
          pos: "JJ"
        }, {
          reg: /.*ial$/,
          pos: "JJ"
        }, {
          reg: /...*ish$/,
          pos: "JJ"
        }, {
          reg: /.*less$/,
          pos: "JJ"
        }, {
          reg: /..*ant$/,
          pos: "JJ"
        }, {
          reg: /..*ly$/,
          pos: "RB"
        }, {
          reg: /\./,
          pos: "NN"
        }, {
          reg: /^((?![aeiouy]).)*$/,
          pos: "NN"
        }, {
          reg: /^-?[0-9]+(.[0-9]+)?$/,
          pos: "CD"
        }, {
          reg: /'s$/,
          pos: "NNO"
        }
      ];
      for (o in patterns) {
        if (word.match(patterns[o].reg)) {
          results[i].pos = data.parts_of_speech[patterns[o].pos];
          results[i].rule = "regex";
        }
      }
      word = word.replace(/[\.,!:;]*$/, "");
      lex = data.lexicon[word.toLowerCase()];
      if (lex) {
        results[i].pos = data.parts_of_speech[lex];
        results[i].rule = "lexicon";
      }
      if (i !== 0 && word.match(/[A-Z]/)) {
        results[i].pos = data.parts_of_speech["NN"];
        results[i].rule = "capital";
      }
      if (parseFloat(word)) {
        results[i].pos = data.parts_of_speech["NN"];
        results[i].rule = "number";
      }
      if (!results[i].pos) {
        results[i].pos = data.parts_of_speech["NN"];
        results[i].rule = "unknown";
      }
    }
    for (i in results) {
      i = parseInt(i);
      if (!results[i + 1]) {
        continue;
      }
      if (results[i].pos.tag === "RB" && (!results[i - 1] || results[i - 1].pos.parent !== "verb")) {
        results = suggest_adverb_phrase(i, "from_adverb", results, {
          strong: false
        });
      }
      if (results[i].pos.tag === "PP") {
        results = suggest_noun_phrase(i, "from_posessive", results, {
          strong: true
        });
      }
      if (results[i].pos.tag === "VBZ" && results[i + 1].pos.parent !== "verb") {
        results = suggest_adjective_phrase(i, "vbz-adjective", results, {
          strong: false
        });
      }
      if (results[i].pos.tag === "DT") {
        results = suggest_noun_phrase(i, "from_determiner", results, {
          strong: false
        });
      }
      if (results[i].pos.tag === "MD") {
        results = suggest_verb_phrase(i, "from_would", results, {
          strong: false
        });
      }
    }
    for (i in results) {
      i = parseInt(i);
      if (!results[i + 1]) {
        continue;
      }
      if (results[i].pos.parent === "noun" && results[i + 2] && results[i + 1].pos.tag === "JJ" && results[i + 2].pos.parent === "noun") {
        if (!options.big) {
          results[i + 1].pos = data.parts_of_speech["NN"];
          results[i + 1].rule = "noun_adjective_noun";
        }
      }
      if (results[i].pos.tag === "JJ" && results[i + 1].pos.parent === "verb") {
        results[i].pos = data.parts_of_speech["RB"];
        results[i].rule = "adjective_verb";
      }
      if (results[i].pos.tag === "JJ" && results[i + 1].pos.tag === "JJ") {
        if (!results[i].word.match(",")) {
          results[i].pos = data.parts_of_speech["RB"];
          results[i].rule = "twoadjectives";
        }
      }
      if (results[i].pos.tag === "PRP") {
        if (results[i - 1] && results[i - 1].pos.parent === "adjective") {
          results[i - 1].pos = data.parts_of_speech["VB"];
          results[i - 1].rule = "verb_myself";
        } else if (!results[i - 1] || !results[i - 1].pos.parent === "verb") {
          results = suggest_verb_phrase(i, "from_pronoun", results, {
            strong: false
          });
        }
      }
      if (results[i].pos.tag === "CP" && results[i + 1].pos.tag === "IN") {
        results[i + 1].pos = data.parts_of_speech["VB"];
        results[i + 1].rule = "preposition_verb";
      }
      if (results[i].pos.parent === "adjective" && results[i + 1].pos.tag === "CC" && results[i + 2] && results[i + 2].pos.parent === "noun") {
        results[i + 2].pos = data.parts_of_speech["JJ"];
        results[i + 2].rule = "and_adjective";
      }
    }
    last = results.length - 1;
    if (results[last - 1]) {
      if (results[last - 1].pos.tag === "CP" && results[last].pos.parent === "noun") {
        results[last].pos = data.parts_of_speech["JJ"];
        results[last].rule = "end_copula";
      }
      if (results[last - 1].pos.parent === "noun" && (results[last].pos.parent === "adjective" || results[last].pos.tag === "RB")) {
        results[last].pos = data.parts_of_speech["NN"];
        results[last].rule = "ending_noun";
      }
    }
    return results;
  };
  if (typeof define !== "undefined" && define.amd) {
    define([], function() {
      return tag;
    });
  } else {
    if (typeof module !== "undefined" && module.exports) {
      module.exports = tag;
    }
  }
  return tag;
})();

set_options = function(options) {
  if (options == null) {
    options = {
      big: true
    };
  }
  if (options.verbose) {
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
  if (options.big) {
    options.gerund = false;
    options.stick_adjectives = false;
    options.stick_prepositions = false;
    options.stick_the = false;
    options.subnouns = false;
    options.want_quotations = true;
    options.match_whole = false;
    options.kill_numbers = true;
    options.kill_quotes = true;
  }
  return options;
};

str = "Sally is a huge fool";

options = set_options(options);

words = tokenizer(str, options);

tags = tag(words);

chunks = chunker(tags, options);

nouns = recognizer(chunks, options);

console.log(nouns);
