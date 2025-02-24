# 3DChatApp
A dynamic chat application using Node.js and React. 
https://drive.google.com/file/d/1Yd2emxMlUay8ci6wYqLuxo_8Hfw48Bgw/view?usp=sharing  (Video link)

## Install requried tools like MongoDB, Git, Node and NPM
1. Make sure Node and NPM are installed on your computer. You can download both [here.](https://nodejs.org) (NPM is included in your Node installation)
2. Install mongodb Community edition from online resources [here.](https://www.mongodb.com/docs/manual/administration/install-community/) (As it is needed to store chat message history)
3. Install Git [here.](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Clone and checkout the code
```bash
git clone https://github.com/ChinmayNadgouda/3DChatApp.git
cd 3DChatApp
git checkout chat
```
## To start a backend server using Node
1. Enter the directory server.
```bash
cd server
``` 
2. Run the following to install the NodeJs backend server dependencies
```bash
npm i
``` 
3. Start backend 
```bash
nodemon
```

## To start a React frontend.
1. Enter the directory frontend
```bash
cd frontend
``` 
2. Installing the frontend dependencies
```bash
npm i --legacy--peer-deps --force
```
3. Start frontend 
```bash
npm start
```

Example tests are provided using jest
## Running Tests 
For both backend and frontend.
1. Enter the root directory for each.
```bash
npm test
```
