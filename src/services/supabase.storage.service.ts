// create wrapper for supabase bucket storage service
//
import { supabase } from './supabase';

export class SupabaseStorageService {

    constructor() { }

    public async uploadFile(bucket = "files", path: string, file: File) {
        const { data, error } = await supabase.storage.from(bucket).upload(path, file);
        return { data, error };
    }

    public async getFile(bucket = "files", path: string) {
        const { data, error } = await supabase.storage.from(bucket).download(path);
        return { data, error };
    }

    public async deleteFile(bucket = "files", path: string) {
        const { data, error } = await supabase.storage.from(bucket).remove([path]);
        return { data, error };
    }

}