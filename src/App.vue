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
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu'
import { toast } from 'vue-sonner'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ref, onMounted, nextTick } from 'vue'

let name = ref("")
let personality = ref('Soft')
let memory = ref('Ephemeral')
let gender = ref("Male")
let relationship = ref('Friend')
let userMessage = ref("")
let chatHistory = ref([])
const waifuAiKey = import.meta.env.VITE_WAIFU_AI_KEY;
let modal_state = ref(true)
let waifu_info = ref({})
let isSending = ref(false)

onMounted(() => {
  const storedInfo = localStorage.getItem("waifuInfo")
  if (storedInfo) {
    const info = JSON.parse(storedInfo)
    name.value = info.name || ""
    personality.value = info.personality || "Soft"
    memory.value = info.memory_type || "Ephemeral"
    relationship.value = info.relationship_mode || "Friend"
    gender.value = info.gender || "Male"
    modal_state.value = false
  }
  retrivalHistory()
})

const retrivalHistory = () => {
  const stored = localStorage.getItem("chatHistory")
  if (!stored) {
    localStorage.setItem("chatHistory", JSON.stringify([]))
    chatHistory.value = []
  } else {
    chatHistory.value = JSON.parse(stored)
  }
}

const createWaifu = () => {
  alert(name.value)
  if (name.value == ""){
     toast('Invalid Credentials', {
      variant: "destructive",
      description: 'Please Fill the name form',

    })
  }else{
    waifu_info.value = {
    name: name.value,
    personality: personality.value,
    memory_type: memory.value,
    relationship_mode: relationship.value,
    gender: gender.value,
    adRemoval: "true",
    modalState: false
  }

  localStorage.setItem("waifuInfo", JSON.stringify(waifu_info.value))
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
    from: "user"
  })
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory.value))
  userMessage.value = ""

  const waifuReply = await generateWaifuReply(trimmedMessage)
  chatHistory.value.push({
    message: waifuReply,
    from: "waifu"
  })
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory.value))

  nextTick(() => {
    const container = document.querySelector(".textwindow")
    container.scrollTop = container.scrollHeight
  })

  isSending.value = false
}

const generateWaifuReply = async (msg) => {
  let historyArr = []
  if (memory.value === "Short-Term" || memory.value === "LongTerm") {
    historyArr = chatHistory.value
  } else {
    historyArr = []
  }

  try {
    toast('message sent', {
      description: 'Texting',
    })
     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": waifuAiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "user",
        content: `You are a realistic AI that replies with natural, human-like tone based on the user's message. Use chat history: ${JSON.stringify(historyArr)},your is name: ${name.value}, personality: ${personality.value}, and relationship: ${relationship.value}. Respond to "${msg}" casually and thoughtfully, matching the personality. Avoid anything robotic, scripted, or overly dramatic talk, remove all statments expressing motion or beign but reply with words, dont be cringe remeber your name is ${name.value}, use modern slangs, text abbreviations, just sound modern not robotic.`


          }
        ]
      })
    })

    const data = await response.json()
    return data.choices?.[0]?.message?.content || "Sorry somthing Came up, We can talk later Sorry, possibly network idk, but i'll figure it out"
  } catch (err) {
    console.error("Waifu reply error:", err)
    return "Sorry, I had trouble thinking..."
  }
}
const endChat = () => {
  localStorage.removeItem("chatHistory")
  localStorage.removeItem("waifuInfo")
  location.reload()
}
const iframeCode = '<iframe src="https://www.profitableratecpm.com/ivpxsvzxt?key=98c51d7fabc7b2ba27cb43aee4cb62cd" width="100%" height="100" frameborder="0" scrolling="no"></iframe>'
</script>
<template>
  <div class="h-dvh overflow-none">
    <Toaster/>
    <!-- Main App -->
    <ScrollArea class="bg-zinc-950 flex-col overflow-none flex justify-center item-center">
      <div v-html="iframeCode" class="sticky h-[40px]  top-0 z-10 bg-black"></div>

      <!-- Setup Modal -->
      <div :class="[
        ' absolute place-items-center z-50  w-fill h-dvh justify-center gap-5 items-center flex-col p-6',
        modal_state ? 'flex' : 'hidden'
      ]">
        <h1 class="text-gray-400 font-black text-left text-5xl w-full">Your Waifu.</h1>
        <p class="text-white font-bold text-md text-left w-full">She Remembers Everything... Unless you clear her Cache</p>

        <div class="grid w-full items-center gap-4 mt-3">
          <Label for="name" class="text-white font-thin">What do you want to call her?</Label>
          <Input v-model="name" placeholder="Name" class="text-white border-zinc-900" />
        </div>

        <div class="dropdowns gap-2 flex flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger class="text-white border border-zinc-900 rounded-sm p-3 w-full sm:w-fit">Personality Type</DropdownMenuTrigger>
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
            <DropdownMenuTrigger class="text-white border border-zinc-900 rounded-sm p-3 w-full sm:w-fit">Memory Type</DropdownMenuTrigger>
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
            <DropdownMenuTrigger class="text-white border border-zinc-900 rounded-sm p-3 w-full sm:w-fit">Relationship Mode</DropdownMenuTrigger>
            <DropdownMenuContent class="bg-zinc-950 text-white w-56">
              <DropdownMenuLabel>Relationship</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup v-model="relationship">
                <DropdownMenuRadioItem value="Friend">Friend</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Crush">Crush</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Girlfriend">Girlfriend</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Bigsis/mentor">Bigsis / Mentor</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="SecretAdmirer">Secret Admirer</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger class="text-white border border-zinc-900 rounded-sm p-3 w-full sm:w-fit">Gender</DropdownMenuTrigger>
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

        <Button @click="createWaifu"
          class="w-full bg-transparent border border-zinc-900 focus:bg-white focus:text-black hover:bg-zinc-900">
          Create Your Dream
        </Button>
      </div>

      <!-- Chat Area -->
      <div :class="[
        'body text-white flex relative overflow-none justify-center flex-row',
        modal_state ? 'blur-xl' : ''
      ]">
        <div class="leftSide p-4 flex flex-col justify-center items-center w-full lg:w-5/6 h-dvh">
          <div class="heading pt-20 w-full sticky top-0 flex flex-row place-content-between gap-10">
            <h1 class="scroll-m-20 text-4xl  font-extrabold tracking-tight lg:text-5xl">{{ name }}</h1>
            <Button @click="endChat" class="bg-transparent float-right text-white border-1 border-zinc-400 focus:bg-white focus:text-black  sm:w-fit px-6 py-3">End Chat</Button>
          </div>
          

          <ScrollArea class="textwindow bg-transparent overflow-y-auto p-4 pt-8 h-[70vh] w-full" v-autoscroll.deep>
            <markdown v-for="(msg, index) in chatHistory" :key="index" :class="[
              'messageTo leading-7 block [&:not(:first-child)]:mt-6 border border-zinc-800 w-full p-3 mb-4 rounded-sm',
              msg.from === 'user' ? 'text-right bg-transparent' : 'text-left bg-zinc-900'
            ]">
              {{ msg.message }}
          </markdown>
          </ScrollArea>

          <div class="textarea w-full bg-zinc-950  flex sticky bottom-0 flex-col sm:flex-row gap-2 mt-4">
            <textarea v-model="userMessage"
              placeholder="Say something..."
              class="w-full p-3 rounded-sm border bg-zinc-950 border-zinc-900 outline-none resize-none min-h-[80px] text-sm sm:text-base" />
            <Button
              :disabled="isSending"
              class="bg-white text-black w-full hover:bg-transparent hover:border-zinc-800 border-1 hover:text-white focus:bg-white focus:text-black  sm:w-fit px-6 py-3 disabled:opacity-50"
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
