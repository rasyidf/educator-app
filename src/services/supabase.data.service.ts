
// import { BehaviorSubject } from 'rxjs';
import { supabase } from './supabase';

export class SupabaseDataService {

  constructor() { }

  public async getRow(table: string, whereColumn: string, whereValue: any, columnList: string = '*') {
    const { data, error } =
      await supabase.from(table)
        .select(columnList)
        .eq(whereColumn, whereValue)
        .limit(1)
        .single(); // return a single object (not an array)
    return { data, error };
  }
  public async getRows(table: string, whereColumn: string, whereValue: any, columnList: string = '*', offset: number = 0, limit: number = 100) {
    const { data, error } =
      await supabase.from(table)
        .select(columnList)
        .eq(whereColumn, whereValue)
        .range(offset, offset + limit);
    return { data, error };
  }
  
  public async setRows(table: string, rows: any[]) {
    const { data, error } =
      await supabase.from(table)
        .insert(rows);
    return { data, error };
  }
  public async setRow(table: string, row: any) {
    const { data, error } =
      await supabase.from(table)
        .insert(row);
    return { data, error };
  }
  public async updateRow(table: string, row: any, whereColumn: string, whereValue: any) {
    const { data, error } =
      await supabase.from(table)
        .update(row)
        .eq(whereColumn, whereValue);
    return { data, error };
  }


}
