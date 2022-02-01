cd backend
.\\venv\Scripts\activate

START /B python3 manage.py runserver

cd ../frontend
START /B serve -s build -p 5000
