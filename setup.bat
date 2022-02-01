cd backend

echo "Creating venv..."
python3 -m venv venv
.\\venv\Scripts\activate

echo "Installing requirements..."
pip3 install -r requirements.txt

echo "Installing requirements..."
pip3 install -r requirements.txt

echo "Installing gunicorn..."
pip3 install gunicorn

echo "Running migrations..."
python3 manage.py migrate

echo "Setting up frontend..."
cd ../frontend

echo "Installing yarn..."
npm install -g yarn

echo "Installing requirements..."
yarn install

echo "Installing serve..."
npm install -g serve

echo "Building frontend app..."
yarn build
