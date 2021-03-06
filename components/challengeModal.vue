<template>
<div class="modal modal-active fixed w-full h-screen top-0 left-0 flex items-center justify-center">
  <div class="modal-overlay absolute w-full h-screen bg-gray-900 opacity-50" @click="closeModal"></div>

  <div class="modal-container bg-white lg:mx-16 sm:mx-2 md:mx-5 rounded shadow-lg z-50">
    <div class="modal-content py-4 text-left px-6" style="height: 95vh">
      <div class="flex justify-between items-center pb-3">
        <p class="text-2xl font-bold" v-if="challenge">{{ challenge.title }}</p>
        <div class="modal-close cursor-pointer z-50" v-on:click="closeModal">
          <svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
          </svg>
        </div>
      </div>
      <div class="xl:flex" v-if="challenge">
        <div v-if="challenge" class="w-auto border-r-2 p-4 m-4 overflow-scroll" :class="[showtasks ? 'modal-text-small' : 'modal-text']">
          <vue-markdown-plus class="markdown" :source="challenge.content" />
        </div>
        <div v-if="challenge && challenge.tasks" class="w-full p-4 m-4 w-2/3 p-4">
          <div class="pb-3">
            <h3 class="text-xl"><fa :icon="['fas', showtasks ? 'angle-up' : 'angle-down']" @click="toggleShowTasks" class="inline-block cursor-pointer text-xl lg:text-2xl w-5 mr-3 md:hidden" /> Tasks</h3>
            <hr>
          </div>
          <div class="overflow-scroll hidden md:block" :class="[ showtasks ? 'block-modal modal-text' : 'modal-text-small']">
            <ul :key="challenge.tasks.length">
              <li v-for="task in challenge.tasks" :key="task._id" class="lg:flex justify-between w-full odd:bg-gray-100 even:bg-gray-200 px-2 py-3">
                <div class="flex justify-between mr-3 mb-3 lg:mb-0">
                  <span :key="progressChanged">
                    <fa :icon="['fas', 'check-square']" @click="toggleProgressStatus(challenge._id, task._id)" :class="[  task.progress == 'done' ? 'text-green-500' : 'text-gray-500']"
                      class="inline-block cursor-pointer text-xl lg:text-2xl w-5 mr-3" />
                  </span>
                  <span>
                    <nuxt-link :to="'/account/task/' + task._id" class="text-blue-600 hover:text-blue-800">
                      {{ task.title.substring(0, 20 ) }}<span v-if="task.title.length > 20">...</span>
                    </nuxt-link>
                    <span class="lg:hidden text-gray-600">
                      ({{ $t('duration') }}: {{ task.duration }} {{ $tc('days', task.duration != 1 ? 0 : 1)}})
                    </span>
                  </span>
                </div>
                <span class="hidden lg:inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">{{ $t('duration') }}: {{ task.duration }}
                  {{ $tc('days', task.duration != 1 ? 0 : 1)}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="flex justify-end pt-2">
        <button class="modal-close px-4 bg-blue-500 p-3 rounded-lg text-white hover:bg-blue-400" v-on:click="closeModal">Close</button>
      </div>

    </div>
  </div>
</div>
</template>
<style scoped>
.modal-text {
  height: 40vh;
}
.modal-text-small {
  height: 20vh;
}
.modal-tasks-small {
  height: 40vh;
}
.modal-tasks-small {
  height: 20vh;
}


@media (min-width: 1280px) {
  .modal-text {
    height: 75vh !important;
  }

  .modal-tasks {
    height: 35vh !important;
  }
}

.block-modal {
  display: block !important;
}
</style>
<script>
import VueMarkdownPlus from 'vue-markdown-plus'

export default {
  data() {
    return {
      statusClass: "",
      progressChanged: 0,
      showtasks: false
    }
  },
  props: ['challenge', 'status'],
  computed: {},
  mounted() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal()
      }
    })
  },
  methods: {
    closeModal() {
      this.$emit('clicked', false)
    },
    toggleProgressStatus(challengeId, taskId) {
      this.$axios.$put(`${process.env.API_URL}/api/v1/challenge/task/progress`, {
        challenge_id: challengeId,
        task_id: taskId
      }).then(res => {
        console.log(this.$t(res.message))

        const taskIndex = this.challenge.tasks.findIndex(task => task._id === taskId)

        if (taskIndex >= 0) {
          let task = this.challenge.tasks[taskIndex]
          task['progress'] = res.progress

          this.$set(this.challenge.tasks, taskIndex, task)
          this.progressChanged += 1
        }
      }).catch(error => {
        console.log(error)
      })
    },
    toggleShowTasks() {
      this.showtasks = !this.showtasks
    }
  },
  components: {
    VueMarkdownPlus
  }
}
</script>
