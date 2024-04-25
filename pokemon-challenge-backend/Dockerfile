ARG VERSION

FROM node:18

RUN useradd -ms /bin/bash runner

WORKDIR /home/runner

COPY package*.json ./

RUN chown -R runner /home/runner
USER runner
RUN npm install

COPY --chown=runner . .
RUN npm run build


EXPOSE 3100

ENV VERSION=${VERSION}

CMD ["node", "dist/main.js"]