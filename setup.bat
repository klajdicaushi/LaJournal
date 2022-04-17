cd backend

echo "Creating venv..."
python -m venv venv
call .\\venv\Scripts\activate

echo "Installing requirements..."
pip3 install -r requirements.txt

echo "Installing waitress..."
pip3 install waitress

echo "Running migrations..."
python manage.py migrate

echo "Setting up frontend..."
cd ..\frontend

echo "Installing yarn..."
call npm install -g yarn

echo "Installing requirements..."
call yarn install

echo "Installing serve..."
call npm install -g serve

echo "Building frontend app..."
call yarn build

cd ..
