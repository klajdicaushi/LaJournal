cd backend
call .\\venv\Scripts\activate

START /B python3 manage.py runserver

cd ..\frontend
START /B serve -s build -p 5000

cd ..

start firefox "http://localhost:5000/"
