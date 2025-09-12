export interface University {
  id: string;
  name: string;
  acronym: string;
  city?: string;
  state?: string;
  active: boolean;
}

// Interface que representa o que o backend retorna
interface BackendUniversity {
  id: number;
  name: string;
  acronym?: string;
  city?: string;
  state?: string;
}

// Interface que representa a resposta da API
export interface UniversityResponse {
  data: University[];
  total: number;
}
