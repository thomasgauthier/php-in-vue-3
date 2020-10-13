<template>
  <WPNav />
  <h1>{{ php`the_title();` }}</h1>
  <div v-html="php`the_content();`" />
</template>
<script lang="ts">
import WPNav from "../components/WPNav.vue";
import { Options, Vue } from "vue-class-component";

@Options({
  components: { WPNav },
})
export default class Home extends Vue {}
</script>

