var CommentParse = function() {
  this.parseTweet = function(tweet) {
    var re = /\bthen.+[.,!?]( |\z)/i
    var re2 = /\bthen.{2,}/i
    var reEllipsis = /(\.\.\.)/

    if(reEllipsis.test(tweet)) {
      return null
    } else if(re.test(tweet)) {
      var text = tweet.match(re)[0]
      return text
    } else {
      var text = tweet.match(re2)
      if(text) {
        return text
      }
    }
  }
}

module.exports = CommentParse