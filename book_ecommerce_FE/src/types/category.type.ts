export type Category = {
    id: number,
    name: string,
    description: string,
    parent_id: number | null,
    active: boolean,
    created_at?: Date,
    updated_at?: Date,
    children?: Category[]
}