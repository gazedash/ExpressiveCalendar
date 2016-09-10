FROM node:latest
# replace this with your application's default port
COPY package.json /www/ExpressiveCalendar/package.json

RUN cd /www/ExpressiveCalendar; npm install
# this order ensures that if dependencies are not changed
# - they are not being reinstalled
COPY . /www/ExpressiveCalendar

EXPOSE 8000
