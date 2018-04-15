import axios from 'axios';
import Messenger from './base';


export default class TelegramMessenger extends Messenger {
  constructor() {
    super();
    this.lastUpdateId = -1;
    this.BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    this.getUpdate();
    super.emit('ready');
  }

  request(method) {
    return axios.get(`https://api.telegram.org/bot${this.BOT_TOKEN}/${method}`);
  }

  getUpdate() {
    this.request(`getUpdates?offset=${this.lastUpdateId + 1}&timeout=10`).then((response) => {
      if (response.status !== 200 || response.data.result.length === 0) {
        this.getUpdate();
        return;
      }

      response.data.result.forEach((update) => {
        this.lastUpdateId = update.update_id;
        if (!this.subscribedChannelIds.includes(update.message.chat.id.toString())) {
          return;
        }

        super.emit('message', {
          channelId: update.message.chat.id.toString(),
          senderId: update.message.from.id.toString(),
          senderName: update.message.from.first_name,
          body: update.message.text.split(' ').filter(word => !word.startsWith('/')).join(' '),
        });
      });

      this.getUpdate();
    });
  }

  /**
   * Prepare to receive messages from the channel.
   * @param {string} channelId : ID of messenger thread.
   */
  subscribeChannel(channelId) {
    this.subscribedChannelIds.push(channelId);
  }

  /**
   * Send message.
   * @param {string} channelId : ID of chat.
   * @param {string} body : Message body.
   * @param {*} options : would be ignored.
   */
  sendMessage(channelId, body, options) {
    this.request(`sendMessage?chat_id=${channelId}&text=${encodeURI(body)}`);
  }
}
