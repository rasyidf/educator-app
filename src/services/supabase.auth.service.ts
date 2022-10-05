import { createClient, Provider, SupabaseClient, User } from '@supabase/supabase-js'
import { BehaviorSubject } from 'rxjs'
import { keys } from './keys.service'

const supabase: SupabaseClient = createClient(keys.SUPABASE_URL, keys.SUPABASE_KEY)

export class SupabaseAuthService {
  public user = new BehaviorSubject<User | null>(null)
  private _user: User | null = null

  constructor () {
    this.loadUser()
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && (session != null)) {
        this._user = session.user
        this.user.next(session.user)
      } else {
        this._user = null
        this.user.next(null)
      }
    })
  }

  // ************** auth ****************

  private async loadUser () {
    const user = supabase.auth.user()
    if (user != null) {
      this._user = user
      this.user.next(user)
    } else {
      // no current user
    }
  };

  public signUpWithEmail = async (email: string, password: string) => {
    const { user, session, error } = await supabase.auth.signUp({
      email,
      password
    })
    return { user, session, error }
  }

  public signInWithEmail = async (email: string, password: string) => {
    const { user, session, error } = await supabase.auth.signIn({
      email,
      password
    })
    return { user, session, error }
  }

  public signInWithProvider = async (provider: Provider) => {
    const { user, session, error } = await supabase.auth.signIn({
      provider
    }, {
      redirectTo: window.location.origin
    })
    return { user, session, error }
  }

  public resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.api.resetPasswordForEmail(email,
      {
        redirectTo: window.location.origin
      })
    return { data, error }
  }

  public sendMagicLink = async (email: string) => {
    const { user, session, error } = await supabase.auth.signIn({
      email
    }, {
      redirectTo: window.location.origin
    })
    return { user, session, error }
  }

  public updatePassword = async (access_token: string, new_password: string) => {
    const { error, data } = await supabase.auth.api
      .updateUser(access_token, { password: new_password })
    return { error, data }
  }

  public signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error == null) {
      this.user.next(null)
    }
    return { error }
  }

  public getProfile = async () => {
    return await supabase
      .from('profiles')
      .select('*')
      .eq('id', this._user?.id)
      .single()
  }
}
