echo "Starting gunicorn server..."
cd backend || exit
source venv/bin/activate
nvm use node

gunicorn lajournal.wsgi:application --bind 0.0.0.0:8000 &

cd ../frontend || exit
npx serve -s build -p 5000 &

cd ..
