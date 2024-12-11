FROM node:latest AS builder

# automatically creates the dir and sets it as the current working dir
WORKDIR /app

ENV PATH /usr/src/node_modules/.bin:$PATH

COPY package.json ./

ARG VITE_URL_PREFIX

ENV VITE_URL_PREFIX=$VITE_URL_PREFIX

RUN npm install

COPY . .


FROM builder AS dev

CMD ["npm", "run", "dev", "--", "--host"]

FROM builder AS prod-builder
RUN npm run build

# it's a good idea to pin this, but for demo purposes we'll leave it as is
FROM nginx:latest AS prod

COPY --from=prod-builder /app/dist /usr/share/nginx/html

EXPOSE 82

CMD ["nginx", "-g", "daemon off;"]