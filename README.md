Team ROOMI

Introduction:
Living with other people - whether it’s your lifelong best friend or a random person assigned to you by your college - can be a dicey
game. How will you coordinate whose turn it is to take out the trash? Who has the parking spot today? When is rent due? All of these are
questions that can easily be answered with ROOMI. ROOMI is the newest, easiest roommate coordination webapp, created so you and your
roommates can easily share chores lists, rent reminders, parking schedules, and everything else you need to maintain a happy household. 

Requirements:
This a webapp that should be seen locally on Chrome. Please ensure that you use an updated version of Chrome.

Login Credentials:
You can create your own login credential and household.

Installation Instructions:

1. Clone the repository. Please follow these commands.
```bash
$ mkdir CSE110_ROOMI
$ cd CSE110_ROOMI
$ git clone https://github.com/lambrendan/roomi.git
```
2. Install Node
```bash
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
$ nvm install 10.12
$ nvm use 10.12
```
3. Install relevant node packages (be in the CSE110_ROOMI folder).
```bash
$ npm install
```
4. Download MySQL for your particular OS from 
https://dev.mysql.com/downloads/mysql/

5. How to connect to MySQL (MacOS)
During the setup process for MySQL, use "roomicse110" as the password for user "root". Then, connect to the mysql server. If you are using
a MacOS, connecting to the mysql server can be found in System Preferences.

How to run application:
```bash
$ npm start
```
The application will open up a tab on your Chrome webbrowser to see our application.
You can view our application at localhost:3000

Known Bugs:
1. For shuffling parking, if there are more parking spots than housemates and the user arrives from the Parking Schedule page
from a different page, the user will need to click twice on the Shuffle Parking Assignments button in order to for the shuffling of the
parking assignments to occur.

Technical Support:
Brendan Lam - Software Development Lead
Phone: (626)-510-2176

Ethan Hsu: Alogrithm Specialist
Phone: (510)-284-7500
