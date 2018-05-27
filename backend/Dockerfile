FROM node:carbon

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY entrypoint.sh *.js ./
COPY public public
COPY views views

EXPOSE 5000
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["/app/entrypoint.sh"]
