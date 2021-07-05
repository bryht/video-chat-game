FROM nginx:1.16.0-alpine
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./build /usr/share/nginx/html
COPY ./docker/entrypoint.sh /usr/share/nginx/html
EXPOSE 80
WORKDIR /usr/share/nginx/html
RUN apk add --no-cache bash
RUN chmod 777 ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
