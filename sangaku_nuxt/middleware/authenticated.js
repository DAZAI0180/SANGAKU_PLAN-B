export default function ({ store, redirect }) {
    // ユーザーが認証されていないとき
    if (!store.login) {
      return redirect('/login')
    }
  }