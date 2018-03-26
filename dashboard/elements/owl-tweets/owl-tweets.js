(function () {
    'use strict';

    class OwlTweets extends Polymer.Element {
        static get is() {
            return 'owl-tweets';
        }

        ready() {
            super.ready();
            this.messages = [
                {
                    'user': 'system',
                    'text': 'no messages yet loaded'
                }
            ];
            nodecg.readReplicant('chat-messages', value => { // Read old messages once
                this.messages = value;
            });
            nodecg.listenFor('message', value => {
                this.unshift('messages', value);
                if (this.messages.length > nodecg.bundleConfig.messagesCount) {
                    this.pop('messages');
                }
            });
        }
        highlightMessage(event) {
            nodecg.sendMessageToBundle('add-question', 'owl-question-box', event.model.item);
        }
        clearMessages() {
            this.set('messages', []);
            nodecg.sendMessage('clear-messages')
        }
    }
    customElements.define(OwlTweets.is, OwlTweets);
})();