cd backend
call .\\venv\Scripts\activate

START /B waitress-serve --port=8000 lajournal.wsgi:application

cd ..\frontend
START /B serve -s build -p 5000

cd ..

start firefox "http://localhost:5000/"
