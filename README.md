# Messenger Bridger
> Integrate all messengers

## Prerequisites
* NodeJS 8.X or later


## Development
### Environment variables
* `BRIDGE` : ID pairs of channels. See 'How to use' > 'BRIDGE' paragraph for detail.
* `FACEBOOK_APPSTATE`
* `FACEBOOK_EMAIL`
* `FACEBOOK_PASSWORD`
* `TELEGRAM_BOT_TOKEN`

### Setup
```bash
# Install requirements
yarn
```

### Test
```bash
# Run lint
yarn lint

# Run unit tests
yarn test
```

### Run
```bash
yarn start-dev
```

### Deployment
```bash
# Run using native nodejs
yarn build
yarn start

# Run using docker
docker build -t <name> .
docker run <name>
```


## How to use
### `BRIDGE`
You need to give two Channel ID, separated by two colons(`::`). Messages from the first channel would be delivered to second one.

Channel ID contains two characters which is unique for each messenger, and ID of chatroom channel issued by each messenger services.

* `FB` : Facebook Messenger
* `TL` : Telegram

Here is some examples.

* `FB12345678::TL-87654321` : Integrate messages from Facebook messenger thread `12345678` to Telegram group chat `-87654321`.

You can create more than one bridges by giving multiple Channel IDs, separated by comma(`,`).
