import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {University} from './university.interface';

// Interface que representa exatamente o que o backend retorna
interface BackendUniversity {
  id: number;
  name: string;
  acronym?: string;
  city?: string;
  state?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  private readonly apiUrl = 'https://backend-go-production-c4f4.up.railway.app/api/universities';

  constructor(private readonly http: HttpClient) {
  }

  getAllUniversities(): Observable<University[]> {
    // Fazer requisição para o formato real do backend
    return this.http.get<BackendUniversity[]>(this.apiUrl).pipe(
      map(backendUniversities =>
        backendUniversities.map(backendUni => ({
          id: backendUni.id.toString(),           // Converter number -> string
          name: backendUni.name,
          acronym: backendUni.acronym || '',
          city: backendUni.city || '',
          state: backendUni.state || '',
          active: true                            // Assumir todas como ativas (já que backend filtra)
        } as University))
      ),
      catchError(error => {
        console.error('Erro ao buscar universidades:', error);
        return of([]);
      })
    );
  }

  getUniversityById(id: string): Observable<University | null> {
    return this.http.get<BackendUniversity>(`${this.apiUrl}/${id}`).pipe(
      map(backendUni => ({
        id: backendUni.id.toString(),
        name: backendUni.name,
        acronym: backendUni.acronym || '',
        city: backendUni.city || '',
        state: backendUni.state || '',
        active: true
      } as University)),
      catchError(error => {
        console.error('Erro ao buscar universidade por ID:', error);
        return of(null);
      })
    );
  }
}
