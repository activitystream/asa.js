FROM mhart/alpine-node
# FROM mhart/alpine-node-base:0.10
# FROM mhart/alpine-iojs-base
# FROM mhart/alpine-node

# If you have native dependencies, you'll need extra tools
RUN apk add --update make gcc g++ python

WORKDIR /src
ADD package.json ./


# If you need npm, use mhart/alpine-node or mhart/alpine-iojs
RUN npm install

ADD . .
# If you had native dependencies you can now remove build tools
# RUN apk del make gcc g++ python && \
#   rm -rf /tmp/* /root/.npm /root/.node-gyp
EXPOSE 8080
CMD gulp serve