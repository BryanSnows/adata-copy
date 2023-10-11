FROM node:18

WORKDIR /app

RUN apt update && apt install -y tzdata

ENV TZ=America/Manaus

ADD . .

RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    npm install --force

EXPOSE 3000

CMD ["npm", "start"]