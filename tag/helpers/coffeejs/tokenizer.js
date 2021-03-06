// Generated by CoffeeScript 1.6.3
var data, tokenizer;

data = require("./data");

tokenizer = (function() {
  var rejoin, spot_multiples;
  spot_multiples = function(words) {
    var i, two;
    for (i in words) {
      i = parseInt(i);
      if (!words[i + 1]) {
        continue;
      }
      two = words[i] + " " + words[i + 1];
      two = two.replace(/[\.,!:;]*$/, "");
      if (data.multiples[two]) {
        words[i] = words[i] + " " + words[i + 1];
        words[i + 1] = null;
      }
    }
    return words.filter(function(w) {
      return w;
    });
  };
  rejoin = function(words) {
    var i, quote, quotes;
    quotes = [];
    for (i in words) {
      if (words[i].match("\"")) {
        quotes.push(parseInt(i));
      }
    }
    if (quotes.length === 2) {
      quote = words.slice(quotes[0], quotes[1] + 1).join(" ");
      quote = quote.replace(/"/g, "");
      words.push(quote);
    }
    return words;
  };
  tokenizer = function(text, options) {
    var words;
    if (!options) {
      options = {};
    }
    if (text.match(/(he's|she's|it's)/)) {
      text = text.replace(/([^ ])['’]s /g, "$1 is ");
    }
    text = text.replace(/([^ ])['’]ve /g, "$1 have ");
    text = text.replace(/([^ ])['’]re /g, "$1 are ");
    text = text.replace(/([^ ])['’]d /g, "$1 would ");
    text = text.replace(/([^ ])['’]ll /g, "$1 will ");
    text = text.replace(/([^ ])n['’]t /g, "$1 not ");
    text = text.replace(/\bi'm /g, "I am ");
    if (!options.keep_brackets) {
      text = text.replace(RegExp(" ?\\(.{0,200}?\\)", "g"), "");
    }
    words = text.split(" ");
    if (options.want_quotations ? text.match("\"") : void 0) {
      words = rejoin(words);
    }
    words = spot_multiples(words);
    return words;
  };
  if (typeof define !== "undefined" && define.amd) {
    define([], function() {
      return tokenizer;
    });
  } else {
    if (typeof module !== "undefined" && module.exports) {
      module.exports = tokenizer;
    }
  }
  return tokenizer;
})();
