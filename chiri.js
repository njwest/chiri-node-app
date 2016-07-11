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

var movieSearch = function(movieQuery){
  request('http://www.omdbapi.com/?t=' + movieQuery +'&plot=short&r=json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log("Title: " + JSON.parse(body)["Title"] + "\n Year: " + JSON.parse(body)["Year"] + "\n IMDB Rating: " + JSON.parse(body)["imdbRating"] + "\n Country: " + JSON.parse(body)["Country"] + "\n Language(s): " + JSON.parse(body)["Language"] + "\nPlot: " + JSON.parse(body)["Plot"] + "\nCast: " + JSON.parse(body)["Actors"]);
    } else{
      console.log(error);
    }
});
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
  case "movie-this":
    if(slice != '[object Undefined]'){
        movieSearch(slice);
    }
    else{
      movieSearch("Mr+Nobody");
    }
//end switch     
}
console.log("Search parameter: " + slice);