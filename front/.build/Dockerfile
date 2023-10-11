FROM node:16 as builder

WORKDIR /app

COPY package.json ./
COPY ./.build/.npmrc /app/.npmrc

RUN npm install --legacy-peer-deps

ADD . ./

RUN npm run build

FROM nginx:latest

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/build/. ./
COPY ./version.txt ./

ADD ./.build/nginx.conf /etc/nginx/nginx.conf

RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
  ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80

CMD /usr/sbin/nginx -g "daemon off;"
