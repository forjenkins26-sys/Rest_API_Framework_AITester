import { ApiClient } from './api-client';

export interface ApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

export class ProductsApi {
  constructor(private readonly api: ApiClient) {}

  list(): Promise<ApiProduct[]> {
    return this.api.get<ApiProduct[]>('/products');
  }

  byId(id: number): Promise<ApiProduct> {
    return this.api.get<ApiProduct>(`/products/${id}`);
  }

  categories(): Promise<string[]> {
    return this.api.get<string[]>('/products/categories');
  }

  byCategory(category: string): Promise<ApiProduct[]> {
    return this.api.get<ApiProduct[]>(`/products/category/${category}`);
  }

  create(payload: Omit<ApiProduct, 'id' | 'rating'>): Promise<ApiProduct> {
    return this.api.post<ApiProduct>('/products', payload);
  }
}
