#  Script de População do Banco de Dados

Este guia orienta sobre como resetar o ambiente e popular o banco de dados do projeto **Rota-UEFS** de forma automatizada.

## 🛠️ Fluxo de Preparação

Antes de rodar o script de população, é essencial garantir que o banco de dados esteja limpo e as migrações aplicadas corretamente. Execute os comandos abaixo na ordem indicada:

| Passo | Comando | Descrição |
| --- | --- | --- |
| **1** | `make down` | Para todos os containers ativos. |
| **2** | `make clean` | Remove volumes e resíduos de bancos de dados antigos. |
| **3** | `make up` | Sobe o ambiente do zero, aplicando as novas migrações. |

---

## 📥 Como Popular o Banco

Após subir o ambiente com o `make up`, você deve executar o comando de população.

> [!IMPORTANT]
> Certifique-se de estar na **raiz do projeto** (`rota-uefs`) antes de iniciar.

### Comando de Execução Única

Copie e cole o bloco abaixo no seu terminal:

```bash
cd backend/scripts && \
docker cp populate.py rota_uefs-backend-1:/app/scripts/populate.py && \
docker exec -it -w /app rota_uefs-backend-1 env PYTHONPATH=. python app/scripts/populate.py && \
cd ../..
```

---

## 🔍 O que este comando faz?

Para sua segurança, aqui está o detalhamento das etapas executadas:

1. **Navegação**: Entra na pasta onde o script local está armazenado.
2. **Cópia**: Envia o arquivo `populate.py` da sua máquina para dentro do container Docker do backend.
3. **Execução**: Roda o script dentro do container utilizando o `PYTHONPATH` correto para que as rotas e modelos sejam reconhecidos.
4. **Retorno**: Volta para a raiz do projeto (`rota-uefs`).

---

## 💡 Dicas Adicionais

* **Erros de Conexão**: Se o script falhar, verifique se o container `rota_uefs-backend-1` está realmente rodando com `docker ps`.
* **Logs**: Você pode acompanhar a inserção dos dados observando os logs do terminal durante a execução do comando acima pelo comando `make logs`.

