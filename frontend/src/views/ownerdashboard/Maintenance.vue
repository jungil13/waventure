<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-6">
    <!-- Welcome Header -->
    <div class="mb-8">
      <div class="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-3xl p-8 text-white shadow-2xl">
        <h1 class="text-4xl font-bold mb-2">Boat Maintenance</h1>
        <p class="text-xl opacity-90">Monitor and manage your fleet's maintenance schedule</p>
      </div>
    </div>

    <!-- Enhanced Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-300 mb-1">Scheduled</p>
            <h2 class="text-3xl font-bold text-white">{{ stats.scheduled_count || 0 }}</h2>
            <p class="text-xs text-blue-400 mt-1">Upcoming maintenance</p>
          </div>
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
            <CalendarDaysIcon class="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-300 mb-1">In Progress</p>
            <h2 class="text-3xl font-bold text-white">{{ stats.in_progress_count || 0 }}</h2>
            <p class="text-xs text-yellow-400 mt-1">Currently being serviced</p>
          </div>
          <div class="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <WrenchScrewdriverIcon class="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-300 mb-1">Completed</p>
            <h2 class="text-3xl font-bold text-white">{{ stats.completed_count || 0 }}</h2>
            <p class="text-xs text-green-400 mt-1">Successfully serviced</p>
          </div>
          <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
            <CheckCircleIcon class="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-300 mb-1">Total Cost</p>
            <h2 class="text-3xl font-bold text-white">{{ formatCost(stats.total_cost) }}</h2>
            <p class="text-xs text-purple-400 mt-1">Last 12 months</p>
          </div>
          <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <CurrencyDollarIcon class="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Actions -->
    <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-8 border border-white/20">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Status Filter -->
          <div class="flex items-center space-x-2">
            <label class="text-white font-medium">Status:</label>
            <select
              v-model="filters.status"
              @change="applyFilters"
              class="bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all" class="text-black font-bold">All Status</option>
              <option value="Scheduled" class="text-black font-bold">Scheduled</option>
              <option value="In Progress" class="text-black font-bold">In Progress</option>
              <option value="Completed" class="text-black font-bold">Completed</option>
              <option value="Cancelled" class="text-black font-bold">Cancelled</option>
            </select>
          </div>

          <!-- Type Filter -->
          <div class="flex items-center space-x-2">
            <label class="text-white font-medium">Type:</label>
            <select
              v-model="filters.maintenance_type"
              @change="applyFilters"
              class="bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all" class="text-black font-bold">All Types</option>
              <option value="Routine" class="text-black font-bold">Routine</option>
              <option value="Repair" class="text-black font-bold">Repair</option>
              <option value="Inspection" class="text-black font-bold">Inspection</option>
              <option value="Emergency" class="text-black font-bold">Emergency</option>
            </select>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Refresh Button -->
          <button
            @click="fetchMaintenance"
            :disabled="loading"
            class="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-xl transition-colors duration-200 disabled:opacity-50"
          >
            <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': loading }" />
            <span>Refresh</span>
          </button>

          <!-- Print All Button -->
          <button
            @click="printAllMaintenance"
            class="flex items-center space-x-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-xl transition-colors duration-200"
          >
            <PrinterIcon class="w-4 h-4" />
            <span>Print All</span>
          </button>

          <!-- Export Button -->
          <button
            @click="exportMaintenance"
            class="flex items-center space-x-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-4 py-2 rounded-xl transition-colors duration-200"
          >
            <DocumentArrowDownIcon class="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
        <div class="flex items-center space-x-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span class="text-white text-lg">Loading maintenance records...</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-500/20 border border-red-500/30 rounded-3xl p-6 mb-8">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
          <span class="text-white text-lg">⚠️</span>
        </div>
        <div>
          <h3 class="text-red-400 font-semibold">Error Loading Maintenance</h3>
          <p class="text-gray-300 text-sm">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Maintenance Records -->
    <div v-else class="space-y-6">
      <!-- Empty State -->
      <div v-if="maintenance.length === 0" class="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center border border-white/20">
        <WrenchScrewdriverIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-white mb-2">No Maintenance Records</h3>
        <p class="text-gray-300">No maintenance records found for your boats.</p>
      </div>

      <!-- Maintenance Cards -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="record in maintenance"
          :key="record.maintenance_id"
          class="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 group"
        >
          <!-- Header with Status -->
          <div class="p-6 pb-4">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <WrenchScrewdriverIcon class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-white">{{ record.boat_name }}</h3>
                  <p class="text-sm text-gray-300">Maintenance #{{ record.maintenance_id }}</p>
                </div>
              </div>
              <span
                :class="{
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30': record.status === 'Scheduled',
                  'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30': record.status === 'In Progress',
                  'bg-green-500/20 text-green-400 border border-green-500/30': record.status === 'Completed',
                  'bg-red-500/20 text-red-400 border border-red-500/30': record.status === 'Cancelled'
                }"
                class="px-3 py-1 rounded-full text-xs font-semibold"
              >
                {{ record.status }}
              </span>
            </div>

            <!-- Maintenance Details -->
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <CalendarDaysIcon class="w-5 h-5 text-gray-400" />
                <div>
                  <p class="text-sm text-gray-300">Scheduled Date</p>
                  <p class="text-white font-medium">{{ formatDate(record.scheduled_date) }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <ClockIcon class="w-5 h-5 text-gray-400" />
                <div>
                  <p class="text-sm text-gray-300">Scheduled Time</p>
                  <p class="text-white font-medium">{{ formatTime(record.scheduled_time) }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <WrenchScrewdriverIcon class="w-5 h-5 text-gray-400" />
                <div>
                  <p class="text-sm text-gray-300">Maintenance Type</p>
                  <p class="text-white font-medium">{{ record.maintenance_type }}</p>
                </div>
              </div>

              <div v-if="record.description" class="flex items-start space-x-3">
                <DocumentTextIcon class="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p class="text-sm text-gray-300">Description</p>
                  <p class="text-white font-medium">{{ record.description }}</p>
                </div>
              </div>

              <div v-if="record.assigned_technician" class="flex items-center space-x-3">
                <UserIcon class="w-5 h-5 text-gray-400" />
                <div>
                  <p class="text-sm text-gray-300">Technician</p>
                  <p class="text-white font-medium">{{ record.assigned_technician }}</p>
                </div>
              </div>

              <div v-if="record.estimated_duration" class="flex items-center space-x-3">
                <ClockIcon class="w-5 h-5 text-gray-400" />
                <div>
                  <p class="text-sm text-gray-300">Estimated Duration</p>
                  <p class="text-white font-medium">{{ formatDuration(record.estimated_duration) }}</p>
                </div>
              </div>

              <div v-if="record.cost" class="flex items-center space-x-3">
                <CurrencyDollarIcon class="w-5 h-5 text-gray-400" />
                <div>
                  <p class="text-sm text-gray-300">Estimated Cost</p>
                  <p class="text-white font-medium">{{ formatCost(record.cost) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="px-6 pb-6">
            <div class="flex justify-end space-x-3">
              <button
                @click="viewMaintenanceDetails(record)"
                class="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-xl transition-colors duration-200"
              >
                <EyeIcon class="w-4 h-4" />
                <span>View Details</span>
              </button>
              <button
                @click="editMaintenanceStatus(record)"
                class="flex items-center space-x-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-4 py-2 rounded-xl transition-colors duration-200"
              >
                <PencilSquareIcon class="w-4 h-4" />
                <span>Edit Status</span>
              </button>
              <button
                @click="printMaintenanceRecord(record)"
                class="flex items-center space-x-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-xl transition-colors duration-200"
              >
                <PrinterIcon class="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total_pages > 1" class="flex justify-center mt-8">
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
          <div class="flex items-center space-x-2">
            <button
              @click="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page <= 1"
              class="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <span class="px-4 py-2 text-white">
              Page {{ pagination.current_page }} of {{ pagination.total_pages }}
            </span>
            
            <button
              @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page >= pagination.total_pages"
              class="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Maintenance Details Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 backdrop-blur-sm"
    >
      <div
        class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-4xl shadow-2xl border border-white/20 relative text-white overflow-y-auto max-h-[90vh]"
      >
        <button
          @click="closeModal"
          class="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>

        <div class="mb-6">
          <h2 class="text-3xl font-bold mb-2 flex items-center space-x-2">
            <WrenchScrewdriverIcon class="w-8 h-8 text-orange-500" />
            <span>Maintenance Details</span>
          </h2>
          <p class="text-gray-300">Complete maintenance information and history</p>
        </div>

        <!-- Maintenance Info Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-white/5 rounded-2xl p-4">
            <h3 class="font-semibold text-white mb-3 flex items-center space-x-2">
              <DocumentTextIcon class="w-5 h-5 text-blue-400" />
              <span>Basic Information</span>
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">Maintenance ID:</span>
                <span class="text-white font-medium">#{{ selectedMaintenance.maintenance_id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Boat:</span>
                <span class="text-white font-medium">{{ selectedMaintenance.boat_name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Type:</span>
                <span class="text-white font-medium">{{ selectedMaintenance.maintenance_type }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Status:</span>
                <span class="text-white font-medium">{{ selectedMaintenance.status }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Created By:</span>
                <span class="text-white font-medium">{{ selectedMaintenance.created_by_name }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white/5 rounded-2xl p-4">
            <h3 class="font-semibold text-white mb-3 flex items-center space-x-2">
              <CalendarDaysIcon class="w-5 h-5 text-green-400" />
              <span>Schedule & Cost</span>
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">Date:</span>
                <span class="text-white font-medium">{{ formatDate(selectedMaintenance.scheduled_date) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Time:</span>
                <span class="text-white font-medium">{{ formatTime(selectedMaintenance.scheduled_time) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Duration:</span>
                <span class="text-white font-medium">{{ formatDuration(selectedMaintenance.estimated_duration) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Cost:</span>
                <span class="text-green-400 font-bold">{{ formatCost(selectedMaintenance.cost) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Description and Notes -->
        <div v-if="selectedMaintenance.description || selectedMaintenance.notes" class="bg-white/5 rounded-2xl p-6 mb-6">
          <h3 class="font-semibold text-white mb-4 flex items-center space-x-2">
            <DocumentTextIcon class="w-5 h-5 text-yellow-400" />
            <span>Description & Notes</span>
          </h3>
          <div class="space-y-4">
            <div v-if="selectedMaintenance.description">
              <h4 class="text-sm font-medium text-gray-300 mb-2">Description:</h4>
              <p class="text-white">{{ selectedMaintenance.description }}</p>
            </div>
            <div v-if="selectedMaintenance.notes">
              <h4 class="text-sm font-medium text-gray-300 mb-2">Notes:</h4>
              <p class="text-white">{{ selectedMaintenance.notes }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4">
          <button
            @click="closeModal"
            class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-200"
          >
            Close
          </button>
          <button
            @click="printMaintenanceRecord(selectedMaintenance)"
            class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Print Record
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Status Modal -->
    <div
      v-if="showEditStatusModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 backdrop-blur-sm"
    >
      <div
        class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-white/20 relative text-white"
      >
        <button
          @click="closeEditStatusModal"
          class="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>

        <div class="mb-6">
          <h2 class="text-3xl font-bold mb-2 flex items-center space-x-2">
            <PencilSquareIcon class="w-8 h-8 text-yellow-500" />
            <span>Edit Maintenance Status</span>
          </h2>
          <p class="text-gray-300">Update the status and details for this maintenance record</p>
        </div>

        <!-- Maintenance Info -->
        <div class="bg-white/5 rounded-2xl p-4 mb-6">
          <h3 class="font-semibold text-white mb-3">Maintenance Details</h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-400">Boat:</span>
              <span class="text-white font-medium ml-2">{{ editingMaintenance.boat_name }}</span>
            </div>
            <div>
              <span class="text-gray-400">Type:</span>
              <span class="text-white font-medium ml-2">{{ editingMaintenance.maintenance_type }}</span>
            </div>
            <div>
              <span class="text-gray-400">Scheduled Date:</span>
              <span class="text-white font-medium ml-2">{{ formatDate(editingMaintenance.scheduled_date) }}</span>
            </div>
            <div>
              <span class="text-gray-400">Current Status:</span>
              <span class="text-white font-medium ml-2">{{ editingMaintenance.status }}</span>
            </div>
          </div>
        </div>

        <!-- Status Form -->
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Status *</label>
            <select
              v-model="statusForm.status"
              class="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="Scheduled" class="text-black font-bold">Scheduled</option>
              <option value="In Progress" class="text-black font-bold">In Progress</option>
              <option value="Completed" class="text-black font-bold">Completed</option>
              <option value="Cancelled" class="text-black font-bold">Cancelled</option>
            </select>
            
            <!-- Info message for Completed status -->
            <div v-if="statusForm.status === 'Completed'" class="mt-2 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
              <div class="flex items-center space-x-2">
                <CheckCircleIcon class="w-5 h-5 text-green-400" />
                <p class="text-sm text-green-300">
                  <strong>Note:</strong> When you mark this maintenance as "Completed", the boat status will automatically be changed to "Available".
                </p>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Actual Duration (hours)</label>
            <input
              v-model="statusForm.actual_duration"
              type="number"
              min="0"
              step="0.5"
              placeholder="Enter actual duration in hours"
              class="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Notes</label>
            <textarea
              v-model="statusForm.notes"
              rows="3"
              placeholder="Add any additional notes or comments..."
              class="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            ></textarea>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4 mt-8">
          <button
            @click="closeEditStatusModal"
            class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-200"
          >
            Cancel
          </button>
          <button
            @click="updateMaintenanceStatus"
            class="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import AOS from "aos";
import "aos/dist/aos.css";
import OwnerMaintenanceService from "@/services/ownerMaintenanceService";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  XMarkIcon,
  PencilSquareIcon,
} from "@heroicons/vue/24/outline";

// Reactive data
const maintenance = ref([]);
const stats = ref({});
const showModal = ref(false);
const showEditStatusModal = ref(false);
const selectedMaintenance = ref({});
const editingMaintenance = ref({});
const loading = ref(false);
const error = ref(null);
const filters = ref({
  status: 'all',
  maintenance_type: 'all'
});
const pagination = ref({
  current_page: 1,
  total_pages: 1,
  total_records: 0,
  limit: 20
});
const statusForm = ref({
  status: '',
  actual_duration: '',
  notes: ''
});

// API Functions
const fetchMaintenance = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const response = await OwnerMaintenanceService.getOwnerMaintenance({
      status: filters.value.status,
      maintenance_type: filters.value.maintenance_type,
      page: pagination.value.current_page,
      limit: pagination.value.limit
    });
    
    if (response.success) {
      maintenance.value = response.data.maintenance;
      pagination.value = response.data.pagination;
    } else {
      throw new Error(response.message || 'Failed to fetch maintenance records');
    }
  } catch (err) {
    console.error("Error fetching maintenance:", err);
    error.value = "Failed to fetch maintenance records. Please try again.";
    // Fallback to mock data for development
    maintenance.value = [
      {
        maintenance_id: 1,
        boat_name: "BARKO BARKO",
        maintenance_type: "Routine",
        status: "Scheduled",
        scheduled_date: "2025-09-15",
        scheduled_time: "09:00:00",
        description: "Regular engine maintenance and safety inspection",
        assigned_technician: "John Smith",
        estimated_duration: 120,
        cost: 2500.00,
        notes: "Check all safety equipment",
        created_by_name: "Admin User"
      },
      {
        maintenance_id: 2,
        boat_name: "Inday Baroday Sail",
        maintenance_type: "Repair",
        status: "In Progress",
        scheduled_date: "2025-09-10",
        scheduled_time: "14:00:00",
        description: "Engine repair and propeller replacement",
        assigned_technician: "Mike Johnson",
        estimated_duration: 240,
        cost: 5000.00,
        notes: "Urgent repair needed",
        created_by_name: "Admin User"
      },
      {
        maintenance_id: 3,
        boat_name: "Kris Luci",
        maintenance_type: "Inspection",
        status: "Completed",
        scheduled_date: "2025-09-05",
        scheduled_time: "10:00:00",
        description: "Annual safety inspection",
        assigned_technician: "Sarah Wilson",
        estimated_duration: 90,
        cost: 1500.00,
        notes: "All systems checked and approved",
        created_by_name: "Admin User"
      }
    ];
  } finally {
    loading.value = false;
  }
};

const fetchStats = async () => {
  try {
    const response = await OwnerMaintenanceService.getOwnerMaintenanceStats();
    if (response.success) {
      stats.value = response.data;
    }
  } catch (err) {
    console.error("Error fetching stats:", err);
    // Fallback to mock stats
    stats.value = {
      scheduled_count: 1,
      in_progress_count: 1,
      completed_count: 1,
      total_cost: 9000.00
    };
  }
};

// Helper functions
const formatDate = (dateString) => {
  return OwnerMaintenanceService.formatDate(dateString);
};

const formatTime = (timeString) => {
  return OwnerMaintenanceService.formatTime(timeString);
};

const formatDuration = (duration) => {
  return OwnerMaintenanceService.formatDuration(duration);
};

const formatCost = (cost) => {
  return OwnerMaintenanceService.formatCost(cost);
};

// Event handlers
const viewMaintenanceDetails = (record) => {
  selectedMaintenance.value = { ...record };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedMaintenance.value = {};
};

const editMaintenanceStatus = (record) => {
  editingMaintenance.value = { ...record };
  statusForm.value = {
    status: record.status,
    actual_duration: record.actual_duration || '',
    notes: record.notes || ''
  };
  showEditStatusModal.value = true;
};

const closeEditStatusModal = () => {
  showEditStatusModal.value = false;
  editingMaintenance.value = {};
  statusForm.value = {
    status: '',
    actual_duration: '',
    notes: ''
  };
};

const updateMaintenanceStatus = async () => {
  try {
    if (!statusForm.value.status) {
      alert('Please select a status');
      return;
    }

    const updateData = {
      status: statusForm.value.status,
      actual_duration: statusForm.value.actual_duration ? parseInt(statusForm.value.actual_duration) : null,
      notes: statusForm.value.notes
    };

    // Call the maintenance service to update status
    const response = await OwnerMaintenanceService.updateMaintenanceStatus(
      editingMaintenance.value.maintenance_id, 
      updateData
    );

    if (response.success) {
      // Update the local maintenance record
      const index = maintenance.value.findIndex(m => m.maintenance_id === editingMaintenance.value.maintenance_id);
      if (index !== -1) {
        maintenance.value[index].status = statusForm.value.status;
        maintenance.value[index].actual_duration = updateData.actual_duration;
        maintenance.value[index].notes = statusForm.value.notes;
      }

      // Show success message with boat status update info
      if (statusForm.value.status === 'Completed') {
        alert('Maintenance status updated successfully! The boat status has been automatically changed to "Available".');
      } else {
        alert('Maintenance status updated successfully!');
      }
      
      closeEditStatusModal();
      await fetchStats(); // Refresh stats
    } else {
      throw new Error(response.message || 'Failed to update maintenance status');
    }
  } catch (err) {
    console.error("Error updating maintenance status:", err);
    alert('Failed to update maintenance status. Please try again.');
  }
};

const applyFilters = () => {
  pagination.value.current_page = 1;
  fetchMaintenance();
};

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.total_pages) {
    pagination.value.current_page = page;
    fetchMaintenance();
  }
};

const printMaintenanceRecord = (record) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Maintenance Record - ${record.boat_name}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #333; margin-bottom: 10px; }
        .header p { color: #666; }
        .section { margin-bottom: 20px; }
        .section h2 { color: #333; border-bottom: 2px solid #333; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .info-item { margin-bottom: 10px; }
        .info-label { font-weight: bold; color: #555; }
        .info-value { color: #333; }
        .status { padding: 5px 10px; border-radius: 5px; font-weight: bold; }
        .status.scheduled { background-color: #dbeafe; color: #1e40af; }
        .status.in-progress { background-color: #fef3c7; color: #d97706; }
        .status.completed { background-color: #d1fae5; color: #059669; }
        .status.cancelled { background-color: #fee2e2; color: #dc2626; }
        .description { background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-top: 10px; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Boat Maintenance Record</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div class="section">
        <h2>Basic Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Maintenance ID:</span>
            <span class="info-value">#${record.maintenance_id}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Boat Name:</span>
            <span class="info-value">${record.boat_name}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Maintenance Type:</span>
            <span class="info-value">${record.maintenance_type}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Status:</span>
            <span class="info-value status ${record.status.toLowerCase().replace(' ', '-')}">${record.status}</span>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h2>Schedule & Details</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Scheduled Date:</span>
            <span class="info-value">${formatDate(record.scheduled_date)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Scheduled Time:</span>
            <span class="info-value">${formatTime(record.scheduled_time)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Estimated Duration:</span>
            <span class="info-value">${formatDuration(record.estimated_duration)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Estimated Cost:</span>
            <span class="info-value">${formatCost(record.cost)}</span>
          </div>
        </div>
      </div>
      
      ${record.assigned_technician ? `
      <div class="section">
        <h2>Assigned Personnel</h2>
        <div class="info-item">
          <span class="info-label">Technician:</span>
          <span class="info-value">${record.assigned_technician}</span>
        </div>
      </div>
      ` : ''}
      
      ${record.description ? `
      <div class="section">
        <h2>Description</h2>
        <div class="description">${record.description}</div>
      </div>
      ` : ''}
      
      ${record.notes ? `
      <div class="section">
        <h2>Notes</h2>
        <div class="description">${record.notes}</div>
      </div>
      ` : ''}
      
      <div class="footer">
        <p>This document was generated from the WAVENTURE Boat Management System</p>
        <p>For questions, please contact the system administrator</p>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.print();
};

const printAllMaintenance = () => {
  if (maintenance.value.length === 0) {
    alert('No maintenance records to print');
    return;
  }
  
  const printWindow = window.open('', '_blank');
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>All Maintenance Records</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #333; margin-bottom: 10px; }
        .header p { color: #666; }
        .record { margin-bottom: 30px; page-break-inside: avoid; }
        .record h2 { color: #333; border-bottom: 2px solid #333; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .info-item { margin-bottom: 10px; }
        .info-label { font-weight: bold; color: #555; }
        .info-value { color: #333; }
        .status { padding: 5px 10px; border-radius: 5px; font-weight: bold; }
        .status.scheduled { background-color: #dbeafe; color: #1e40af; }
        .status.in-progress { background-color: #fef3c7; color: #d97706; }
        .status.completed { background-color: #d1fae5; color: #059669; }
        .status.cancelled { background-color: #fee2e2; color: #dc2626; }
        .description { background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-top: 10px; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>All Maintenance Records</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
        <p>Total Records: ${maintenance.value.length}</p>
      </div>
      
      ${maintenance.value.map(record => `
        <div class="record">
          <h2>${record.boat_name} - Maintenance #${record.maintenance_id}</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Type:</span>
              <span class="info-value">${record.maintenance_type}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span>
              <span class="info-value status ${record.status.toLowerCase().replace(' ', '-')}">${record.status}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date:</span>
              <span class="info-value">${formatDate(record.scheduled_date)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Time:</span>
              <span class="info-value">${formatTime(record.scheduled_time)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Duration:</span>
              <span class="info-value">${formatDuration(record.estimated_duration)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Cost:</span>
              <span class="info-value">${formatCost(record.cost)}</span>
            </div>
          </div>
          ${record.description ? `<div class="description"><strong>Description:</strong> ${record.description}</div>` : ''}
          ${record.assigned_technician ? `<div class="info-item"><span class="info-label">Technician:</span> <span class="info-value">${record.assigned_technician}</span></div>` : ''}
        </div>
      `).join('')}
      
      <div class="footer">
        <p>This document was generated from the WAVENTURE Boat Management System</p>
        <p>For questions, please contact the system administrator</p>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.print();
};

const exportMaintenance = () => {
  if (maintenance.value.length === 0) {
    alert('No maintenance records to export');
    return;
  }
  
  // Create CSV content
  const headers = [
    'Maintenance ID',
    'Boat Name',
    'Type',
    'Status',
    'Scheduled Date',
    'Scheduled Time',
    'Description',
    'Technician',
    'Duration (minutes)',
    'Cost',
    'Notes'
  ];
  
  const csvContent = [
    headers.join(','),
    ...maintenance.value.map(record => [
      record.maintenance_id,
      `"${record.boat_name}"`,
      record.maintenance_type,
      record.status,
      record.scheduled_date,
      record.scheduled_time,
      `"${record.description || ''}"`,
      `"${record.assigned_technician || ''}"`,
      record.estimated_duration || '',
      record.cost || '',
      `"${record.notes || ''}"`
    ].join(','))
  ].join('\n');
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `maintenance_records_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Initialize component
onMounted(async () => {
  AOS.init({ duration: 1000, once: true });
  await Promise.all([
    fetchMaintenance(),
    fetchStats()
  ]);
});
</script>
