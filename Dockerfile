FROM mhart/alpine-node:10
MAINTAINER Yukimasa Funaoka <yukimasafunaoka@gmail.com>

RUN addgroup -S mochiya98 && adduser -S -G mochiya98 mochiya98
ENV HOME=/home/mochiya98

RUN echo 'http://dl-3.alpinelinux.org/alpine/edge/community' >> /etc/apk/repositories && \
    apk upgrade --update && \ 
    apk add mongodb && \
    rm -rf /var/lib/apt/lists/* && \
    rm /usr/bin/mongoperf && \
    rm /usr/bin/mongos && \
    rm /var/cache/apk/* && \
    mkdir $HOME/hw_manager_api && \
    chown -R mochiya98:mochiya98 $HOME/*

WORKDIR $HOME/hw_manager_api
USER mochiya98

COPY --chown=mochiya98:mochiya98 package*.json ./
RUN npm i && npm cache clean -f

COPY --chown=mochiya98:mochiya98 . ./

CMD ["npm", "start"]
