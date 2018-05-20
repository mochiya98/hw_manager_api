FROM mhart/alpine-node:10
MAINTAINER Yukimasa Funaoka <yukimasafunaoka@gmail.com>

RUN addgroup -S mochiya98 && adduser -S -G mochiya98 mochiya98
ENV HOME=/home/mochiya98

RUN echo 'http://dl-3.alpinelinux.org/alpine/edge/community' >> /etc/apk/repositories && \
    apk upgrade --update && \ 
    apk add mongodb git openssh && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

WORKDIR $HOME/hw_manager_api
COPY package*.json ./
RUN npm i

COPY . ./

RUN chown -R mochiya98:mochiya98 $HOME/*
USER mochiya98

RUN ls -l

CMD ["npm", "start"]
