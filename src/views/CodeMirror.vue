<template>
  <codemirror
    v-model="code"
    placeholder="Code gose here..."
    :style="{ width:'400px' ,height: '400px' }"
    :autofocus="true"
    :indent-with-tab="true"
    :tabSize="2"
    :extensions="extensions"
    @ready="log('ready', $event)"
    @change="log('change', $event)"
    @focus="log('focus', $event)"
    @blur="log('blur', $event)"
  /> <br />
  <el-button style="float:right">确认</el-button>
</template>

<script>
import { Codemirror } from "vue-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
// import {getCode} from '@/utils/useExport'

import { ref } from "vue";
export default {
  components: {
    Codemirror,
  },
  setup() {
    const code = ref(`<!DOCTYPE html>
<html lang="">
    <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <meta name="referrer" content="no-referrer">
    <title></title>
    <style type="text/css">
        
    </style>
    </head>
    <body>
        
    </body>
</html>`);
    

    // const code = ref();
    // code.value = getCode('.preview_canvas')

    const extensions = [javascript(), oneDark];

    return {
      code,
      extensions,
      log: console.log,
    };
  },
};
</script>