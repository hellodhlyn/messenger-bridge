import FacebookMessenger from './messenger/facebook';
import TelegramMessenger from './messenger/telegram';

function getMessenger(channelId) {
  return new Promise((resolve, reject) => {
    const messengerCode = channelId.substring(0, 2);
    if (messengerCode === 'FB') {
      const facebook = new FacebookMessenger();
      facebook.on('ready', () => resolve(facebook));
    } else if (messengerCode === 'TL') {
      resolve(new TelegramMessenger());
    } else {
      reject();
    }
  });
}


export default class Bridge {
  constructor(from, to) {
    const channelIdFrom = from.substring(2);
    const channelIdTo = to.substring(2);

    Promise.all([
      getMessenger(from),
      getMessenger(to),
    ]).then((messengers) => {
      messengers[0].subscribeChannel(channelIdFrom);
      messengers[0].on('message', (message) => {
        if (message.channelId === channelIdFrom) {
          messengers[1].sendMessage(channelIdTo, `[${message.senderName}]\n${message.body}`);
        }
      });

      messengers[1].subscribeChannel(channelIdTo);
      messengers[1].on('message', (message) => {
        if (message.channelId === channelIdTo) {
          messengers[0].sendMessage(channelIdFrom, message.body);
        }
      });
    });
  }
}
