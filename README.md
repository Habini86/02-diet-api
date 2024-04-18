# Daily Diet App

## Usuários

- [x] **RF01: Criar Usuário**: Permite a criação de um novo usuário com as informações: nome de usuário, email e senha.
  - [x] **RN02**: Não permite a criação de usuários com o mesmo email.
  - [x] **RNF02**: Validação do formato do email.
  - [x] **RNF03**: A senha deve ter no mínimo 5 caracteres, um caracter especial e um caracter maiúsculo.
  - [x] **RNF04**: O nome de usuário deve ter no mínimo 5 caracteres.
- [x] **RF02: Identificar Usuário**: Permite a identificação do usuário por meio de Cookie UUID na requisição. Este cookie é usado para autenticar as transações de refeições do usuário.
- [x] **RF03: Login do Usuário**: Permite que o usuário faça login fornecendo email e senha. Retorna o nome de usuário e gera um cookie UUID para autenticação.

## Refeições

- [x] **RF04: Registrar Refeição**: Permite o registro de uma nova refeição para um usuário, incluindo: nome, descrição, data e hora, e se está dentro ou fora da dieta.
  - [x] **RNF05**: O nome da refeição deve ter no mínimo 5 caracteres.
  - [x] **RNF06**: A descrição da refeição deve ter no mínimo 5 caracteres.
  - [x] **RNF07**: O horário da refeição deve estar no formato hh:mm.
  - [x] **RNF08**: O campo dieta deve ser um valor booleano (verdadeiro ou falso).
  - [x] **RN01**: As refeições devem estar associadas ao usuário autenticado.
- [x] **RF05: Editar Refeição**: Permite a edição de uma refeição existente, alterando qualquer um dos seus dados.
  - [x] **RN03**: Somente o usuário que criou a refeição pode editá-la.
- [x] **RF06: Excluir Refeição**: Permite a exclusão de uma refeição existente.
  - [x] **RN04**: Somente o usuário que criou a refeição pode excluí-la.
- [x] **RF07: Listar Refeições**: Permite a listagem de todas as refeições de um usuário.
  - [x] **RN05**: Somente as refeições do usuário autenticado são listadas.
- [x] **RF08: Visualizar Refeição**: Permite a visualização de uma refeição específica por meio do seu identificador.
  - [x] **RN06**: Somente o usuário que criou a refeição pode visualizá-la.

## Métricas

- [x] **RF09: Recuperar Métricas**: Permite a recuperação de métricas de um usuário, incluindo:
  - [x] Quantidade total de refeições registradas;
  - [x] Quantidade total de refeições dentro da dieta;
  - [x] Quantidade total de refeições fora da dieta;
  - [x] Melhor sequência de refeições dentro da dieta.

## Autenticação

- [x] **RNF13: Login**: Permite o login de um usuário por meio de seu email e senha, retornando um Cookie UUID.
- [x] **RNF14: Autenticação**: A API utiliza autenticação com Cookie UUID para proteger seus recursos. O Cookie UUID deve ser enviado em todas as requisições que necessitem de autenticação.
- [x] **RNF15: Sessão**: A sessão do usuário permanece ativa por 60 dias corridos após o login. Após esse período, o usuário precisa autenticar novamente.

## Banco de Dados

- [x] **RNF16: Banco de Dados**: O banco de dados utilizado para armazenar os dados da aplicação é o PostgreSQL.

## Observações

- [x] A API não possui endpoints para alterar o nome de usuário, email ou senha do usuário.
- [x] A validação do email não é realizada no momento do cadastro do usuário.