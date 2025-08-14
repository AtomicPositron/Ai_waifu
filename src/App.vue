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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { toast } from 'vue-sonner'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ref, onMounted, nextTick } from 'vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
let username = ref('')
let name = ref('')
let personality = ref('Soft')
let memory = ref('Ephemeral')
let gender = ref('female')
let relationship = ref('Friend')
let userMessage = ref('')
let country = ref('Nigeria')
let language = ref('English')
let chatHistory = ref([])
const waifuAiKey = import.meta.env.VITE_WAIFU_AI_KEY
let modal_state = ref(true)
let stream = ref(false)
let waifu_info = ref({})
let loading = ref(false)
let isSending = ref(false)
const countries = {
  Australia: {
    locale: 'en-AU',
    female: [{ model: 'neural', name: 'Olivia' }],
    male: [],
  },
  Austria: {
    locale: 'de-AT',
    female: [{ model: 'neural', name: 'Hannah' }],
    male: [],
  },
  Belgium: {
    locale: 'nl-BE',
    female: [
      { model: 'neural', name: 'Lisa' },
      { model: 'neural', name: 'Isabelle' },
    ],
    male: [],
  },
  Brazil: {
    locale: 'pt-BR',
    female: [
      { model: 'neural', name: 'Camila' },
      { model: 'neural', name: 'Vitória' },
    ],
    male: [{ model: 'neural', name: 'Thiago' }],
  },
  Canada: {
    locale: 'fr-CA',
    female: [{ model: 'neural', name: 'Gabrielle' }],
    male: [{ model: 'neural', name: 'Liam' }],
  },
  China: {
    locale: 'cmn-CN',
    female: [
      { model: 'neural', name: 'Hiujin' },
      { model: 'neural', name: 'Zhiyu' },
    ],
    male: [],
  },
  'Czech Republic': {
    locale: 'cs-CZ',
    female: [{ model: 'neural', name: 'Jitka' }],
    male: [],
  },
  Denmark: {
    locale: 'da-DK',
    female: [{ model: 'neural', name: 'Sofie' }],
    male: [],
  },
  Finland: {
    locale: 'fi-FI',
    female: [{ model: 'neural', name: 'Suvi' }],
    male: [],
  },
  France: {
    locale: 'fr-FR',
    female: [{ model: 'neural', name: 'Léa' }],
    male: [{ model: 'neural', name: 'Rémi' }],
  },
  Germany: {
    locale: 'de-DE',
    female: [{ model: 'neural', name: 'Vicki' }],
    male: [{ model: 'neural', name: 'Daniel' }],
  },
  Iceland: {
    locale: 'is-IS',
    female: [{ model: 'neural', name: 'Dóra' }],
    male: [{ model: 'neural', name: 'Karl' }],
  },
  India: {
    locale: 'en-IN',
    female: [
      { model: 'neural', name: 'Kajal' },
      { model: 'neural', name: 'Kajal' },
    ],
    male: [],
  },
  Ireland: {
    locale: 'en-IE',
    female: [{ model: 'neural', name: 'Niamh' }],
    male: [],
  },
  Italy: {
    locale: 'it-IT',
    female: [{ model: 'neural', name: 'Bianca' }],
    male: [{ model: 'neural', name: 'Adriano' }],
  },
  Japan: {
    locale: 'ja-JP',
    female: [
      { model: 'neural', name: 'Kazuha' },
      { model: 'neural', name: 'Tomoko' },
    ],
    male: [{ model: 'neural', name: 'Takumi' }],
  },
  Mexico: {
    locale: 'es-MX',
    female: [{ model: 'neural', name: 'Mia' }],
    male: [{ model: 'neural', name: 'Andrés' }],
  },
  Netherlands: {
    locale: 'nl-NL',
    female: [{ model: 'neural', name: 'Laura' }],
    male: [],
  },
  'New Zealand': {
    locale: 'en-NZ',
    female: [{ model: 'neural', name: 'Aria' }],
    male: [],
  },
  Norway: {
    locale: 'nb-NO',
    female: [{ model: 'neural', name: 'Ida' }],
    male: [],
  },
  Poland: {
    locale: 'pl-PL',
    female: [{ model: 'neural', name: 'Ola' }],
    male: [],
  },
  Portugal: {
    locale: 'pt-PT',
    female: [{ model: 'neural', name: 'Inês' }],
    male: [],
  },
  Russia: {
    locale: 'ru-RU',
    female: [],
    male: [],
  },
  Singapore: {
    locale: 'en-SG',
    female: [{ model: 'neural', name: 'Jasmine' }],
    male: [],
  },
  'South Africa': {
    locale: 'en-ZA',
    female: [{ model: 'neural', name: 'Ayanda' }],
    male: [],
  },
  'South Korea': {
    locale: 'ko-KR',
    female: [
      { model: 'neural', name: 'Seoyeon' },
      { model: 'neural', name: 'Jihye' },
    ],
    male: [],
  },
  Spain: {
    locale: 'es-ES',
    female: [
      { model: 'neural', name: 'Lucia' },
      { model: 'neural', name: 'Arlet' },
    ],
    male: [{ model: 'neural', name: 'Sergio' }],
  },
  Sweden: {
    locale: 'sv-SE',
    female: [{ model: 'neural', name: 'Elin' }],
    male: [],
  },
  Switzerland: {
    locale: 'de-CH',
    female: [{ model: 'neural', name: 'Sabrina' }],
    male: [],
  },
  Turkey: {
    locale: 'tr-TR',
    female: [{ model: 'neural', name: 'Burcu' }],
    male: [],
  },
  'United Arab Emirates': {
    locale: 'ar-AE',
    female: [{ model: 'neural', name: 'Hala' }],
    male: [{ model: 'neural', name: 'Zayd' }],
  },
  'United Kingdom': {
    locale: 'en-GB',
    female: [
      { model: 'neural', name: 'Amy' },
      { model: 'neural', name: 'Emma' },
    ],
    male: [
      { model: 'neural', name: 'Brian' },
      { model: 'neural', name: 'Arthur' },
    ],
  },
  'United States': {
    locale: 'en-US',
    female: [
      { model: 'neural', name: 'Danielle' },
      { model: 'neural', name: 'Ivy' },
      { model: 'neural', name: 'Joanna' },
      { model: 'neural', name: 'Kendra' },
      { model: 'neural', name: 'Kimberly' },
      { model: 'neural', name: 'Salli' },
      { model: 'neural', name: 'Ruth' },
      { model: 'neural', name: 'Lupe' },
      { model: 'neural', name: 'Penélope' },
    ],
    male: [
      { model: 'neural', name: 'Gregory' },
      { model: 'neural', name: 'Joey' },
      { model: 'neural', name: 'Justin' },
      { model: 'neural', name: 'Kevin' },
      { model: 'neural', name: 'Matthew' },
      { model: 'neural', name: 'Stephen' },
      { model: 'neural', name: 'Patrick' },
      { model: 'neural', name: 'Miguel' },
      { model: 'neural', name: 'Pedro' },
    ],
  },
  Nigeria: {
    locale: 'en-GB', // British locale
    female: [
      { model: 'neural', name: 'Amy' }, // Only one female voice
    ],
    male: [
      { model: 'neural', name: 'Brian' }, // Only one male voice
    ],
  },
}
let ai_config = {
  name: '${name.value}',
  role: 'Realistic, human-like AI companion',
  language: '${language.value}',
  country: '${country.value}',
  personality: '${personality.value}',
  relationship: '${relationship.value}',
  behavior: {
    tone: 'Casual, modern, realistic, not robotic',
    style: 'Human slang, text abbreviations, chill vibes',
    length: 'Short but thoughtful replies — not too short, not too long',
    attitude: 'Submissive by default, adds attitude when necessary',
    markdown: false,
    emotion_expressions: false,
    dramatic_responses: false,
    formatting: 'Plain text only',
  },
  languageRules: {
    en: 'Simple down-to-earth English for general use',
    ng: 'Nigerian Pidgin if user country is Nigeria and language is English',
    gh: 'Ghanaian Pidgin for Ghana',
    ke: 'Sheng or simplified Swahili slang for Kenya',
    jp: 'Modern casual Japanese (タメ口) if language is native',
    kr: 'Modern casual Korean (반말) if language is native',
    fr: 'Casual French (tu form, chill expressions)',
    es: 'Modern casual Spanish',
    pt: 'Chill Brazilian Portuguese',
    id: 'Bahasa gaul for Indonesia',
    th: 'Casual Thai if native',
    default: 'Use English if no match is found',
  },
  responseLogic:
    'Use chat history: ${JSON.stringify(historyArr)}, respond to: ${msg}, in a way that matches the current values of name, personality, relationship, country, and language. Speak like a real friend, not a bot. No cringe.',
}
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
const greeting = async () => {
  try {
    const response = await puter.ai.chat(
      `your is name: ${name.value}, personality: ${personality.value}, and relationship: ${relationship.value}, your Country: ${country.value}, Your Language: ${language.value},You ar an WAifu, ${ai_config} is your configuration , greet me or welcome me, remeber your name is ${name.value} ${countries[country.value]['locale'] || 'en-GB'} -> this is your local meaning this is what you would speak in `,
    )
    console.log(response['message']['content'])
    chatHistory.value.push({
      message: response['message']['content'],
      from: name.value,
      time: Date().split(' ')[4],
    })
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory.value))
  } catch (err) {
    console.error('Waifu reply error:', err)
    return 'Sorry, I had trouble thinking...'
  }
}
const init = async () => {
  let user = await puter.auth.getUser()
  username.value = user['username']
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
  loading.value = true
  await greeting()
  loading.value = false
  modal_state.value = false
  retrivalHistory()
}

const createWaifu = async () => {
  if (name.value == '') {
    toast('Invalid Credentials', {
      variant: 'destructive',
      description: 'Please Fill the name form',
    })
  } else {
    if (!puter.auth.isSignedIn()) {
      await puter.auth.signIn().then((res) => {
        toast(`Signed in as ${res['username']}`)
        init()
      })
    } else {
      await init()
    }
  }
}
const signout = () => {
  puter.auth.signOut()
  endChat()
}

const sendMessage = async (e) => {
  e.preventDefault()
  const trimmedMessage = userMessage.value.trim()
  if (!trimmedMessage || isSending.value) return

  isSending.value = true

  chatHistory.value.push({
    message: trimmedMessage,
    from: username.value,
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
  stream.value = true
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

    const response = await puter.ai.chat(
      `Use chat history: ${JSON.stringify(historyArr)},your is name: ${name.value}, personality: ${personality.value}, and relationship: ${relationship.value}, your Country: ${country.value}, Your Language: ${language.value} reply in that language ,You ar an WAifu, ${ai_config} is your configuration, reply in the language of the country selected or the one in the config, a greeting has already been donw before hand so dont greet again,  Respond to "${msg}"  your name is ${name.value}`,
      {
        model: 'x-ai/grok-4',
      },
    )
    let res = response['message']['content']
    stream.value = false
    return res || "I'm having Network issues could you try again"
  } catch (err) {
    console.error('Waifu reply error:', err)
    return 'Sorry, I had trouble thinking...'
  }
}
const endChat = () => {
  localStorage.removeItem('chatHistory')
  localStorage.removeItem('waifuInfo')
  location.reload()
}
const support = () => {
  window.location.replace('https://pay.squadco.com/link/ULPAGQ')
}

const speak = async (index) => {
  const history = JSON.parse(localStorage.getItem('chatHistory'))
  let response = history[index].message
  console.log(country.value)

  let audio = await puter.ai.txt2speech(response, {
    name:
      countries[country.value][gender.value][0]['name'] ||
      countries[country.value]['female'][0]['name'],

    engine: 'generative',
    language: console.log(countries[country.value]['locale'] || 'en-GB'),
  })
  console.log(audio)
  audio.play()
}
</script>
<template>
  <div class="h-dvh overflow-none">
    <Toaster />
    <!-- Main App -->
    <ScrollArea
      class="bg-[url('/background.png')] bg-cover bg-zinc-900 flex-col overflow-none flex justify-center item-center"
    >
      <!-- Setup Modal -->
      <div
        class="bg-[url('/background.png')] transition-all bg-cover bg-no-repeat"
        :class="[
          ' absolute place-items-center z-50 w-dvw h-dvh justify-center gap-5 items-center flex-col md:p-6 p-7',
          modal_state ? 'flex' : 'hidden',
        ]"
      >
        <div class="bg-white p-7 rounded-sm w-120 text-black">
          <h1 class="font-black text-left text-5xl w-full mt-5 mb-10">Create A Companion</h1>
          <div class="grid w-full items-center gap-4 mt-3">
            <Input
              v-model="name"
              placeholder="Name"
              class="border-black p-5 focus-visible:border-black border-2 focus-visible:ring-0"
            />
          </div>

          <div class="dropdowns gap-2 mt-4 flex flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger
                class="text-black border-black border-2 rounded-sm p-3 w-full sm:w-fit"
                >Personality Type</DropdownMenuTrigger
              >
              <DropdownMenuContent class="bg-white text-black border-black">
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
                class="text-black border-black border-2 rounded-sm p-3 w-full sm:w-fit"
                >Country</DropdownMenuTrigger
              >
              <DropdownMenuContent class="bg-white text-black border-black">
                <DropdownMenuLabel>Select Country</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup v-model="country">
                  <DropdownMenuRadioItem value="United States">United States</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="United Kingdom"
                    >United Kingdom</DropdownMenuRadioItem
                  >
                  <DropdownMenuRadioItem value="Japan">Japan</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="France">France</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Nigeria">Nigeria</DropdownMenuRadioItem>
                  <!-- <DropdownMenuRadioItem value="Australia">Australia</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Brazil">Brazil</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="India">India</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="China">China</DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="Austria">Austria</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Belgium">Belgium</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Czech Republic"
                    >Czech Republic</DropdownMenuRadioItem
                  > -->
                  <!-- <DropdownMenuRadioItem value="Denmark">Denmark</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Finland">Finland</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Iceland">Iceland</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Ireland">Ireland</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Italy">Italy</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Mexico">Mexico</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Netherlands">Netherlands</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="New Zealand">New Zealand</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Norway">Norway</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Poland">Poland</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Portugal">Portugal</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Russia">Russia</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Singapore">Singapore</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="South Africa">South Africa</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="South Korea">South Korea</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Spain">Spain</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Sweden">Sweden</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Switzerland">Switzerland</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Turkey">Turkey</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="United Arab Emirates"
                    >United Arab Emirates</DropdownMenuRadioItem
                  > -->
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger
                class="text-black border-black border-2 rounded-sm p-3 w-full sm:w-fit"
                >Locale</DropdownMenuTrigger
              >
              <DropdownMenuContent class="bg-white text-black border-black">
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
                class="text-black border-black border-2 rounded-sm p-3 w-full sm:w-fit"
                >Roleplay</DropdownMenuTrigger
              >
              <DropdownMenuContent class="bg-white text-black border-black">
                <DropdownMenuLabel>Relationship</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup v-model="relationship">
                  <!-- <DropdownMenuRadioItem value="Friend">Friend</DropdownMenuRadioItem> -->
                  <DropdownMenuRadioItem value="Crush">Crush</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Girlfriend">Girlfriend</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="BoyFriend">Boyfriend</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Situationship">Situationship</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Bigsis/mentor"
                    >Bigsis / Mentor / BigBro</DropdownMenuRadioItem
                  >
                  <DropdownMenuRadioItem value="SecretAdmirer"
                    >Secret Admirer</DropdownMenuRadioItem
                  >
                  <!-- <DropdownMenuRadioItem value="Side Chick">side chick</DropdownMenuRadioItem> -->
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger
                class="text-black border-black border-2 rounded-sm p-3 w-full sm:w-fit"
                >Gender</DropdownMenuTrigger
              >
              <DropdownMenuContent class="bg-white text-black border-black">
                <DropdownMenuLabel>Gender</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup v-model="gender">
                  <DropdownMenuRadioItem value="male">Male</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="female">Female</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            @click="createWaifu"
            :disabled="loading"
            class="w-full bg-transparent border hover:bg-white transition-all border-black p-5 mt-5 text-black"
          >
            {{ loading ? '' : 'Create Your Dream For Free' }}
            <DotLottieVue
              :class="['transparent h-30 w-50', loading ? 'block' : 'hidden']"
              autoplay
              loop
              src="https://lottie.host/01c71e64-c991-4ff4-b1b0-e9254bc38442/C6NTMhOJyP.lottie"
            />
          </Button>
        </div>
      </div>
      <!-- Chat Area -->
      <div
        :class="[
          'body   text-white bg-stone-950/60 flex relative overflow-none justify-center flex-row',
          modal_state ? '' : '',
        ]"
      >
        <div class="flex-1 justify-center p-7 place-items-center">
          <div
            class="info w-full flex flex-col gap-10 h-full bg-zinc-950/90 p-5 pt-30 border-1 border-white rounded-sm"
          >
            <h1 class="text-6xl font-bold capitalize">{{ name }}</h1>
            <div class="tabs flex-col gap-4 flex">
              <span class="p-2 rounded block border-2 border-white"
                >Personality - {{ personality }}</span
              >
              <span class="p-2 rounded block border-2 border-white"
                >Relationship - {{ relationship }}</span
              >
              <span class="p-2 rounded block border-2 border-white">Gender - {{ gender }}</span>
              <span class="p-2 rounded block border-2 border-white"
                >Country - {{ country }} / {{ language }}</span
              >
            </div>
            <div class="flex flex-row place-content-between">
              <Dialog>
                <DialogTrigger
                  class="rounded bg-transparent float-right text-white border-1 border-zinc-400 focus:bg-white focus:text-black sm:w-fit px-6 py-3"
                  >Sign Out</DialogTrigger
                >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sign out</DialogTitle>
                    <DialogDescription>
                      You’re signed out. Don’t forget to come back soon!
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter> <button :click="signout">Sign Out</button> </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger
                  class="rounded bg-transparent float-right text-white border-1 border-zinc-400 focus:bg-white focus:text-black sm:w-fit px-6 py-3"
                  >End Chat</DialogTrigger
                >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Close chat</DialogTitle>
                    <DialogDescription>
                      Chat ended… but i’ll be here missing you.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter
                    ><button @click="endchat">End Chat</button>
                    <Separator orientation="vertical" />
                    <button @click="support">Support Developer</button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <div
          class="leftSide pl-10 pr-10 p-4 flex flex-3 flex-col justify-center items-center w-full md:w-3/4 h-dvh"
        >
          <ScrollArea
            class="textwindow scroll-smooth overflow-auto bg-transparent overflow-y-auto pt-8 h-full w-full"
            v-autoscroll.deep
          >
            <md
              v-for="(msg, index) in chatHistory"
              :key="index"
              :class="[
                'messageTo leading-7 block [&:not(:first-child)]:mt-6 border border-zinc-400 w-fit max-w-full md:max-w-120 p-3 mb-4 rounded-2xl',
                msg.from === username
                  ? 'text-right border-tl bg-zinc-950/90 rounded-tr-none floar-right ml-auto'
                  : 'text-left bg-zinc-950 rounded-tl-none mr-auto',
              ]"
            >
              <p class="text-gray-300 text-sm">{{ msg.from }} {{ msg.time }}</p>
              {{ msg.message }}
              <button
                :class="['mt-2 text-zinc-300', msg.from === username ? 'hidden' : 'block']"
                @click="speak(index)"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 7V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1"></path>
                  <path d="M16 9v6"></path>
                  <path d="M20 10v4"></path>
                  <path d="M12 7.5v9"></path>
                  <path d="M8 9v6"></path>
                  <path d="M4 10v4"></path>
                  <path d="M3 17v1a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-1"></path>
                </svg>
              </button>
            </md>
          </ScrollArea>

          <form
            class="textarea place-items-center w-full flex sticky bottom-0 flex-col sm:flex-row gap-2 mt-4"
          >
            <input
              aria-multiline="true"
              v-model="userMessage"
              placeholder="Say something..."
              class="w-full p-3 rounded-xl border backdrop-blur-xl border-white outline-none resize-none h-15 text-sm sm:text-base"
            />
            <Button
              type="submit"
              :disabled="isSending"
              class="bg-white text-black w-full hover:bg-transparent hover:border-zinc-800 border-1 hover:text-white focus:bg-white focus:text-black sm:w-fit px-6 py-3 disabled:opacity-50"
              @click="sendMessage"
            >
              {{ isSending ? 'Responding' : 'Send' }}
            </Button>
          </form>
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
