Clone repository:
```bash
$ mkdir CSE110_ROOMI
$ cd CSE110_ROOMI
$ git clone https://github.com/lambrendan/roomi.git
```
Install Node
```bash
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
$ nvm install 10.12
$ nvm use 10.12
```
Install relevant node packages
```bash
$ npm install express mysql passport passport-local expression-session body-parser
```

Download MySQL for your particular OS from 
https://dev.mysql.com/downloads/mysql/

How to run application:
```bash
$ node server.js
```
checkout localhost:3000 to see our application!

Begin Coding:

Make sure you are on master branch first
```bash
$ git branch
```

Make sure master branch is updated
```bash
$ git pull origin master
```

Create a branch for you to start editing code
```bash
$ git checkout -b your_name_descriptive_info_about_what_you_are_coding
```

Make sure to add and commit your changes
```bash
$ git add .
$ git commit -m "descriptive_info_about_your_changes"
```

How to send your local branch to our remote git repository
```bash
$ git push
```


