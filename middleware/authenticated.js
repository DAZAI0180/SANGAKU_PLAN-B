export default{
  async fetch ({ store, redirect }) {
    console.log("うごいた");
  if (store.state.user.user == "") {
    return redirect('/login')
  }
}
}