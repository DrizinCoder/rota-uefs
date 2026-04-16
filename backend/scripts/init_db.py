from app.database.db import create_db_and_tables

# Script para criação e população do banco com dados mockado

if __name__ == "__main__":
    create_db_and_tables()    

    print("Banco de dados criado com sucesso!")