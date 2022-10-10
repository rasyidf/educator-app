import { createClient, Provider, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { keys } from './keys.service';

const supabase: SupabaseClient = createClient(keys.SUPABASE_URL, keys.SUPABASE_KEY);

export class SupabaseAuthService {
  public user = new BehaviorSubject<User | null>(null);
  private _user: User | null = null;

  constructor() {
    this.loadUser();
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && (session != null)) {
        this._user = session.user;
        this.user.next(session.user);
      } else {
        this._user = null;
        this.user.next(null);
      }
    });
  }

  // ************** auth ****************

  private loadUser(): void {
    const user = supabase.auth.user();
    if (user != null) {
      this._user = user;
      this.user.next(user);
    } else {
      // no current user
    }
  };

  public signUpWithEmail = async (email: string, password: string): Promise<any> => {
    const { user, session, error } = await supabase.auth.signUp({
      email,
      password
    });
    return { user, session, error };
  };

  public signInWithEmail = async (email: string, password: string): Promise<any> => {
    const { user, session, error } = await supabase.auth.signIn({
      email,
      password
    });
    return { user, session, error };
  };

  public signInWithProvider = async (provider: Provider): Promise<any> => {
    const { user, session, error } = await supabase.auth.signIn({
      provider
    }, {
      redirectTo: window.location.origin
    });
    return { user, session, error };
  };

  public resetPassword = async (email: string): Promise<any> => {
    const { data, error } = await supabase.auth.api.resetPasswordForEmail(email,
      {
        redirectTo: window.location.origin
      });
    return { data, error };
  };

  public sendMagicLink = async (email: string): Promise<any> => {
    const { user, session, error } = await supabase.auth.signIn({
      email
    }, {
      redirectTo: window.location.origin
    });
    return { user, session, error };
  };

  public updatePassword = async (accessToken: string, newPassword: string): Promise<any> => {
    const { error, data } = await supabase.auth.api
      .updateUser(accessToken, { password: newPassword });
    return { error, data };
  };

  public signOut = async (): Promise<any> => {
    const { error } = await supabase.auth.signOut();
    if (error == null) {
      this.user.next(null);
      this._user = null;  
    }
    return { error };
  };

  public getProfile = async (): Promise<any> => {
    if (this._user == null) {
      return Promise.reject('Not signed in');
    }

    return supabase
    .from('profiles')
    .select('*')
    .eq('id', this._user?.id)
    .single();
  };

  public updateProfile = async (data: any): Promise<any> => {
    return supabase
      .from('profiles')
      .upsert({ ...data, id: this._user?.id });
  };

}
