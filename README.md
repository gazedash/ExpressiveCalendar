# Backend for Calendar Student Application (WIP)

### Development

Run server

nodemon:
```
npm run watch
```
if you don't have nodemon:
```
npm run start
```

Run MySQL in docker
```
docker run -p 6603:3306 --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql
```

Load fixtures
```
npm run fixtures
```

Check & fix errors:
```
npm run eslint-fix
```
