phpのサーバー立てるコマンド
php artisan serve

vueのサーバー立てるコマンド
yarn run dev

nuxt側
<script>
  export default {
    async asyncData ({ app }) {
      const data = await app.$axios.$get('http://localhost:8000/api/sega?ore=kimi')
      return { data }
    }
  }
</script>

Laravel側のルーティング
Route::get('/sega', 'Api\HelloController@index');

getはこんな感じで受け取れる
public function index(Request $request){
        echo $request->get('ore');
    }