import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable, catchError, from, map, take } from 'rxjs';

@Injectable()
export abstract class FirestoreCrudService<T> {
  private _dbPath: string;
  private _collectionRef: AngularFirestoreCollection<T>;

  /**
   * Construtor da classe FirestoreCrudService.
   * @param {string} dbPath O caminho da coleção no Firestore.
   * @param {AngularFirestore} db Uma instância do AngularFirestore.
   */
  constructor(dbPath: string, db: AngularFirestore) {
    this._dbPath = dbPath;
    this._collectionRef = db.collection(this._dbPath);
  }

  /**
   * Obtém todos os documentos da coleção.
   * @returns {Observable<T[]>} Um Observable que emite uma lista de documentos.
   */
  listAll(): Observable<T[]> {
    return this._collectionRef.valueChanges({ idField: 'id' }).pipe(take(1));
  }

  /**
   * Obtém um documento pelo seu ID.
   * @param {string} id O ID do documento.
   * @returns {Observable<T>} Um Observable que emite o documento encontrado.
   */
  getById(id: string): Observable<T> {
    return this._collectionRef
      .doc(id)
      .get()
      .pipe(map((doc) => ({ ...(doc.data() as T), id: doc.id })));
  }

  /**
   * Cria um novo documento na coleção.
   * @param {T} value O valor do documento a ser criado.
   * @param {string} [id] (opcional) O ID do documento. Se não fornecido, um ID será gerado automaticamente.
   * @returns {Observable<T>} Um Observable que emite o documento criado.
   */
  create(value: T, id?: string): Observable<T> {
    if (id)
      return from(this._collectionRef.doc(id).set({ ...value })).pipe(
        map(() => ({ ...value }))
      );
    else
      return from(this._collectionRef.add({ ...value })).pipe(
        map((doc) => ({ id: doc.id, ...value }))
      );
  }

  /**
   * Atualiza um documento existente na coleção.
   * @param {string} id O ID do documento a ser atualizado.
   * @param {T} value O novo valor do documento.
   * @returns {Observable<string>} Um Observable que emite uma mensagem de sucesso ou erro.
   */
  update(id: string, value: T): Observable<string> {
    return from(this._collectionRef.doc(id).update(value)).pipe(
      map(() => 'Registro alterado com sucesso!'),
      catchError((err) => {
        return 'Erro ao alterar registro: ' + err.toString();
      })
    );
  }

  /**
   * Exclui um documento da coleção.
   * @param {string} id O ID do documento a ser excluído.
   * @returns {Observable<string>} Um Observable que emite uma mensagem de sucesso ou erro.
   */
  delete(id: string): Observable<string> {
    return from(this._collectionRef.doc(id).delete()).pipe(
      map(() => 'Registro excluído com sucesso!'),
      catchError((err) => {
        return 'Erro ao excluir registro: ' + err.toString();
      })
    );
  }
}
