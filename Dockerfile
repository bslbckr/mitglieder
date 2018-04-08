FROM nginx:1.13.0-alpine

ADD default.conf /etc/nginx/conf.d/default.conf
COPY dist/* /usr/share/nginx/html/