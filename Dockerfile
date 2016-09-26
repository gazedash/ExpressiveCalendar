FROM node:latest

EXPOSE 8000

COPY package.json /www/ExpressiveCalendar/package.json

RUN cd /www/ExpressiveCalendar; npm install --production
# this order ensures that if dependencies are not changed
# - they are not being reinstalled
COPY . /www/ExpressiveCalendar
