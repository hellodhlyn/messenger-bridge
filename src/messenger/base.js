/* eslint-disable class-methods-use-this */

import EventEmitter from 'events';

/**
 * Abstracted class for each messenger apis.
 *
 * Events:
 *   - ready()              : ready to action.
 *   - message(message)     : message received.
 *      message = {
 *        channelId: string,    // ID of chat channel
 *        senderId: string,     // ID of sender
 *        senderName: string,   // readable name of sender
 *        body: string,         // message body
 *      };
 */
export default class Messenger extends EventEmitter {
  constructor() {
    super();
    this.subscribedChannelIds = [];
  }

  subscribeChannel(channelId) {
    throw new Error('Not Implemented!');
  }

  sendMessage(channelId, body, options) {
    throw new Error('Not implemented!');
  }
}
