const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// YouTube API key
const YOUTUBE_API_KEY = 'YOUR_API_KEY_HERE';

// Facebook Page Access Token
const PAGE_ACCESS_TOKEN = 'YOUR_PAGE_ACCESS_TOKEN_HERE';

app.post('/webhook', (req, res) => {
  const messagingEvents = req.body.entry[0].messaging;
  messagingEvents.forEach(event => {
    if (event.message && event.message.text) {
      const query = event.message.text;
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${YOUTUBE_API_KEY}`;

      axios.get(url)
        .then(response => {
          const videos = response.data.items;
          const videoList = videos.map(video => {
            return {
              title: video.snippet.title,
              videoId: video.id.videoId
            };
          });

          const message = {
            'recipient': {
              'id': event.sender.id
            },
            'message': {
              'text': `Search results for "${query}":`
            }
          };

          videoList.forEach(video => {
            const videoMessage = {
              'recipient': {
                'id': event.sender.id
              },
              'message': {
                'text': `${video.title} - https://www.youtube.com/watch?v=${video.videoId}`
              }
            };

            axios.post(`https://graph.facebook.com/v13.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, videoMessage)
              .then(response => {
                console.log('Video sent!');
              })
              .catch(error => {
                console.error(error);
              });
          });

          axios.post(`https://graph.facebook.com/v13.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, message)
            .then(response => {
              console.log('Message sent!');
            })
            .catch(error => {
              console.error(error);
            });
        })
        .catch(error => {
          console.error(error);
        });
    }
  });

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
