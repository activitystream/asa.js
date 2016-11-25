FROM mhart/alpine-node:4
# FROM mhart/alpine-node-base:0.10
# FROM mhart/alpine-iojs-base
# FROM mhart/alpine-node

WORKDIR /src
ADD . .

# If you have native dependencies, you'll need extra tools
# RUN apk-install make gcc g++ python

# If you need npm, use mhart/alpine-node or mhart/alpine-iojs
RUN npm install

# If you had native dependencies you can now remove build tools
# RUN apk del make gcc g++ python && \
#   rm -rf /tmp/* /root/.npm /root/.node-gyp
EXPOSE 80
CMD PORT=80 node index.js
