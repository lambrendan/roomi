# roomi
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
$ npm install
```

Download MySQL for your particular OS from 
https://dev.mysql.com/downloads/mysql/

Download Sequel Pro for your particular OS
https://www.sequelpro.com/

How to connect to MySQL (MacOS)
Open up Sequel Pro. Choose a Standard database. Enter for host: 'localhost' (You will prompted to use port 127.0.0.1). 
Enter for username: 'root'. Enter for password: 'roomicse110'. Then press "Connect". Then do to the navigation tab 'Database'. 
Click "Add Database" and name the database 'roomiDB'. You should be good to go to run the application. 

How to run application:
```bash
$ npm start
```
The application will open up a tab on your Chrome webbrowser to see our application.
You can view our application at localhost:3000
