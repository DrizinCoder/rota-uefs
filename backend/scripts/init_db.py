from app.database.db import init_db

# Script para criação e população do banco com dados mockado

if __name__ == "__main__":
    init_db()    

    print("Banco de dados criado com sucesso!")