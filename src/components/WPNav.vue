<template>
  <ul>
    <li v-for="item in menuItems" :key="item.$ID">
      <!-- {{ inspect(item) }} -->
      <a :href="item.$url">{{ item.$title }}</a>
    </li>
  </ul>
  <!-- <div>{{ inspect(menuItems[0]) }}</div> -->
</template>



<script lang="ts">
import { Options, Vue } from "vue-class-component";
const util = require("util");

@Options({
  components: {},
})
export default class WPNav extends Vue {
  menuItems: any = [];

  beforeCreate() {
    this.menuItems = php`
$menuLocations = get_nav_menu_locations(); // Get nav locations

$menuID = $menuLocations['primary']; // Get the *primary* menu ID

return wp_get_nav_menu_items($menuID);`;
  }

  inspect(...args: any[]) {
    return util.inspect(args);
  }
}
</script>