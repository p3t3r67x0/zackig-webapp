<template>
<div class="container mx-auto">
  <div class="mx-3 lg:mx-0">
    <div class="bg-white rounded-lg p-3">
      <h1 class="text-xl lg:text-2xl font-medium mb-3">Edit task</h1>
      <editor-component target="task" action="update" :taskId="taskId" :challengeId="challengeId" />
    </div>
  </div>
</div>
</template>

<script>
import EditorComponent from '@/components/editors/task'

export default {
  data() {
    return {
      challengeId: ''
    }
  },
  computed: {
    taskId() {
      return this.$route.params.id || ''
    }
  },
  components: {
    EditorComponent
  },
  middleware: 'auth',
  methods: {}
}
</script>
