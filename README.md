FCC TWITTER BOT!!!
==========

Twitter bot loaded with comments from the FCC database. Originally, in pdf form, the comments were unsearchable. Now they're not. You just have tweet at FCCliefs. Also, if you just want to chat, FCCliefs is quite a conversationalist. So convenient right? You're welcome.

To query the twitter bot, tweet "tell me about" followed by your query.

Before running it locally, ask yourself what you're doing with your life, set the environmental variables in helpers/tweet.js, and populate your database 

```
mongorestore --collection comments --db fcc_with_links backup/dump/fcc_with_links/comments.bson
```

Run with
```
node app.js
```


Install AIML
```
pip install aiml
```