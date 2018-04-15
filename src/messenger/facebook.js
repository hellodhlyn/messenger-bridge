import fs from 'fs';
import readline from 'readline';
import { Console } from 'console';

import login from 'facebook-chat-api';
import Messenger from './base';

const console = new Console(process.stdout, process.stderr);
const SESSION_FILENAME = 'appstate.json';


function getCredentials() {
  if (process.env.FACEBOOK_APPSTATE) {
    return { appState: JSON.parse(process.env.FACEBOOK_APPSTATE) };
  } else if (fs.existsSync(SESSION_FILENAME)) {
    return { appState: JSON.parse(fs.readFileSync(SESSION_FILENAME, 'utf8')) };
  } 
  return { email: process.env.FACEBOOK_EMAIL, password: process.env.FACEBOOK_PASSWORD };
}

function getTwoFactorCode() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log('Enter code > ');
    rl.on('line', (line) => {
      resolve(line);
      rl.close();
    });
  });
}


export default class FacebookMessenger extends Messenger {
  constructor() {
    super();
    this.userMap = new Map();

    // Get login credential.
    const credentials = getCredentials();
    const loginOptions = { forceLogin: true };
    login(credentials, loginOptions, (e, api) => {
      if (e) {
        // Two-factor auth required.
        if (e.error === 'login-approval') {
          getTwoFactorCode().then(code => e.continue(code));
        } else {
          console.error(e);
        }
      }

      if (api) {
        fs.writeFileSync(SESSION_FILENAME, JSON.stringify(api.getAppState()));
        this.api = api;
        this.startListen();
        super.emit('ready');
      }
    });
  }

  /**
   * Fetch all users' information participated in the thread.
   * @param {string} channelId : ID of messenger thread.
   */
  loadUserInfos(channelId) {
    this.api.getThreadInfo(channelId, (e, info) => {
      this.api.getUserInfo(info.participantIDs, (e2, obj) => {
        Object.keys(obj).forEach(userId => this.userMap.set(userId, obj[userId]));
      });
    });
  }

  startListen() {
    this.api.listen((e, message) => {
      if (!this.subscribedChannelIds.includes(message.threadID)) {
        return;
      }

      if (message.type === 'message') {
        super.emit('message', {
          channelId: message.threadID,
          senderId: message.senderID,
          senderName: this.userMap.get(message.senderID).name,
          body: message.body,
        });
      }
    });
  }

  /**
   * Prepare to receive messages from the channel.
   * @param {string} channelId : ID of messenger thread.
   */
  subscribeChannel(channelId) {
    this.loadUserInfos(channelId);
    this.subscribedChannelIds.push(channelId);
  }

  /**
   * Send message.
   * @param {string} channelId : ID of messenger thread.
   * @param {string} body : Message body.
   * @param {*} options : would be ignored.
   */
  sendMessage(channelId, body, options) {
    this.api.sendMessage(body, channelId);
  }
}
