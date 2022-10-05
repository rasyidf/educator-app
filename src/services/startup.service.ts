
export class StartupService {
  public getDefaultRoute (): string {
    return '/page'
  }

  public getStartupRoute (): string {
    // handle password recovery links
    const hash = window.location.hash

    // explicit hash string check from null undefined and empty string return if empty
    if ((hash == null) || (hash === undefined) || (hash === '')) {
      return this.getDefaultRoute()
    }

    // console.log('#hash', hash);
    if ((hash !== '') && hash.substring(0, 1) === '#') {
      // console.log('processing hash');
      const tokens = hash.substring(1).split('&')
      // console.log('tokens', tokens);
      const entryPayload: Record<string, string> = {}
      tokens.forEach((token) => {
        const pair = (token + '=').split('=')
        entryPayload[pair[0]] = pair[1]
      })
      // console.log('entryPayload', entryPayload);
      // console.log('entryPayload.type', entryPayload?.type);
      if (entryPayload?.type === 'recovery') { // password recovery link
        return `/resetpassword/${(entryPayload.access_token !== '') ? entryPayload.access_token : ''}`
        // router.navigateByUrl(`/resetpassword/${entryPayload.access_token}`);
      }
    }
    // console.log('window.location', window.location);
    let path = window.location.pathname.replace(/\//, '')
    // remove querystring from path
    if (path.includes('?')) {
      path = path.substring(0, path.indexOf('?'))
    }
    return path
  }
}
