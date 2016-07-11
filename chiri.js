var keys = require('./keys.js');
var fs = require('fs');
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');

var logData = function(logEntry) {
    fs.appendFile("./log.txt", logEntry, (error) => {
        if (error) {
          console.log(error);
        }
    });
}
var slice = process.argv.slice(3);
var songSearch = function(songQuery){
  var songData;
  var song;
  spotify.search(
      {type: 'track', query: songQuery},
      function(error, data){
        if(!error){
          song = data.tracks.items[0];
          songData = ("Artist: " + song.artists[0].name + "\n" + "Song title: " + song.name + "\n" + "Album: " + song.album.name + "\n" + "Preview: " + song.preview_url + "\n");
          console.log(songData);
          logData(songData);
        } else if (error){
          console.log(error);
        }
      }
    )
}

switch(process.argv[2]){
  case "my-tweets":
    var client = new twitter({
      consumer_key: keys.twitterKeys.consumer_key,
      consumer_secret: keys.twitterKeys.consumer_secret,
      access_token_key: keys.twitterKeys.access_token_key,
      access_token_secret: keys.twitterKeys.access_token_secret
    });
    var me = 'n1ckw3st';
    var record;
    var params = {screen_name: 'n1ckw3st'};
    client.get('statuses/user_timeline', params, function(error, tweets, response){
      if (!error){
        for (var i = 0; i < tweets.length; i++){
        record = (tweets[i].text + "\n Tweeted at: " + tweets[i].created_at + "\n")
        console.log(record);
        logData("my-tweets at " + Date() + "\n" + record + "---END ENTRY---");
        }            
      }else if (error){ 
        console.log(error);
      }
    });
  case "spotify-this-song":
    if(toString(slice) === '[object Undefined]'){
      songSearch("What's my age again");
    }
    else{
      songSearch(slice);
    }
//end switch     
}

// } else if(process.argv[2] == "spotify-this-song"){
//   console.log("lol");
// // console log song artist, song name, preview link of song, album of song, song name
// // output what's my age again by blink 182 if process.argv[3] is undefined
// } else if(process.argv[2] == "movie-this"){
//     console.log("lol");

//   // console.log title, year, imdb rating, country, language, plot, actors
//   // console.log Mr Nobody movie info if process.argv[3] is undefined
// } else if(process.argv[2] == "do-what-it-says"){
//     console.log("lol");

//   // take in the text from random.txt and use it as "node liri.js [contents 1 = process.argv[2] [contents 2 = process.argv[3]"
// }