import { v4 as uuid } from 'uuid';

export type Person = {
    id: typeof uuid;
    name: string;
    group_id: typeof uuid;
}

export type Product = {
    id: typeof uuid;
    name: string;
    price: number;
}