FROM mhart/alpine-node:latest

WORKDIR /src
ADD . .

# If you have native dependencies, you'll need extra tools
RUN apk add --no-cache make gcc g++ python

RUN npm install

# If you had native dependencies you can now remove build tools
RUN apk del make gcc g++ python && \
    rm -rf /tmp/* /root/.npm /root/.node-gyp
EXPOSE 80
CMD PORT=80 node index.js
