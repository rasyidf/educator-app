
// import { BehaviorSubject } from 'rxjs';
import { supabase } from './supabase'

export class SupabaseDataService {
  public async getRow (table: string, columnList: string = '*'): Promise<any> {
    const { data, error } = await supabase
      .from(table)
      .select(columnList)
      .single()
    if (error != null) {
      console.log('error', error)
    }
    return data
  }

  public async getRows (table: string, columnList: string = '*'): Promise<any> {
    const { data, error } = await supabase
      .from(table)
      .select(columnList)
    if (error != null) {
      console.log('error', error)
    }
    return data
  }

  public async getFilterRow (table: string, whereColumn: string, whereValue: any, columnList: string = '*'): Promise<any> {
    const { data, error } =
      await supabase.from(table)
        .select(columnList)
        .eq(whereColumn, whereValue)
        .limit(1)
        .single() // return a single object (not an array)
    return { data, error }
  }

  public async getFilterRows (table: string, whereColumn: string, whereValue: any, columnList: string = '*', offset: number = 0, limit: number = 100): Promise<any> {
    const { data, error } =
      await supabase.from(table)
        .select(columnList)
        .eq(whereColumn, whereValue)
        .range(offset, offset + limit)
    return { data, error }
  }

  public async setRows (table: string, rows: any[]): Promise<any> {
    const { data, error } =
      await supabase.from(table)
        .insert(rows)
    return { data, error }
  }

  public async setRow (table: string, row: any): Promise<any> {
    const { data, error } =
      await supabase.from(table)
        .insert(row)
    return { data, error }
  }

  public async updateRow (table: string, row: any, whereColumn: string, whereValue: any): Promise<any> {
    const { data, error } =
      await supabase.from(table)
        .update(row)
        .eq(whereColumn, whereValue)
    return { data, error }
  }
}
