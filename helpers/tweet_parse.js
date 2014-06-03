var CommentParse = function() {
  this.parseTweet = function(tweet) {
    var re = /\bthen.+[.,!?]( |\z)/i
    var re2 = /\bthen.{2,}/i
    var reEllipsis = /(\.\.\.)|\u2026/

    if(reEllipsis.test(tweet)) {
      return null
    } else if(re.test(tweet)) {
      var text = tweet.match(re)[0]
      return text
    } else {
      var text = tweet.match(re2)
      if(text) {
        return text
      } else {
        return null
      }
    }
  }
}

module.exports = CommentParse



