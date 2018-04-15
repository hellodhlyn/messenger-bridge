# NodeJS Seed Application
## Prerequisites
* NodeJS 8.X or later


## Development
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


## Deployment
```bash
# Run using native nodejs
yarn build
yarn start

# Run using docker
docker build -t <name> .
docker run <name>
```
