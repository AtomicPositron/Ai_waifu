<script setup>
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import { toast } from 'vue-sonner'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ref, onMounted, nextTick } from 'vue'

let name = ref('')
let personality = ref('Soft')
let memory = ref('Ephemeral')
let gender = ref('Female')
let relationship = ref('Friend')
let userMessage = ref('')
let country = ref('Nigeria')
let language = ref('English')
let chatHistory = ref([])
const waifuAiKey = import.meta.env.VITE_WAIFU_AI_KEY
let modal_state = ref(true)
let call_state = ref(false)
let waifu_info = ref({})
let isSending = ref(false)

onMounted(() => {
  const storedInfo = localStorage.getItem('waifuInfo')
  if (storedInfo) {
    const info = JSON.parse(storedInfo)
    name.value = info.name || ''
    personality.value = info.personality || 'Soft'
    memory.value = info.memory_type || 'Ephemeral'
    relationship.value = info.relationship_mode || 'Friend'
    gender.value = info.gender || 'Female'
    language.value = info.language || 'English'
    country.value = info.country || 'Nigeria'
    modal_state.value = false
  }
  retrivalHistory()
})

const retrivalHistory = () => {
  const stored = localStorage.getItem('chatHistory')
  if (!stored) {
    localStorage.setItem('chatHistory', JSON.stringify([]))
    chatHistory.value = []
  } else {
    chatHistory.value = JSON.parse(stored)
  }
}

const createWaifu = () => {
  if (name.value == '') {
    toast('Invalid Credentials', {
      variant: 'destructive',
      description: 'Please Fill the name form',
    })
  } else {
    waifu_info.value = {
      name: name.value,
      personality: personality.value,
      memory_type: memory.value,
      relationship_mode: relationship.value,
      gender: gender.value,
      language: language.value,
      country: country.value,
      adRemoval: 'true',
      modalState: false,
    }

    localStorage.setItem('waifuInfo', JSON.stringify(waifu_info.value))
    modal_state.value = false
    retrivalHistory()
  }
}

const sendMessage = async () => {
  const trimmedMessage = userMessage.value.trim()
  if (!trimmedMessage || isSending.value) return

  isSending.value = true

  chatHistory.value.push({
    message: trimmedMessage,
    from: 'You',
    time: Date().split(' ')[4],
  })
  localStorage.setItem('chatHistory', JSON.stringify(chatHistory.value))
  userMessage.value = ''

  const waifuReply = await generateWaifuReply(trimmedMessage)
  chatHistory.value.push({
    message: waifuReply,
    from: name.value,
    time: Date().split(' ')[4],
  })
  localStorage.setItem('chatHistory', JSON.stringify(chatHistory.value))

  const container = document.querySelector('.textwindow')
  container.scrollTop = container.scrollHeight

  isSending.value = false
}

const generateWaifuReply = async (msg) => {
  let historyArr = []
  if (memory.value === 'Short-Term' || memory.value === 'LongTerm') {
    historyArr = chatHistory.value
  } else {
    historyArr = []
  }

  try {
    toast('message sent', {
      description: 'Texting',
    })
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: waifuAiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528:free',
        preset: '@preset/emora',
        messages: [
          {
            role: 'user',
            content: `Use chat history: ${JSON.stringify(historyArr)},your is name: ${name.value}, personality: ${personality.value}, and relationship: ${relationship.value}, your Country: ${country.value}, Your Language: ${language.value} Respond to "${msg}"  your name is ${name.value}`,
          },
        ],
      }),
    })

    const data = await response.json()
    return (
      data.choices?.[0]?.message?.content ||
      "Sorry somthing Came up, We can talk later Sorry, possibly network idk, but i'll figure it out"
    )
  } catch (err) {
    console.error('Waifu reply error:', err)
    return 'Sorry, I had trouble thinking...'
  }
}
const endChat = () => {
  localStorage.removeItem('chatHistory')
  localStorage.removeItem('waifuInfo')
  toast('Until our paths cross again... ❤️', {
    action: {
      label: 'Click here to End Chat',
      onClick: () => location.reload(),
    },
  })

  toast('Support The Dev', {
    action: {
      label: 'Buy me Garri',
      onClick: () => window.location.replace('https://pay.squadco.com/link/ULPAGQ'),
    },
  })
}

const call = () => {
  toast('Calling', {
    action: {
      label: 'Hang Up',
      onClick: () => console.log('Call Ended'),
    },
  })
  call_state.value = true
}

const iframeCode =
  '<iframe src="https://www.profitableratecpm.com/ivpxsvzxt?key=98c51d7fabc7b2ba27cb43aee4cb62cd" width="100%" height="100" frameborder="0" scrolling="no"></iframe>'
</script>
<template>
  <div class="h-dvh overflow-none">
    <Toaster />
    <!-- Main App -->
    <ScrollArea
      class="bg-[url('../public/blonde-black-crocodile.jpg')] bg-cover bg-no-repeat flex-col overflow-none flex justify-center item-center"
    >
      <div v-html="iframeCode" class="sticky h-[40px] top-0 z-10 bg-black"></div>
      <!-- <div
        :class="[
          ' absolute z-50 bg-stone-950  backdrop-blur-3xl w-full h-dvh justify-center gap-5 items-center flex-col p-6',
          call_state ? 'flex' : 'hidden',
        ]"
      >
        <div class="bg-white rounded-xl h-70 justify-center flex p-20">callContainer</div>
        <div class="bg-white rounded-xl p-5 mt-9">voiceContainer</div>
        <div class="border-1 border-white p-5 w-fit rounded-xl">callControll</div>
      </div> -->
      <!-- Setup Modal -->
      <div
        :class="[
          ' absolute place-items-center z-50 bg-stone-900/90  backdrop-blur-3xl w-dvw h-dvh justify-center gap-5 items-center flex-col p-6',
          modal_state ? 'flex' : 'hidden',
        ]"
      >
        <h1 class="text-gray-200 font-black text-left text-5xl w-full">Welcome to Emora</h1>
        <p class="text-white font-bold text-md text-left w-full">
          She Remembers Everything... Unless you clear her Cache
        </p>

        <div class="grid w-full items-center gap-4 mt-3">
          <Label for="name" class="text-white font-thin">Type a name here</Label>
          <Input
            v-model="name"
            placeholder="Surprise me, senpai!"
            class="text-white border-white focus-visible:ring-0"
          />
        </div>

        <div class="dropdowns gap-2 flex flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger
              class="text-white border border-white rounded-sm p-3 w-full sm:w-fit"
              >Personality Type</DropdownMenuTrigger
            >
            <DropdownMenuContent class="bg-zinc-950 text-white w-56">
              <DropdownMenuLabel>Personality</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup v-model="personality">
                <DropdownMenuRadioItem value="Soft">Soft</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Spicy">Spicy</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Tsundere">Tsundere</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Loyal">Loyal</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              class="text-white border border-white rounded-sm p-3 w-full sm:w-fit"
              >Memory Type</DropdownMenuTrigger
            >
            <DropdownMenuContent class="bg-zinc-950 text-white w-56">
              <DropdownMenuLabel>Memory</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup v-model="memory">
                <DropdownMenuRadioItem value="Ephemeral">Ephemeral</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Short-Term">Short-Term</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="LongTerm">LongTerm</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger
              class="text-white border border-white rounded-sm p-3 w-full sm:w-fit"
              >Country</DropdownMenuTrigger
            >
            <DropdownMenuContent class="bg-zinc-950 text-white w-56">
              <DropdownMenuLabel>Select Country</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup v-model="country">
                <DropdownMenuRadioItem value="USA">United States</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="UK">United Kingdom</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Japan">Japan</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Germany">Germany</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="France">France</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Canada">Canada</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Australia">Australia</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Brazil">Brazil</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="India">India</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="China">China</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Nigeria">Nigeria</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger
              class="text-white border border-white rounded-sm p-3 w-full sm:w-fit"
              >Language</DropdownMenuTrigger
            >
            <DropdownMenuContent class="bg-zinc-950 text-white w-56">
              <DropdownMenuLabel>Select Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup v-model="language">
                <DropdownMenuRadioItem value="English">English</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Native">Native</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Pidgin">Pidgin</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger
              class="text-white border border-white rounded-sm p-3 w-full sm:w-fit"
              >Relationship Mode</DropdownMenuTrigger
            >
            <DropdownMenuContent class="bg-zinc-950 text-white w-56">
              <DropdownMenuLabel>Relationship</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup v-model="relationship">
                <DropdownMenuRadioItem value="Friend">Friend</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Crush">Crush</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Girlfriend">Girlfriend</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="BoyFriend">Boyfriend</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Situationship">Situationship</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Bigsis/mentor"
                  >Bigsis / Mentor / BigBro</DropdownMenuRadioItem
                >
                <DropdownMenuRadioItem value="SecretAdmirer">Secret Admirer</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Side Chick">side chick</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger
              class="text-white border border-white rounded-sm p-3 w-full sm:w-fit"
              >Gender</DropdownMenuTrigger
            >
            <DropdownMenuContent class="bg-zinc-950 text-white w-56">
              <DropdownMenuLabel>Gender</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup v-model="gender">
                <DropdownMenuRadioItem value="Male">Male</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Female">Female</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          @click="createWaifu"
          class="w-full bg-transparent border border-white focus:bg-white focus:text-black hover:bg-zinc-900"
        >
          Create Your Dream For Free
        </Button>
      </div>

      <!-- Chat Area -->
      <div
        :class="[
          'body   text-white flex relative overflow-none justify-center flex-row',
          modal_state ? 'blur-xl' : '',
        ]"
      >
        <div
          class="leftSide pl-10 pr-10 p-4 flex bg-stone-900/80 backdrop-blur-[70px] flex-col justify-center items-center w-full md:w-3/4 h-dvh"
        >
          <div class="heading pt-20 w-full sticky top-0 flex flex-row place-content-between gap-10">
            <Button
              @click="endChat"
              class="bg-transparent float-right text-white border-1 border-zinc-400 focus:bg-white focus:text-black sm:w-fit px-6 py-3"
              >End Chat</Button
            >
            <!-- <Button
              @click="call"
              class="bg-transparent float-right text-white border-1 border-zinc-400 focus:bg-white focus:text-black sm:w-fit px-6 py-3"
              >Call</Button
            > -->
          </div>

          <ScrollArea
            class="textwindow scroll-smooth overflow-auto bg-transparent overflow-y-auto pt-8 h-[70vh] w-full"
            v-autoscroll.deep
          >
            <markdown
              v-for="(msg, index) in chatHistory"
              :key="index"
              :class="[
                'messageTo leading-7 block [&:not(:first-child)]:mt-6 border border-zinc-400 w-fit max-w-full p-3 mb-4 rounded-2xl',
                msg.from === 'You'
                  ? 'text-right border-tl bg-transparent rounded-tr-none floar-right ml-auto'
                  : 'text-left bg-zinc-900 rounded-tl-none mr-auto',
              ]"
            >
              <p class="text-gray-300 text-sm">{{ msg.from }} {{ msg.time }}</p>
              {{ msg.message }}
            </markdown>
          </ScrollArea>

          <div
            class="textarea place-items-center w-full flex sticky bottom-0 flex-col sm:flex-row gap-2 mt-4"
          >
            <textarea
              v-model="userMessage"
              placeholder="Say something..."
              class="w-full p-3 rounded-xl border backdrop-blur-xl border-zinc-900 outline-none resize-none h-15 text-sm sm:text-base"
            />
            <Button
              :disabled="isSending"
              class="bg-white text-black w-full hover:bg-transparent hover:border-zinc-800 border-1 hover:text-white focus:bg-white focus:text-black sm:w-fit px-6 py-3 disabled:opacity-50"
              @click="sendMessage"
            >
              {{ isSending ? 'Responding' : 'Send' }}
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  </div>
</template>

<style scoped>
.startupDialog {
  backdrop-filter: blur(10px);
}
</style>
