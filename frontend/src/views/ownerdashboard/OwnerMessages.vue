<template>
  <div class="p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 min-h-screen">
    <div
      class="flex h-[calc(100vh-8rem)] bg-white/10 backdrop-blur-lg text-white rounded-2xl shadow-xl border border-white/20 overflow-hidden"
    >
      <!-- Sidebar (Customers / Contacts) -->
      <aside class="w-80 bg-gradient-to-b from-purple-600 via-pink-500 to-orange-500 border-r border-white/20">
        <div class="p-6 border-b border-white/20 bg-white/10">
          <div class="flex items-center space-x-3 mb-2">
            <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">Messages</h2>
              <p class="text-sm text-purple-200">{{ customers.length }} customers</p>
            </div>
          </div>
        </div>
      
        <!-- Loading State -->
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p class="text-sm text-purple-200 mt-4">Loading customers...</p>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="customers.length === 0" class="p-8 text-center">
          <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <p class="text-lg font-semibold text-white mb-2">No customers to message</p>
          <p class="text-sm text-purple-200">Customers will appear here when they book your boats!</p>
        </div>
        
        <!-- Customers List -->
        <div v-else class="overflow-y-auto h-full">
          <div
            v-for="(customer, i) in customers"
            :key="customer.user_id + '-' + (customer.booking_id || 'none')"
            @click="selectCustomer(customer)"
            class="p-4 mx-3 my-2 cursor-pointer hover:bg-white/20 rounded-xl transition-all duration-200 border border-transparent hover:border-white/30 hover:shadow-md"
            :class="isCustomerSelected(customer) ? 'bg-white/30 border-white/40 shadow-md' : ''"
          >
            <div class="flex items-center space-x-4">
              <div class="relative">
                <div v-if="customer.profile_pic && !customer.imageError" class="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img 
                    :src="baseUrl + customer.profile_pic" 
                    alt="avatar" 
                    class="w-full h-full object-cover" 
                    @error="handleImageError(customer)"
                    @load="onImgLoad(customer)"
                  />
                </div>
                <div v-else class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md">
                  {{ getInitials(customer.full_name) }}
                </div>
                <div v-if="customer.unread_count > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                  {{ customer.unread_count }}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-white truncate text-base">{{ customer.full_name }}</p>
                <p class="text-sm text-purple-200 truncate">{{ customer.boat_name }}</p>
                <p v-if="customer.email" class="text-xs text-purple-300 truncate">{{ customer.email }}</p>
                <p v-if="customer.booking_id" class="text-xs text-yellow-300 font-medium">Booking #{{ customer.booking_id }}</p>
              </div>
            </div>
          </div>
        </div>
    </aside>

      <!-- Chat Window -->
      <main class="flex-1 flex flex-col bg-white/5">
        <div v-if="selectedCustomer" class="flex flex-col h-full">
          <!-- Chat Header -->
          <div
            class="flex items-center justify-between p-6 bg-gradient-to-r from-white/10 to-white/20 border-b border-white/20"
          >
            <div class="flex items-center space-x-4">
              <div v-if="selectedCustomer.profile_pic && !selectedCustomer.imageError" class="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-lg">
                <img 
                  :src="baseUrl + selectedCustomer.profile_pic" 
                  alt="avatar" 
                  class="w-full h-full object-cover" 
                  @error="handleImageError(selectedCustomer)"
                  @load="onImgLoad(selectedCustomer, true)"
                />
              </div>
              <div v-else class="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-lg">
                {{ getInitials(selectedCustomer.full_name) }}
              </div>
              <div>
                <p class="font-bold text-lg text-white">{{ selectedCustomer.full_name }}</p>
                <p class="text-sm text-purple-200">{{ selectedCustomer.boat_name }}</p>
                <p v-if="selectedCustomer.email" class="text-xs text-purple-300">{{ selectedCustomer.email }}</p>
                <p v-if="selectedCustomer.booking_id" class="text-xs text-yellow-300 font-medium">Booking #{{ selectedCustomer.booking_id }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 rounded-full" :class="socketConnected ? 'bg-green-500' : 'bg-red-500'"></div>
              <span class="text-sm text-purple-200">{{ socketConnected ? 'Connected' : 'Disconnected' }}</span>
            </div>
          </div>

          <!-- Chat Messages -->
          <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white/5 to-white/10">
            <!-- Loading Messages -->
            <div v-if="loadingMessages" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p class="text-sm text-purple-200 mt-3">Loading messages...</p>
            </div>
            
            <!-- No Messages -->
            <div v-else-if="currentMessages.length === 0" class="text-center py-12">
              <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <p class="text-lg font-semibold text-white mb-2">No messages yet</p>
              <p class="text-sm text-purple-200">Start a conversation with your customer!</p>
            </div>
            
            <!-- Messages -->
            <div
              v-for="(msg, index) in currentMessages"
              :key="msg.message_id || (msg.sender_id + '-' + index + '-' + (msg.created_at || ''))"
              class="flex"
              :class="msg.sender_id === getOwnerId() ? 'justify-end' : 'justify-start'"
            >
              <div
                class="px-5 py-3 rounded-2xl max-w-md shadow-md"
                :class="msg.sender_id === getOwnerId()
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/20 text-white border border-white/30'"
              >
                <p class="text-sm leading-relaxed break-words">{{ msg.message }}</p>
                <p class="text-xs mt-2 opacity-70">
                  {{ formatTime(msg.created_at) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Input Box -->
          <div
            class="p-6 border-t border-white/20 bg-gradient-to-r from-white/10 to-white/20"
          >
            <div class="flex space-x-4">
              <div class="flex-1 relative">
                <input
                  v-model="newMessage"
                  @keydown.enter.prevent="sendMessage"
                  type="text"
                  placeholder="Type your message here..."
                  class="w-full px-5 py-4 rounded-2xl bg-white/20 text-white border-2 border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm placeholder-purple-300"
                  :disabled="sendingMessage"
                  :class="{ 'opacity-50 cursor-not-allowed': sendingMessage }"
                />
                <div v-if="sendingMessage" class="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              </div>
              <button
                @click="sendMessage"
                :disabled="!newMessage.trim() || sendingMessage"
                class="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 min-w-[100px] justify-center shadow-lg hover:shadow-xl"
              >
                <svg v-if="!sendingMessage" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
                <span v-if="sendingMessage">Sending...</span>
                <span v-else>Send</span>
              </button>
            </div>
            <div class="mt-3 text-xs text-purple-300 text-center">
              Press Enter to send • Click Send button
            </div>
          </div>
      </div>

        <!-- Empty State -->
        <div
          v-else
          class="flex flex-col items-center justify-center flex-1 text-purple-200 p-12"
        >
          <div class="w-32 h-32 bg-gradient-to-br from-white/20 to-white/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-white mb-3">No Conversation Selected</h3>
          <p class="text-purple-200 text-center max-w-md mb-6">
            Choose a customer from the list to start messaging about their bookings
          </p>
          <div class="bg-white/20 border border-white/30 rounded-xl p-4 max-w-md">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              <span class="text-sm text-white font-medium">Tip: You can only message customers who have booked your boats</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch, nextTick, computed } from "vue"
import OwnerMessageService from "@/services/ownerMessageService"
import { io } from "socket.io-client"

// --- Config ---
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"

const owner = ref({})

try {
  const raw = localStorage.getItem("user")
  if (raw) {
    const parsed = JSON.parse(raw)
  owner.value = parsed && typeof parsed === "object" ? parsed : {}
  } else {
    owner.value = {}
  }
} catch (e) {
  console.error("Failed to parse user from localStorage", e)
  owner.value = {}
}

// Helper function to get owner ID safely
const getOwnerId = () => {
  return owner.value?.user_id || owner.value?.userId || null
}

// Ensure owner has the required properties
if (!getOwnerId()) {
  console.warn('No owner ID found in localStorage')
}

// Guard if no owner id
if (!getOwnerId()) {
  console.warn('No owner ID found. Messaging features will be disabled until login.')
}

// Reactive data
const customers = ref([])
const selectedCustomer = ref(null)
const currentMessages = ref([])
const newMessage = ref("")
const loading = ref(true)
const loadingMessages = ref(false)
const sendingMessage = ref(false)
const socketConnected = ref(false)

// Socket.IO connection
let socket = null

// Refs
const messagesContainer = ref(null)

// Load customers from API
const loadCustomers = async () => {
  try {
    loading.value = true
    if (!getOwnerId()) return
    const response = await OwnerMessageService.getCustomers(getOwnerId())
    if (response?.success && Array.isArray(response.data)) {
      // Initialize imageError property for each customer
      customers.value = response.data.map(customer => ({
        ...customer,
        imageError: false,
        unread_count: customer.unread_count || 0,
      }))
      
      // Debug: Log customer data
      console.log('Customers loaded:', customers.value.map(customer => ({
        name: customer.full_name,
        profile_pic: customer.profile_pic,
        full_url: customer.profile_pic ? baseUrl + customer.profile_pic : 'No profile pic'
      })))
    } else {
      customers.value = []
    }
  } catch (error) {
    console.error('Error loading customers:', error)
    // Show user-friendly error message
    if (error.response?.status === 401) {
      alert('Session expired. Please log in again.')
    } else {
      alert('Failed to load customers. Please refresh the page.')
    }
  } finally {
    loading.value = false
  }
}

// Load messages for selected customer
const loadMessages = async (customerId, bookingId = null) => {
  try {
    if (!getOwnerId()) return
    loadingMessages.value = true
    console.log('Loading messages for customer:', customerId, 'booking:', bookingId)
    const response = await OwnerMessageService.getMessages(getOwnerId(), customerId, bookingId)
    if (response?.success && Array.isArray(response.data)) {
      // Remove duplicates based on message_id and content
      const uniqueMessages = response.data.filter((message, index, self) => 
        index === self.findIndex(m => 
          m.message_id === message.message_id || 
          (m.message === message.message && m.sender_id === message.sender_id && m.created_at === message.created_at)
        )
      )
      
      currentMessages.value = uniqueMessages
      console.log('Loaded messages:', uniqueMessages.length)

      // mark unread for this thread as read
      const c = customers.value.find(c => c.user_id === customerId && c.booking_id === bookingId)
      if (c) c.unread_count = 0

      // Scroll to bottom
      await nextTick()
      setTimeout(() => scrollToBottom(), 100)
    } else {
      currentMessages.value = []
    }
  } catch (error) {
    console.error('Error loading messages:', error)
    // Show user-friendly error message
    if (error.response?.status === 401) {
      alert('Session expired. Please log in again.')
    } else {
      alert('Failed to load messages. Please try again.')
    }
  } finally {
    loadingMessages.value = false
  }
}

// Clear current conversation
const clearCurrentConversation = () => {
  currentMessages.value = []
  selectedCustomer.value = null
}

// Select customer and load messages
const selectCustomer = async (customer) => {
  // Don't reload if it's the same customer and booking
  if (isCustomerSelected(customer)) {
    console.log('Same customer and booking selected, skipping reload')
    return
  }
  
  // Clear current messages first to avoid confusion
  currentMessages.value = []
  
  selectedCustomer.value = {
    ...customer,
    imageError: false
  }
  console.log('Selected customer:', customer.full_name, 'User ID:', customer.user_id, 'Booking ID:', customer.booking_id, 'Boat:', customer.boat_name)
  
  // Join booking-specific conversation room
  if (customer.booking_id && socket && socket.connected) {
    socket.emit('join-booking-conversation', {
      userId: customer.user_id, // Join the room for the customer (same as customer side)
      bookingId: customer.booking_id
    })
    console.log('Owner joined booking conversation room for customer:', customer.user_id, 'booking:', customer.booking_id)
  }
  
  await loadMessages(customer.user_id, customer.booking_id)
}

// Send message
const sendMessage = async () => {
  if (!selectedCustomer.value || sendingMessage.value) return
  let messageText = newMessage.value.trim()
  if (!messageText) return

  try {
    sendingMessage.value = true

    // Validate message content
    if (!messageText || messageText.toLowerCase() === 'null') {
      throw new Error('Invalid message content')
    }

    // Clear input early for snappy UX
    newMessage.value = ""

    // Get booking ID from the selected customer's booking
    const bookingId = selectedCustomer.value.booking_id || null

    // Send via Socket.IO if available, otherwise use API
    if (socket && socket.connected) {
      // Ensure we're in the correct booking room before sending
      if (bookingId) {
        socket.emit('join-booking-conversation', {
          userId: selectedCustomer.value.user_id,
          bookingId: bookingId
        })
        console.log('Owner joined room before sending message:', selectedCustomer.value.user_id, 'booking:', bookingId)
      }
      
      console.log('Sending message via Socket.IO:', {
        senderId: getOwnerId(),
        receiverId: selectedCustomer.value.user_id,
        message: messageText,
        bookingId
      })
      
      socket.emit('send-message', {
        senderId: getOwnerId(),
        receiverId: selectedCustomer.value.user_id,
        message: messageText,
        bookingId
      })
      
      // As a fallback, reload messages after a short delay
      setTimeout(async () => {
        console.log('Reloading messages as fallback')
        await loadMessages(selectedCustomer.value.user_id, selectedCustomer.value.booking_id)
      }, 600)
    } else {
      // Fallback to API if Socket.IO is not available
      const response = await OwnerMessageService.sendMessage(
        getOwnerId(),
        selectedCustomer.value.user_id,
        messageText,
        bookingId
      )
      
      if (!response?.success) {
        throw new Error('Failed to send message via API')
      }
      
      // Reload messages after successful API send
      await loadMessages(selectedCustomer.value.user_id, selectedCustomer.value.booking_id)
    }

    // Focus back on input after sending
    await nextTick()
    const input = document.querySelector('input[placeholder="Type your message here..."]')
    if (input) input.focus()

  } catch (error) {
    console.error('Error sending message:', error)
    // Restore message if sending failed
    if (!newMessage.value) newMessage.value = messageText
    
    // Show specific error messages
    if (error.response?.status === 401) {
      alert('Session expired. Please log in again.')
    } else if (error.response?.status === 400) {
      alert('Invalid message. Please check your input.')
    } else {
      alert('Failed to send message. Please check your connection and try again.')
    }
  } finally {
    sendingMessage.value = false
  }
}

// Format time for display
const formatTime = (timestamp) => {
  try {
    if (!timestamp) return '--:--'
    const date = new Date(timestamp)
    if (isNaN(date.getTime())) {
      console.error('Invalid timestamp:', timestamp)
      return '--:--'
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch (error) {
    console.error('Error formatting time:', error, 'Timestamp:', timestamp)
    return '--:--'
  }
}

// Check if a customer is currently selected
const isCustomerSelected = (customer) => {
  if (!selectedCustomer.value) return false
  return selectedCustomer.value.user_id === customer.user_id && 
         selectedCustomer.value.booking_id === customer.booking_id
}

// Get initials from full name
const getInitials = (fullName) => {
  if (!fullName) return '?'
  const names = fullName.trim().split(/\s+/)
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }
  return names[0][0].toUpperCase()
}

// Handle image loading / errors
const onImgLoad = (entity, isHeader = false) => {
  console.log(isHeader ? 'Chat header image loaded successfully:' : 'Image loaded successfully:', entity.full_name)
}
const handleImageError = (customer) => {
  console.log('Image failed to load for:', customer.full_name, 'URL:', baseUrl + customer.profile_pic)
  customer.imageError = true
}

// Scroll to bottom of messages
const scrollToBottom = () => {
  const el = messagesContainer.value
  if (!el) return
  
  // Use requestAnimationFrame for smoother scrolling
  requestAnimationFrame(() => {
    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth'
    })
  })
}

// Initialize Socket.IO
const initSocket = () => {
  try {
    socket = io(baseUrl, { 
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true
    })
  } catch (e) {
    console.error('Socket init error:', e)
    return
  }
  
  socket.on('connect', () => {
    console.log('Connected to messaging server')
    socketConnected.value = true
    // Join owner's messaging room
    if (getOwnerId()) socket.emit('join-messaging', getOwnerId())
  })

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error)
    socketConnected.value = false
  })

  socket.on('reconnect', (attemptNumber) => {
    console.log('Socket reconnected after', attemptNumber, 'attempts')
    socketConnected.value = true
    // Rejoin messaging room after reconnection
    if (getOwnerId()) socket.emit('join-messaging', getOwnerId())
  })

  socket.on('reconnect_error', (error) => {
    console.error('Socket reconnection error:', error)
    socketConnected.value = false
  })

  socket.on('new-message', (messageData) => {
    // Add new message to current conversation if it's from the selected customer and booking
    const isCurrentThread = !!(selectedCustomer.value && 
      messageData.senderId === selectedCustomer.value.user_id && 
      messageData.receiverId === getOwnerId() &&
      messageData.bookingId === selectedCustomer.value.booking_id)
    
    console.log('New message received:', {
      messageData,
      selectedCustomer: selectedCustomer.value,
      isCurrentThread,
      'Expected senderId': selectedCustomer.value?.user_id,
      'Expected receiverId': getOwnerId(),
      'Expected bookingId': selectedCustomer.value?.booking_id
    })

    if (isCurrentThread) {
      const exists = currentMessages.value.some(msg => 
        msg.message_id === messageData.messageId || 
        (msg.message === messageData.message && 
         msg.sender_id === messageData.senderId && 
         msg.created_at === messageData.createdAt)
      )
      if (!exists) {
        currentMessages.value.push({
          message_id: messageData.messageId,
          sender_id: messageData.senderId,
          receiver_id: messageData.receiverId,
          booking_id: messageData.bookingId,
          message: messageData.message,
          is_read: 0,
          created_at: messageData.createdAt,
          sender_name: messageData.senderName,
          sender_avatar: messageData.senderAvatar
        })
        nextTick(() => scrollToBottom())
      }

      // since we're viewing this thread, keep unread at 0
      const c = customers.value.find(c => c.user_id === messageData.senderId && c.booking_id === messageData.bookingId)
      if (c) c.unread_count = 0

    } else {
      // Update unread count for the sender (find by user_id and booking_id)
      const c = customers.value.find(c => c.user_id === messageData.senderId && c.booking_id === messageData.bookingId)
      if (c) c.unread_count = (c.unread_count || 0) + 1
    }
  })

  socket.on('message-sent', (messageData) => {
    console.log('Received message-sent event:', messageData)
    const isCurrentThread = !!(selectedCustomer.value && 
      messageData.senderId === getOwnerId() && 
      messageData.receiverId === selectedCustomer.value.user_id && 
      messageData.bookingId === selectedCustomer.value.booking_id)
    
    console.log('Message sent confirmation:', {
      messageData,
      selectedCustomer: selectedCustomer.value,
      isCurrentThread,
      'Expected senderId': getOwnerId(),
      'Expected receiverId': selectedCustomer.value?.user_id,
      'Expected bookingId': selectedCustomer.value?.booking_id
    })

    if (isCurrentThread) {
      const exists = currentMessages.value.some(msg => 
        msg.message_id === messageData.messageId || 
        (msg.message === messageData.message && 
         msg.sender_id === messageData.senderId && 
         msg.created_at === messageData.createdAt)
      )
      if (!exists) {
        currentMessages.value.push({
          message_id: messageData.messageId,
          sender_id: messageData.senderId,
          receiver_id: messageData.receiverId,
          booking_id: messageData.bookingId,
          message: messageData.message,
          is_read: 0,
          created_at: messageData.createdAt,
          sender_name: messageData.senderName,
          sender_avatar: messageData.senderAvatar
        })
        nextTick(() => scrollToBottom())
        console.log('Message added to conversation, total messages:', currentMessages.value.length)
      } else {
        console.log('Message already exists, skipping')
      }
    } else {
      console.log('Message not for current conversation:', {
        hasSelectedCustomer: !!selectedCustomer.value,
        senderId: messageData.senderId,
        ownerId: getOwnerId(),
        receiverId: messageData.receiverId,
        selectedCustomerId: selectedCustomer.value?.user_id,
        bookingId: messageData.bookingId,
        selectedBookingId: selectedCustomer.value?.booking_id
      })
    }
  })

  socket.on('message-error', (error) => {
    console.error('Message error:', error)
  })

  socket.on('disconnect', (reason) => {
    console.log('Disconnected from messaging server:', reason)
    socketConnected.value = false
  })
}

// Cleanup Socket.IO connection
const cleanupSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

onMounted(async () => {
  // Initialize Socket.IO
  initSocket()
  // Load customers
  await loadCustomers()
})

onUnmounted(() => {
  cleanupSocket()
})
</script>
