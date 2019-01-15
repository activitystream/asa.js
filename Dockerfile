FROM mhart/alpine-node:8.9.1

WORKDIR /app

ADD package.json yarn.lock ./

RUN npm i -g yarn
RUN yarn

ADD .babelrc rollup-plugin-puppeteer.js rollup.config.js tsconfig.json ./
ADD server ./server
ADD src ./src

RUN yarn build
RUN cp dist/server.js server/server.js

CMD node server/server.js