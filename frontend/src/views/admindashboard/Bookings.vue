<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { 
  MagnifyingGlassIcon, 
  PaperAirplaneIcon, 
  CalendarIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  MapPinIcon,
  PrinterIcon
} from "@heroicons/vue/24/outline";
import AdminBookingService from "@/services/adminBookingService";
import Swal from 'sweetalert2';

// Reactive state for the component
const bookings = ref([]);
const searchQuery = ref("");
const selectedDate = ref("");
const selectedStatus = ref("");
const selectedPaymentStatus = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;
const loading = ref(true);
const totalPages = ref(1);
const totalCount = ref(0);

// Modal states
const showBookingModal = ref(false);
const showPaymentModal = ref(false);
const selectedBooking = ref(null);
const paymentProof = ref(null);

// Fetch bookings from backend
const fetchBookings = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value,
      limit: itemsPerPage,
      search: searchQuery.value,
      date: selectedDate.value,
      status: selectedStatus.value,
      payment_status: selectedPaymentStatus.value
    };

    const response = await AdminBookingService.getAllBookings(params);
    
    if (response.success) {
      bookings.value = response.data.bookings;
      totalPages.value = response.data.pagination.totalPages;
      totalCount.value = response.data.pagination.totalCount;
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load bookings. Please refresh the page.',
    });
  } finally {
    loading.value = false;
  }
};

// Watch for changes in filters and reset pagination
watch([searchQuery, selectedDate, selectedStatus, selectedPaymentStatus], () => {
  currentPage.value = 1;
  fetchBookings();
});

// Watch for page changes
watch(currentPage, () => {
  fetchBookings();
});

// View booking details
const viewBooking = async (booking) => {
  try {
    const response = await AdminBookingService.getBookingById(booking.booking_id);
    if (response.success) {
      selectedBooking.value = response.data;
      showBookingModal.value = true;
    }
  } catch (error) {
    console.error('Error fetching booking details:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load booking details.',
    });
  }
};

// View payment proof
const viewPaymentProof = async (booking) => {
  try {
    console.log('Fetching payment proof for booking:', booking.booking_id);
    const response = await AdminBookingService.getPaymentProof(booking.booking_id);
    if (response.success) {
      console.log('Payment proof response:', response.data);
      paymentProof.value = response.data;
      showPaymentModal.value = true;
    }
  } catch (error) {
    console.error('Error fetching payment proof:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No payment proof available for this booking.',
    });
  }
};

// Update booking status
const updateBookingStatus = async (booking, newStatus) => {
  try {
    const result = await Swal.fire({
      title: 'Update Booking Status',
      text: `Are you sure you want to change the status to "${newStatus}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    });

    if (result.isConfirmed) {
      const response = await AdminBookingService.updateBookingStatus(booking.booking_id, newStatus);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Booking status updated successfully!',
        });
        await fetchBookings(); // Refresh the list
      }
    }
  } catch (error) {
    console.error('Error updating booking status:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update booking status.',
    });
  }
};

// Update payment status
const updatePaymentStatus = async (booking, newPaymentStatus) => {
  try {
    const result = await Swal.fire({
      title: 'Update Payment Status',
      text: `Are you sure you want to change the payment status to "${newPaymentStatus}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    });

    if (result.isConfirmed) {
      const response = await AdminBookingService.updatePaymentStatus(booking.booking_id, newPaymentStatus);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Payment status updated successfully!',
        });
        await fetchBookings(); // Refresh the list
      }
    }
  } catch (error) {
    console.error('Error updating payment status:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update payment status.',
    });
  }
};

// Pagination functions
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const nextPage = () => {
  goToPage(currentPage.value + 1);
};

const prevPage = () => {
  goToPage(currentPage.value - 1);
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

// Format time for display
const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Get status color
const getStatusColor = (status) => {
  switch (status) {
    case 'Confirmed': return 'bg-green-100 text-green-800';
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Completed': return 'bg-blue-100 text-blue-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Get payment status color
const getPaymentStatusColor = (status) => {
  switch (status) {
    case 'Paid': return 'bg-green-100 text-green-800';
    case 'Unpaid': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Handle image loading errors
const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/400x300/cccccc/333333?text=Image+Not+Found';
  event.target.onerror = null; // Prevent infinite loop
};

// Get payment proof URL
const getPaymentProofUrl = (paymentProofPath) => {
  console.log('Getting payment proof URL for path:', paymentProofPath);
  
  if (!paymentProofPath) {
    console.log('No payment proof path provided');
    return 'https://placehold.co/400x300/cccccc/333333?text=No+Payment+Proof';
  }
  
  // If the path already starts with http, return as is
  if (paymentProofPath.startsWith('http')) {
    console.log('Path is already a full URL:', paymentProofPath);
    return paymentProofPath;
  }
  
  // If the path starts with /uploads, prepend the server URL
  if (paymentProofPath.startsWith('/uploads')) {
    const fullUrl = `http://localhost:5000${paymentProofPath}`;
    console.log('Constructed full URL:', fullUrl);
    return fullUrl;
  }
  
  // If it's a relative path, prepend the server URL and /uploads/payments
  const fullUrl = `http://localhost:5000/uploads/payments/${paymentProofPath}`;
  console.log('Constructed full URL for relative path:', fullUrl);
  return fullUrl;
};

// Handle payment proof image errors
const handlePaymentProofError = (event) => {
  console.log('Payment proof image failed to load:', event.target.src);
  event.target.src = 'https://placehold.co/400x300/cccccc/333333?text=Payment+Proof+Not+Found';
  event.target.onerror = null; // Prevent infinite loop
};

// Print functionality
const printBookingDetails = () => {
  if (!selectedBooking.value) return;
  
  const printWindow = window.open('', '_blank');
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Booking Details - #${selectedBooking.value.booking_id}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
        .header h1 { color: #2563eb; margin: 0; }
        .header p { color: #666; margin: 5px 0; }
        .section { margin-bottom: 25px; }
        .section h3 { color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .info-item { margin-bottom: 10px; }
        .info-label { font-weight: 600; color: #6b7280; }
        .info-value { color: #111827; }
        .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .status-confirmed { background-color: #dcfce7; color: #166534; }
        .status-pending { background-color: #fef3c7; color: #92400e; }
        .status-completed { background-color: #dbeafe; color: #1e40af; }
        .status-cancelled { background-color: #fee2e2; color: #991b1b; }
        .payment-paid { background-color: #dcfce7; color: #166534; }
        .payment-unpaid { background-color: #fee2e2; color: #991b1b; }
        .amount { font-size: 18px; font-weight: bold; color: #059669; }
        .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Booking Details</h1>
        <p>Booking ID: #${selectedBooking.value.booking_id}</p>
        <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      </div>

      <div class="info-grid">
        <div class="section">
          <h3>Booking Information</h3>
          <div class="info-item">
            <span class="info-label">Date & Time:</span><br>
            <span class="info-value">${formatDate(selectedBooking.value.booking_date)} at ${formatTime(selectedBooking.value.booking_time)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Duration:</span><br>
            <span class="info-value">${selectedBooking.value.duration_option}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Meet-up Location:</span><br>
            <span class="info-value">${selectedBooking.value.meet_up_location || 'Not specified'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Status:</span><br>
            <span class="status-badge status-${selectedBooking.value.status.toLowerCase()}">${selectedBooking.value.status}</span>
          </div>
        </div>

        <div class="section">
          <h3>Customer Information</h3>
          <div class="info-item">
            <span class="info-label">Name:</span><br>
            <span class="info-value">${selectedBooking.value.customer_name}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Email:</span><br>
            <span class="info-value">${selectedBooking.value.customer_email}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Phone:</span><br>
            <span class="info-value">${selectedBooking.value.customer_phone || 'N/A'}</span>
          </div>
        </div>

        <div class="section">
          <h3>Boat Information</h3>
          <div class="info-item">
            <span class="info-label">Boat Name:</span><br>
            <span class="info-value">${selectedBooking.value.boat_name}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Type:</span><br>
            <span class="info-value">${selectedBooking.value.boat_type || 'N/A'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Capacity:</span><br>
            <span class="info-value">${selectedBooking.value.boat_capacity} passengers</span>
          </div>
        </div>

        <div class="section">
          <h3>Payment Information</h3>
          <div class="info-item">
            <span class="info-label">Total Amount:</span><br>
            <span class="info-value amount">₱${selectedBooking.value.total_price}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Payment Method:</span><br>
            <span class="info-value">${selectedBooking.value.payment_method}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Payment Status:</span><br>
            <span class="status-badge payment-${selectedBooking.value.payment_status.toLowerCase()}">${selectedBooking.value.payment_status}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Additional Services</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Islands:</span><br>
            <span class="info-value">${selectedBooking.value.islands || 'None selected'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Add-ons:</span><br>
            <span class="info-value">${selectedBooking.value.addons || 'None selected'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Food Packages:</span><br>
            <span class="info-value">${selectedBooking.value.food_packages || 'None selected'}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Boat Owner Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Name:</span><br>
            <span class="info-value">${selectedBooking.value.owner_name}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Email:</span><br>
            <span class="info-value">${selectedBooking.value.owner_email}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Phone:</span><br>
            <span class="info-value">${selectedBooking.value.owner_phone || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>This document was generated from the Island Boat Rental Management System</p>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

const printAllBookings = () => {
  if (bookings.value.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'No Data',
      text: 'No bookings to print.',
    });
    return;
  }

  const printWindow = window.open('', '_blank');
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>All Bookings Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
        .header h1 { color: #2563eb; margin: 0; }
        .header p { color: #666; margin: 5px 0; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
        th { background-color: #f9fafb; font-weight: 600; color: #374151; }
        .status-badge { padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
        .status-confirmed { background-color: #dcfce7; color: #166534; }
        .status-pending { background-color: #fef3c7; color: #92400e; }
        .status-completed { background-color: #dbeafe; color: #1e40af; }
        .status-cancelled { background-color: #fee2e2; color: #991b1b; }
        .payment-paid { background-color: #dcfce7; color: #166534; }
        .payment-unpaid { background-color: #fee2e2; color: #991b1b; }
        .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>All Bookings Report</h1>
        <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <p>Total Bookings: ${totalCount.value}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Customer</th>
            <th>Boat</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${bookings.value.map(booking => `
            <tr>
              <td>#${booking.booking_id}</td>
              <td>${booking.customer_name}</td>
              <td>${booking.boat_name}</td>
              <td>${formatDate(booking.booking_date)}<br>${formatTime(booking.booking_time)}</td>
              <td><span class="status-badge status-${booking.status.toLowerCase()}">${booking.status}</span></td>
              <td><span class="status-badge payment-${booking.payment_status.toLowerCase()}">${booking.payment_status}</span></td>
              <td>₱${booking.total_price}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>This report was generated from the Island Boat Rental Management System</p>
        <p>Page ${currentPage.value} of ${totalPages.value}</p>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

const printSingleBooking = async (booking) => {
  try {
    // Fetch full booking details
    const response = await AdminBookingService.getBookingById(booking.booking_id);
    if (response.success) {
      const fullBooking = response.data;
      
      const printWindow = window.open('', '_blank');
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Booking Details - #${fullBooking.booking_id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
            .header h1 { color: #2563eb; margin: 0; }
            .header p { color: #666; margin: 5px 0; }
            .section { margin-bottom: 25px; }
            .section h3 { color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .info-item { margin-bottom: 10px; }
            .info-label { font-weight: 600; color: #6b7280; }
            .info-value { color: #111827; }
            .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .status-confirmed { background-color: #dcfce7; color: #166534; }
            .status-pending { background-color: #fef3c7; color: #92400e; }
            .status-completed { background-color: #dbeafe; color: #1e40af; }
            .status-cancelled { background-color: #fee2e2; color: #991b1b; }
            .payment-paid { background-color: #dcfce7; color: #166534; }
            .payment-unpaid { background-color: #fee2e2; color: #991b1b; }
            .amount { font-size: 18px; font-weight: bold; color: #059669; }
            .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Booking Details</h1>
            <p>Booking ID: #${fullBooking.booking_id}</p>
            <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>

          <div class="info-grid">
            <div class="section">
              <h3>Booking Information</h3>
              <div class="info-item">
                <span class="info-label">Date & Time:</span><br>
                <span class="info-value">${formatDate(fullBooking.booking_date)} at ${formatTime(fullBooking.booking_time)}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Duration:</span><br>
                <span class="info-value">${fullBooking.duration_option}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Meet-up Location:</span><br>
                <span class="info-value">${fullBooking.meet_up_location || 'Not specified'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Status:</span><br>
                <span class="status-badge status-${fullBooking.status.toLowerCase()}">${fullBooking.status}</span>
              </div>
            </div>

            <div class="section">
              <h3>Customer Information</h3>
              <div class="info-item">
                <span class="info-label">Name:</span><br>
                <span class="info-value">${fullBooking.customer_name}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span><br>
                <span class="info-value">${fullBooking.customer_email}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Phone:</span><br>
                <span class="info-value">${fullBooking.customer_phone || 'N/A'}</span>
              </div>
            </div>

            <div class="section">
              <h3>Boat Information</h3>
              <div class="info-item">
                <span class="info-label">Boat Name:</span><br>
                <span class="info-value">${fullBooking.boat_name}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Type:</span><br>
                <span class="info-value">${fullBooking.boat_type || 'N/A'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Capacity:</span><br>
                <span class="info-value">${fullBooking.boat_capacity} passengers</span>
              </div>
            </div>

            <div class="section">
              <h3>Payment Information</h3>
              <div class="info-item">
                <span class="info-label">Total Amount:</span><br>
                <span class="info-value amount">₱${fullBooking.total_price}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Payment Method:</span><br>
                <span class="info-value">${fullBooking.payment_method}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Payment Status:</span><br>
                <span class="status-badge payment-${fullBooking.payment_status.toLowerCase()}">${fullBooking.payment_status}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Additional Services</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Islands:</span><br>
                <span class="info-value">${fullBooking.islands || 'None selected'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Add-ons:</span><br>
                <span class="info-value">${fullBooking.addons || 'None selected'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Food Packages:</span><br>
                <span class="info-value">${fullBooking.food_packages || 'None selected'}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Boat Owner Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Name:</span><br>
                <span class="info-value">${fullBooking.owner_name}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span><br>
                <span class="info-value">${fullBooking.owner_email}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Phone:</span><br>
                <span class="info-value">${fullBooking.owner_phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>This document was generated from the Island Boat Rental Management System</p>
          </div>
        </body>
        </html>
      `;
      
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  } catch (error) {
    console.error('Error printing booking:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to print booking details.',
    });
  }
};

onMounted(() => {
  fetchBookings();
});
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Bookings Management</h1>
          <p class="mt-2 text-sm text-gray-600">Manage and monitor all booking requests</p>
        </div>
        <div class="mt-4 sm:mt-0 flex items-center space-x-4">
          <div class="bg-white px-4 py-2 rounded-lg shadow-sm border">
            <span class="text-sm text-gray-600">Total: </span>
            <span class="font-semibold text-gray-900">{{ totalCount }}</span>
          </div>
          <button
            @click="printAllBookings"
            :disabled="loading || bookings.length === 0"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            <PrinterIcon class="w-4 h-4" />
            Print All
          </button>
          <button
            @click="fetchBookings"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Filters Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Filters & Search</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Search Bar -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <div class="relative">
            <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search bookings..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <!-- Date Picker -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <div class="relative">
            <CalendarIcon class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="date"
              v-model="selectedDate"
              class="w-full pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            />
          </div>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div class="relative">
            <ClockIcon class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
            <select
              v-model="selectedStatus"
              class="w-full pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 appearance-none bg-white"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <!-- Payment Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Payment</label>
          <div class="relative">
            <CurrencyDollarIcon class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
            <select
              v-model="selectedPaymentStatus"
              class="w-full pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 appearance-none bg-white"
            >
              <option value="">All Payment</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Bookings Cards -->
    <div v-else>
      <!-- Empty State -->
      <div v-if="bookings.length === 0" class="text-center py-12">
        <div class="mx-auto h-24 w-24 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No bookings found</h3>
        <p class="mt-2 text-sm text-gray-500">Try adjusting your search criteria or filters.</p>
      </div>

      <!-- Bookings Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="booking in bookings" 
          :key="booking.booking_id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
        >
          <!-- Card Header -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">#{{ booking.booking_id }}</h3>
                <p class="text-sm text-gray-600">{{ booking.customer_name }}</p>
              </div>
              <div class="flex flex-col items-end space-y-2">
                <span :class="['px-3 py-1 text-xs font-semibold rounded-full', getStatusColor(booking.status)]">
                  {{ booking.status }}
                </span>
                <span :class="['px-3 py-1 text-xs font-semibold rounded-full', getPaymentStatusColor(booking.payment_status)]">
                  {{ booking.payment_status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-6">
            <div class="space-y-4">
              <!-- Boat Info -->
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ booking.boat_name }}</p>
                  <p class="text-xs text-gray-500">{{ booking.boat_type }} • {{ booking.boat_capacity }} passengers</p>
                </div>
              </div>

              <!-- Date & Time -->
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CalendarIcon class="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ formatDate(booking.booking_date) }}</p>
                  <p class="text-xs text-gray-500">{{ formatTime(booking.booking_time) }} • {{ booking.duration_option }}</p>
                </div>
              </div>

              <!-- Location -->
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPinIcon class="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Meet-up Location</p>
                  <p class="text-xs text-gray-500">{{ booking.meet_up_location || 'Not specified' }}</p>
                </div>
              </div>

              <!-- Amount -->
              <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p class="text-sm font-medium text-gray-900">Total Amount</p>
                  <p class="text-lg font-bold text-gray-900">₱{{ booking.total_price }}</p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-500">Payment Method</p>
                  <p class="text-sm font-medium text-gray-900">{{ booking.payment_method }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex space-x-2">
                <button
                  @click="viewBooking(booking)"
                  class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <EyeIcon class="w-4 h-4" />
                  View Details
                </button>
                <button
                  v-if="booking.payment_proof"
                  @click="viewPaymentProof(booking)"
                  class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <CurrencyDollarIcon class="w-4 h-4" />
                  Payment Proof
                </button>
                <button
                  @click="printSingleBooking(booking)"
                  class="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <PrinterIcon class="w-4 h-4" />
                  Print
                </button>
              </div>
              <div class="text-xs text-gray-500">
                Created {{ formatDate(booking.created_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="bookings.length > 0" class="mt-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center text-sm text-gray-700 mb-4 sm:mb-0">
            Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalCount) }} of {{ totalCount }} results
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              Previous
            </button>
            <div class="flex items-center space-x-1">
              <span class="px-3 py-2 text-sm font-medium text-gray-700 bg-blue-50 border border-blue-200 rounded-lg">
                {{ currentPage }}
              </span>
              <span class="text-sm text-gray-500">of {{ totalPages }}</span>
            </div>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Details Modal -->
    <div v-if="showBookingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Booking Details</h2>
              <p class="text-sm text-gray-600">Complete booking information and management</p>
            </div>
            <button @click="showBookingModal = false" class="text-gray-400 hover:text-gray-600 transition-colors duration-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-6">

          <div v-if="selectedBooking" class="space-y-6">
            <!-- Status Overview -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Booking #{{ selectedBooking.booking_id }}</h3>
                  <p class="text-sm text-gray-600">Created on {{ formatDate(selectedBooking.created_at) }}</p>
                </div>
                <div class="flex space-x-3">
                  <span :class="['px-4 py-2 text-sm font-semibold rounded-full', getStatusColor(selectedBooking.status)]">
                    {{ selectedBooking.status }}
                  </span>
                  <span :class="['px-4 py-2 text-sm font-semibold rounded-full', getPaymentStatusColor(selectedBooking.payment_status)]">
                    {{ selectedBooking.payment_status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Main Information Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Booking Details -->
              <div class="bg-white border border-gray-200 rounded-xl p-6">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CalendarIcon class="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">Booking Details</h3>
                </div>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Date & Time</span>
                    <span class="text-sm font-medium text-gray-900">{{ formatDate(selectedBooking.booking_date) }} at {{ formatTime(selectedBooking.booking_time) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Duration</span>
                    <span class="text-sm font-medium text-gray-900">{{ selectedBooking.duration_option }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Meet-up Location</span>
                    <span class="text-sm font-medium text-gray-900">{{ selectedBooking.meet_up_location || 'Not specified' }}</span>
                  </div>
                </div>
              </div>

              <!-- Customer Information -->
              <div class="bg-white border border-gray-200 rounded-xl p-6">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <UserIcon class="w-5 h-5 text-green-600" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">Customer Information</h3>
                </div>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Name</span>
                    <span class="text-sm font-medium text-gray-900">{{ selectedBooking.customer_name }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Email</span>
                    <span class="text-sm font-medium text-gray-900">{{ selectedBooking.customer_email }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Phone</span>
                    <span class="text-sm font-medium text-gray-900">{{ selectedBooking.customer_phone || 'N/A' }}</span>
                  </div>
                </div>
              </div>

              <!-- Boat Information -->
              <div class="bg-white border border-gray-200 rounded-xl p-6">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">Boat Information</h3>
                </div>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Boat Name</span>
                    <span class="text-sm font-medium text-gray-900">{{ selectedBooking.boat_name }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Type</span>
                    <span class="text-sm font-medium text-gray-900">{{ selectedBooking.boat_type || 'N/A' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Capacity</span>
                    <span class="text-sm font-medium text-gray-900">{{ selectedBooking.boat_capacity }} passengers</span>
                  </div>
                </div>
              </div>

              <!-- Payment Information -->
              <div class="bg-white border border-gray-200 rounded-xl p-6">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <CurrencyDollarIcon class="w-5 h-5 text-yellow-600" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">Payment Information</h3>
                </div>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Total Amount</span>
                    <span class="text-lg font-bold text-gray-900">₱{{ selectedBooking.total_price }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Payment Method</span>
                    <span class="text-sm font-medium text-gray-900">{{ selectedBooking.payment_method }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Payment Status</span>
                    <span :class="['px-3 py-1 text-xs font-semibold rounded-full', getPaymentStatusColor(selectedBooking.payment_status)]">
                      {{ selectedBooking.payment_status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional Services -->
            <div class="bg-white border border-gray-200 rounded-xl p-6">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">Additional Services</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Islands</h4>
                  <p class="text-sm text-gray-600">{{ selectedBooking.islands || 'None selected' }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Add-ons</h4>
                  <p class="text-sm text-gray-600">{{ selectedBooking.addons || 'None selected' }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Food Packages</h4>
                  <p class="text-sm text-gray-600">{{ selectedBooking.food_packages || 'None selected' }}</p>
                </div>
              </div>
            </div>

            <!-- Boat Owner Information -->
            <div class="bg-white border border-gray-200 rounded-xl p-6">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <UserIcon class="w-5 h-5 text-orange-600" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900">Boat Owner</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span class="text-sm text-gray-600">Name</span>
                  <p class="text-sm font-medium text-gray-900">{{ selectedBooking.owner_name }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-600">Email</span>
                  <p class="text-sm font-medium text-gray-900">{{ selectedBooking.owner_email }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-600">Phone</span>
                  <p class="text-sm font-medium text-gray-900">{{ selectedBooking.owner_phone || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between items-center pt-4 border-t">
              <div class="flex space-x-2">
                <!-- Status Update Buttons -->
                <div class="flex space-x-2">
                  <button
                    v-if="selectedBooking.status !== 'Confirmed'"
                    @click="updateBookingStatus(selectedBooking, 'Confirmed')"
                    class="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors duration-200"
                  >
                    Confirm
                  </button>
                  <button
                    v-if="selectedBooking.status !== 'Completed'"
                    @click="updateBookingStatus(selectedBooking, 'Completed')"
                    class="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    Complete
                  </button>
                  <button
                    v-if="selectedBooking.status !== 'Cancelled'"
                    @click="updateBookingStatus(selectedBooking, 'Cancelled')"
                    class="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
                
                <!-- Payment Status Update Buttons -->
                <div class="flex space-x-2 ml-4">
                  <button
                    v-if="selectedBooking.payment_status !== 'Paid'"
                    @click="updatePaymentStatus(selectedBooking, 'Paid')"
                    class="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors duration-200"
                  >
                    Mark Paid
                  </button>
                  <button
                    v-if="selectedBooking.payment_status !== 'Unpaid'"
                    @click="updatePaymentStatus(selectedBooking, 'Unpaid')"
                    class="px-3 py-1 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                  >
                    Mark Unpaid
                  </button>
                </div>
              </div>
              
              <div class="flex space-x-3">
                <button
                  @click="printBookingDetails"
                  class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <PrinterIcon class="w-4 h-4" />
                  Print Details
                </button>
                <button
                  v-if="selectedBooking.payment_proof"
                  @click="viewPaymentProof(selectedBooking)"
                  class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <CurrencyDollarIcon class="w-4 h-4" />
                  View Payment Proof
                </button>
                <button
                  @click="showBookingModal = false"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Proof Modal -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Payment Proof</h2>
            <button @click="showPaymentModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div v-if="paymentProof" class="space-y-6">
            <!-- Payment Info -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="font-semibold text-gray-800 mb-3">Payment Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span class="font-medium">Amount:</span> ₱{{ paymentProof.total_price }}</div>
                <div><span class="font-medium">Method:</span> {{ paymentProof.payment_method }}</div>
                <div><span class="font-medium">Status:</span> 
                  <span :class="['px-2 py-1 rounded-full text-xs font-semibold', getPaymentStatusColor(paymentProof.payment_status)]">
                    {{ paymentProof.payment_status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Payment Proof Image -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="font-semibold text-gray-800 mb-3">Payment Proof Image</h3>
              <div class="flex justify-center">
                <img
                  :src="getPaymentProofUrl(paymentProof.payment_proof)"
                  :alt="'Payment proof for booking'"
                  class="max-w-full h-auto max-h-96 rounded-lg shadow-lg"
                  @error="handlePaymentProofError"
                />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-3 pt-4 border-t">
              <a
                :href="getPaymentProofUrl(paymentProof.payment_proof)"
                target="_blank"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Open in New Tab
              </a>
              <button
                @click="showPaymentModal = false"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Scoped styles can be added here if needed, but Tailwind handles most of the design */
</style>
