# Daily Diet App

## Requisitos Funcionais

- [x] **RF01**: O sistema deve permitir a criação de um usuário.
- [x] **RF02**: O sistema deve ser capaz de identificar o usuário entre as requisições.
- [ ] **RF03**: O sistema deve permitir o registro de uma refeição feita pelo usuário, contendo as seguintes informações: Nome, Descrição, Data e Hora, e se está dentro ou não da dieta.
- [ ] **RF04**: O sistema deve permitir a edição de uma refeição, podendo alterar todas as informações registradas.
- [ ] **RF05**: O sistema deve permitir a exclusão de uma refeição.
- [ ] **RF06**: O sistema deve permitir a listagem de todas as refeições de um usuário.
- [ ] **RF07**: O sistema deve permitir a visualização de uma única refeição.
- [ ] **RF08**: O sistema deve permitir a recuperação das métricas de um usuário, como quantidade total de refeições registradas, quantidade total de refeições dentro da dieta, quantidade total de refeições fora da dieta, e a melhor sequência de refeições dentro da dieta.

## Requisitos Não Funcionais

- [ ] **RNF01**: O sistema deve garantir que apenas o usuário que criou a refeição possa visualizar, editar e apagar a mesma.
- [x] **RNF02**: O registro de um usuário é feito por Nome de Usuário, Email e Senha.
- [x] **RNF03**: O login de um usuário é feito pelo Email e Senha.
- [x] **RNF04**: O usuário permanece logado por 60 dias corridos, após isso é necessário autenticar novamente.
- [x] **RNF05**: O banco de dados utilizado é Postgresql.
- [x] **RNF06**: Não pode ter mais de um mesmo email cadastrado no banco de dados.
- [ ] **RNF07**: Uma vez criada a conta, o usuário não poderá alterar nada de seu perfil, apenas as refeições criadas, como por exemplo: Nome de Usuário, Email e Senha.
- [x] **RNF08**: Não haverá validação de email.
- [x] **RNF09**: A senha precisa possuir no mínimo 5 caracteres, um caracter especial e um caracter em letra maiúscula.
- [x] **RNF10**: O nome de usuário precisa possuir no mínimo 5 caracteres.
- [x] **RNF11**: O email inserido precisa ser realmente um email, exemplo: exemplo@gmail.com

## Regras de Negócio

- [ ] **RN01**: As refeições devem ser relacionadas a um usuário.
