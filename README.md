# LaJournal
Simple app to keep journal entries with useful other features, like labelling paragraphs etc.

## Local setup
You can host this app on your local computer.
First, you will need to download git.

### Ubuntu
Install git
    
    sudo apt-get install git

Clone this repository

    git clone https://github.com/klajdicaushi/LaJournal.git

Go to directory

    cd LaJournal

Give permission to run `setup.sh` and `start.sh` scripts.

    sudo chmod +x setup.sh start.sh

Run `setup.sh` to install all the necessary requirements.

    ./setup.sh

Run `start.sh` to start both the backend and the frontend applications.

    ./setup.sh

Finally, visit http://localhost:5000/ to access the app or http://localhost:5000/.

Default credentials are admin/admin, you can change them from inside the app if you want.

### Windows 
Download from [git-scm](https://git-scm.com/downloads/win) and install.

Clone this repository

    git clone https://github.com/klajdicaushi/LaJournal.git

Download and install [Python](https://www.python.org/downloads/) if not already installed.
Do not forget to check `Add python to path` during installation.

Download and install [NodeJS](https://nodejs.org/en/download/current/) if not already installed.
