# Backend for Calendar Student Application (WIP)

### Development

Run server

```
nodemon --exec npm run babel-node -- src/app.js | ./node_modules/.bin/bunyan
```

Run MySQL in docker
```
docker run -p 6603:3306 --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql
```

Load fixtures
```
./node_modules/.bin/babel-node src/fixtures/fixtures.js 
```
