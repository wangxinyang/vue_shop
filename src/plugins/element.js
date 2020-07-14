import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  // ヒントコンポネート
  Message
} from 'element-ui'
import lang from 'element-ui/lib/locale/lang/ja'
import locale from 'element-ui/lib/locale'

locale.use(lang)

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
