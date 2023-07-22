FROM node:16
WORKDIR /usr/src/app
ADD lib .
RUN yarn install

FROM gcr.io/distroless/nodejs:16
WORKDIR /usr/src/app
COPY --from=0 /usr/src/app /usr/src/app
CMD ["index.js"]