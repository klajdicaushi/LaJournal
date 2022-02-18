#!/usr/bin/env bash

cd backend || exit

echo "Setting up backend..."

printf "\nInstalling pip and venv..."
sudo apt-get update
sudo apt-get install python3-pip -y
sudo apt-get install python3-venv -y

printf "\nCreating a new venv..."
python3 -m venv venv
source venv/bin/activate

printf "\nInstalling requirements..."
pip3 install -r requirements.txt

printf "\nInstalling gunicorn..."
pip3 install gunicorn

printf "\nRunning migrations..."
python3 manage.py migrate

printf "\n\n\nSetting up frontend..."

cd ../frontend || exit

printf "\nInstalling curl..."
sudo apt install curl -y

printf "\nInstalling nvm..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

printf "\nInstalling nodejs..."
nvm install node
nvm use node

printf "\nInstalling yarn..."
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn -y

printf "\nInstalling requirements..."
yarn install

printf "\nAdding npx..."
yarn global add npx

printf "\nBuilding frontend app..."
yarn build

cd ..
