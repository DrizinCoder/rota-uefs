make down
make clean
make up
cd backend/app
docker cp populate.py rota_uefs-backend-1:/app/app/populate.py
docker exec -it -w /app rota_uefs-backend-1 env PYTHONPATH=. python app/populate.py

