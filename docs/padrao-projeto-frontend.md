# Padrao de Projeto do Frontend

Este frontend segue uma organizacao por dominio e por acao de usuario.

```text
src/
|
|__ entities/                <- Modelos do dominio (Viagem, Onibus, Motorista)
|   |__ viagem/
|   |   |__ model.ts
|   |   |__ api.ts
|   |   |__ ui/ViagemCard.tsx
|   |
|   |__ onibus/
|
|__ features/                <- Acoes do usuario (Inscrever, CheckIn, IniciarViagem)
|   |__ inscrever-viagem/
|   |   |__ model.ts
|   |   |__ ui/BotaoInscrever.tsx
|   |
|   |__ checkin-motorista/
|
|__ components/              <- Blocos compostos da UI (Sidebar, DashboardMetrics)
|   |__ shared/              <- Componentes UI, utilidades, tipos base
|
|__ pages/                   <- Composicao final (cola components + features)
```

## Regras de organizacao

- `entities/`: representa objetos e regras do dominio.
- `features/`: implementa casos de uso e fluxos de interacao do usuario.
- `components/`: concentra blocos visuais reutilizaveis.
- `components/shared/`: abriga componentes base, utilitarios e tipos comuns.
- `pages/`: monta telas finais combinando `entities`, `features` e `components`.

## Diretriz de dependencia

- `entities` nao deve depender de `features` ou `pages`.
- `features` pode depender de `entities` e de `components/shared`.
- `pages` pode depender de todas as camadas para compor a tela final.
