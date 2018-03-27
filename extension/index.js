'use strict';
const Twitter = require('node-tweet-stream');
const convertTweetTextToMarkdown = require('tweet.md');
module.exports = function (nodecg) {
    const chatMessages = nodecg.Replicant('chat-messages', {
        defaultValue: []
    });
    const searchTerm = nodecg.Replicant('search-term', {
        defaultValue: ''
    });

    var t = new Twitter({
        consumer_key: nodecg.bundleConfig.consumerKey,
        consumer_secret: nodecg.bundleConfig.consumerSecret,
        token: nodecg.bundleConfig.token,
        token_secret: nodecg.bundleConfig.tokenSecret
    });
  
    t.on('tweet', function (tweet) {
        if (isRetweet(tweet)) {
            nodecg.log.info('Filtered retweet');
            return;
        }
        nodecg.log.info('New Tweet', tweet);
        var question = convertTweetToQuestion(tweet);
        storeMessage(question);
    });
  
    t.on('error', function (err) {
        nodecg.log.error(err);
    });

    searchTerm.on('change', newVal => {
        if (newVal === '') {
            nodecg.log.info('Not searching for tweets');
            return;
        }
        nodecg.log.info('Searching for tweets containing ' + newVal);
        t.track(newVal);
    });

    function convertTweetToQuestion(tweet) {
        var question = {};
        question.id = tweet.id_str;
        question.platform = 'twitter';
        question.user = '@' + tweet.user.screen_name;
        question.avatar = tweet.user.profile_image_url.replace(/\_normal/g, '');
        question.text = convertTweetTextToMarkdown(tweet);
        return question;
    }

    function storeMessage(chatter) {
        chatMessages.value.unshift(chatter); // Store the messages
        nodecg.sendMessage('message', chatter); // Informing the dashboard of new messages

        while (chatMessages.value.length > nodecg.bundleConfig.messagesCount) {
            chatMessages.value.pop();
        }
    }

    function isRetweet(tweet) {
        return tweet.retweeted_status;
    }

    nodecg.listenFor('clear-messages', () => {
        chatMessages.value = [];
    });
};
