# Blog backend with Node JS and Mongo

It is Blog application where User can signup and create posts and also add comments on posts.

---
## Requirements

For development, you will only need Node.js and a node global package, Npm, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v20.10.0

    $ npm --version
    10.2.3

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    npm install npm -g

## Set up the project

    git clone https://github.com/Kuldeep-Bacancy/blog-node-backend
    cd blog-node-backend
    npm install

## Set up ENV variables in .env file

    PORT="YOUR PORT"

    ENV="YOUR ENV"

    DB_URL="MONGO DB URL"

    ORIGIN=*

    ACCESS_TOKEN_SECRET="YOUR ACCESS TOKEN SECRET"

    ACCESS_TOKEN_EXPIRY="YOUR ACCESS TOKEN EXPIRY TIME"

    REFRESH_TOKEN_SECRET="YOUR REFRESH TOKEN SECRET"

    REFRESH_TOKEN_EXPIRY="YOUR REFRESH TOKEN EXPIRY TIME"

    CLOUDINARY_CLOUD_NAME="YOUR CLOUD NAME"

    CLOUDINARY_API_KEY="YOUR CLOUD API KEY"

    CLOUDINARY_API_SECRET="YOUR CLOUD SECRET KEY"

    MAILJET_API_KEY="YOUR MAILJET API KEY"

    MAILJET_SECRET_KEY="YOUR MAILJET SECRET KEY"

    STRIPE_PUBLISHABLE_KEY="YOUR STRIPE PUBLISHABLE KEY"

    STRIPE_SECRET_KEY="YOUR STRIPE SECRET KEY"

## Running the project

    npm start
