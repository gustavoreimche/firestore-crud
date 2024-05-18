# FirestoreCrudLib

Esta biblioteca simplifica operações CRUD (Create, Read, Update, Delete) em uma coleção do Firestore para projetos Angular.

## Começando

Para começar, instale o pacote @angular/fire em sua aplicação Angular usando o comando ng add @angular/fire.

No seu arquivo app.module.ts, certifique-se de importar e configurar o AngularFireModule corretamente:

```typescript
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, RouterModule.forRoot(routes), AngularFireModule.initializeApp(environment.firebaseConfig)],
  providers: [provideFirestore(() => getFirestore())],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Após essa configuração inicial, você pode criar suas interfaces e serviços exetendendo `FirestoreCrudService` conforme necessário. Por exemplo:

Para instanciar a classe é necessário chamar o construtor dela através do `super()` enviando os seguintes parametros:

@param {string} dbPath O caminho da coleção no Firestore.

@param {AngularFirestore} db Uma instância do AngularFirestore.

```typescript
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { FirestoreCrudService } from "firestore-crud-lib";
import { User } from "../models/user.model";

interface User {
  id: string;
  nome: string;
  login: string;
  photoUrl?: string;
}

@Injectable()
export class UserService extends FirestoreCrudService<User> {
  constructor(db: AngularFirestore) {
    super("users", db);
  }
}
```

## Métodos disponíveis

A classe FirestoreCrudService fornece métodos úteis para realizar operações CRUD (Create, Read, Update, Delete) em uma coleção do Firestore.

### listAll()

Método para obter todos os documentos da coleção.

```typescript
listAll(): Observable<T[]>
```

Retorna um Observable que emite uma matriz de documentos da coleção.

---

### getById(id: string)

Método para obter um documento pelo seu ID.

```typescript
getById(id: string): Observable<T>
```

Parâmetros:

id: O ID do documento a ser obtido.
Retorna um Observable que emite o documento encontrado.

---

### create(value: T, id?: string)

Método para criar um novo documento na coleção.

```typescript
create(value: T, id?: string): Observable<T>
```

Parâmetros:

value: O valor do documento a ser criado.
id (opcional): O ID do documento. Se não fornecido, um ID será gerado automaticamente.
Retorna um Observable que emite o documento criado.

---

### update(id: string, value: T)

Método para atualizar um documento existente na coleção.

```typescript
update(id: string, value: T): Observable<string>
```

Parâmetros:

id: O ID do documento a ser atualizado.
value: O novo valor do documento.
Retorna um Observable que emite uma mensagem de sucesso ou erro.

---

### delete(id: string)

Método para excluir um documento da coleção.

```typescript
delete(id: string): Observable<string>
```

Parâmetros:

id: O ID do documento a ser excluído.
Retorna um Observable que emite uma mensagem de sucesso ou erro.

### Exemplo de uso:

```typescript
import { Component } from "@angular/core";
import { UserService } from "./services/user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  providers: [UserService],
})
export class AppComponent {
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.userService.listAll().subscribe((users) => {
      console.log(users);
    });
  }
}
```
