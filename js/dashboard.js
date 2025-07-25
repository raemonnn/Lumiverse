const firebaseConfig = {
  apiKey: "AIzaSyBvh8K80mOALcqBI9YlBGqkuJZcrzP834I",
  authDomain: "lumiweb-394ab.firebaseapp.com",
  databaseURL: "https://lumiweb-394ab-default-rtdb.firebaseio.com",
  projectId: "lumiweb-394ab",
  storageBucket: "lumiweb-394ab.firebasestorage.app",
  messagingSenderId: "366924325649",
  appId: "1:366924325649:web:de05f0fa3c2878478362b0",
  measurementId: "G-XMXPS6CMV0"
};

// Initialize Firebase services
let auth, database;

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  auth = firebase.auth();
  database = firebase.database();
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  showErrorAlert("Failed to initialize Firebase services. Please refresh the page.");
}

// Constants
const FAMILY_ICONS = {
  head: ['fa-crown', 'fa-star', 'fa-medal', 'fa-user-tie', 'fa-user-astronaut'],
  wife: ['fa-heart', 'fa-user-nurse', 'fa-user-graduate', 'fa-user-secret', 'fa-user-tag'],
  husband: ['fa-user-tie', 'fa-user-astronaut', 'fa-user-ninja', 'fa-user-graduate', 'fa-user-secret'],
  son: ['fa-child', 'fa-user-graduate', 'fa-gamepad', 'fa-football-ball', 'fa-robot'],
  daughter: ['fa-child', 'fa-user-graduate', 'fa-ribbon', 'fa-heart', 'fa-fairy'],
  helper: ['fa-user-cog', 'fa-user-hard-hat', 'fa-user-md', 'fa-user-shield', 'fa-user-edit'],
  guest: ['fa-user-friends', 'fa-user-clock', 'fa-user-plus', 'fa-user-check', 'fa-user']
};

const DEFAULT_ICONS = {
  head: 'fa-crown',
  wife: 'fa-heart',
  husband: 'fa-user-tie',
  son: 'fa-child',
  daughter: 'fa-child',
  helper: 'fa-user-cog',
  guest: 'fa-user-friends'
};

// DOM Elements
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const logoutBtn = document.getElementById('logoutBtn');
const addMemberModal = new bootstrap.Modal(document.getElementById('addMemberModal'));
const saveMemberBtn = document.getElementById('saveMemberBtn');
const emergencyContactsModal = new bootstrap.Modal(document.getElementById('emergencyContactsModal'));
const saveContactsBtn = document.getElementById('saveContactsBtn');
const deviceSwitches = document.querySelectorAll('.form-check-input[type="checkbox"]');
const userAvatar = document.getElementById('userAvatar');
const userNameDisplay = document.getElementById('userNameDisplay');
const userRoleDisplay = document.getElementById('userRoleDisplay');

// State variables
let notifications = [];
let unreadNotifications = [];

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (!auth || !database) {
    console.error("Firebase services not available");
    showErrorAlert("System error. Please refresh the page.");
    return;
  }
  
  setupNavigation();
  initDashboard();
  checkAuthState();
});

function initDashboard() {
    console.log("Initializing dashboard...");
    
    // Ensure dashboard is visible
    const dashboardSection = document.getElementById('dashboard');
    if (dashboardSection) {
        dashboardSection.style.display = 'block';
    } else {
        console.error("Dashboard section not found!");
        return;
    }
    
    // Set dashboard as active in sidebar
    const dashboardMenuItem = document.querySelector('.sidebar-menu li:first-child');
    if (dashboardMenuItem) {
        dashboardMenuItem.classList.add('active');
    }
    
    // Load data if user is logged in
    const user = auth.currentUser;
    if (user) {
        console.log("User found, loading data...");
        loadDashboardData(user);
    } else {
        console.log("No user found, waiting for auth state change");
    }
    
    // Initialize other components
    setupEventListeners();
    checkAuthState();
    restoreSidebarState();
    setupIconSelection();
    // Replace theme settings with profile settings
    initProfileSettings();
    
    // Update sidebar profile on load
    updateSidebarProfile();
    setupAvatarSelection();
}function initDashboard() {
  console.log("Initializing dashboard...");
  
  const dashboardSection = document.getElementById('dashboard');
  if (!dashboardSection) {
    console.error("Dashboard section not found!");
    return;
  }
  
  dashboardSection.style.display = 'block';
  document.querySelector('.sidebar-menu li:first-child')?.classList.add('active');
  
  const user = auth.currentUser;
  if (user) {
    console.log("User found, loading data...");
    loadDashboardData(user);
  } else {
    console.log("No user found, waiting for auth state change");
  }
  
  setupEventListeners();
  restoreSidebarState();
  setupIconSelection();
  initProfileSettings();
  updateSidebarProfile();
  setupAvatarSelection();
}

function setupEventListeners() {
  // Sidebar toggle
  sidebarToggle?.addEventListener('click', toggleSidebar);

  // Logout button
  logoutBtn?.addEventListener('click', handleLogout);

  // Device switches
  deviceSwitches.forEach(switchEl => {
    switchEl.addEventListener('change', handleDeviceSwitchChange);
  });

  // Save Member Button
  saveMemberBtn?.addEventListener('click', saveFamilyMember);

  // Save Edit Button
  document.getElementById('saveEditBtn')?.addEventListener('click', saveEditedMember);
  
  // Prevent form submission
  document.querySelector('#editMemberModal form')?.addEventListener('submit', e => e.preventDefault());
  document.querySelector('#addMemberModal form')?.addEventListener('submit', e => e.preventDefault());
}

async function handleLogout(e) {
  if (e) e.preventDefault();
  
  try {
    const user = auth.currentUser;
    if (user) {
      // Remove realtime listeners
      database.ref('members/' + user.uid).off();
      database.ref('devices/' + user.uid).off();
      database.ref('activity/' + user.uid).off();
    }
  
    // Show loading state
    if (logoutBtn) {
      logoutBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging out...';
      logoutBtn.disabled = true;
    }
    
    await auth.signOut();
    localStorage.removeItem('sidebarState');
    sessionStorage.clear();
    window.location.replace('index.html?' + Date.now());
    
  } catch (error) {
    console.error("Logout failed:", error);
    showErrorAlert("Logout failed. Please try again.");
    
    if (logoutBtn) {
      logoutBtn.innerHTML = '<i class="bi bi-box-arrow-right"></i> Logout';
      logoutBtn.disabled = false;
    }
  }
}

// Navigation System (move this outside initDashboard)
function setupNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    
    // Handle sidebar navigation
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            console.log("Navigating to:", targetId);
            
            navigateToSection(targetId);
        });
    });

    // Handle View All button click
    document.getElementById('viewAllMembersBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        navigateToSection('members');
    });
    
    // Handle the "View All X Members" link in the table
    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-all-members-link')) {
            e.preventDefault();
            navigateToSection('members');
        }
    });
}

// Add this to your setupFamilyMembersSection function or create a new one
function setupFamilyMembersSection() {
    // Existing code...
    
    // Add event listener for remove all access button
    document.getElementById('removeAllAccessBtn')?.addEventListener('click', removeAllAccessExceptHead);
}

async function removeAllAccessExceptHead() {
    const user = auth.currentUser;
    if (!user) return;

    if (!confirm('Are you sure you want to remove all access controls from all members except the head? This cannot be undone.')) {
        return;
    }

    // Show loading state
    const btn = document.getElementById('removeAllAccessBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
    btn.disabled = true;

    try {
        // Get all family members
        const snapshot = await database.ref(`members/${user.uid}`).once('value');
        const members = snapshot.val();
        
        if (!members) {
            showToast('No family members found', 'info');
            return;
        }

        const updates = {};
        let count = 0;

        // Prepare updates for all non-head members
        Object.entries(members).forEach(([id, member]) => {
            if (member.role !== 'head') {
                updates[`${id}/permissions`] = null; // Set to null to remove permissions
                count++;
            }
        });

        if (count === 0) {
            showToast('No non-head members found to update', 'info');
            return;
        }

        // Apply all updates at once
        await database.ref(`members/${user.uid}`).update(updates);

        // Log the activity
        await logActivity({
            type: 'security',
            action: 'removed all access controls',
            deviceName: 'Family Management',
            userName: user.displayName || 'You',
            details: `Removed access from ${count} members`
        });

        showToast(`Successfully removed access from ${count} members`, 'success');
    } catch (error) {
        console.error("Error removing access controls:", error);
        showToast('Failed to remove access controls: ' + error.message, 'danger');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Create a separate navigation function
        function navigateToSection(sectionId) {
        // Hide all content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            
            // Special handling for dashboard
            if (sectionId === 'dashboard') {
                const user = auth.currentUser;
                if (user) {
                    console.log("Reloading dashboard data");
                    loadDashboardData(user);
                }
            }
            
            // For other sections, add specific loading logic
            if (sectionId === 'members') {
                loadFamilyMembers(auth.currentUser.uid);
                setupFamilyMembersSection(); // Ensure section is initialized
            }
            if (sectionId === 'logs') {
                loadActivityLogsTable(auth.currentUser.uid);
            }
        }
        
        // Update active menu item
        document.querySelectorAll('.sidebar-menu li').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`.sidebar-menu a[href="#${sectionId}"]`)?.parentElement.classList.add('active');
    }

        // Security Section Functions
        function setupSecuritySection() {
            // Add appliance form submission
            document.getElementById('addApplianceForm')?.addEventListener('submit', addNewAppliance);
            
            // Test alarm button
            document.getElementById('testAlarmBtn')?.addEventListener('click', testAlarm);
            
            // View cameras button
            document.getElementById('viewCamerasBtn')?.addEventListener('click', viewCameras);
            
            // Load existing appliances
            loadAppliances();
            
            // Load security logs
            loadSecurityLogs();
        }

        function addNewAppliance(e) {
            e.preventDefault();
            
            const user = auth.currentUser;
            if (!user) return;

            const name = document.getElementById('applianceName').value.trim();
            const location = document.getElementById('applianceLocation').value;
            const type = document.getElementById('applianceType').value;

            if (!name || !location || !type) {
                showAlert('Please fill in all fields', 'danger');
                return;
            }

            const applianceData = {
                name,
                location,
                type,
                status: false,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                createdBy: user.uid
            };

            // Show loading state
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding...';
            submitBtn.disabled = true;

            database.ref(`appliances/${user.uid}`).push(applianceData)
                .then(() => {
                    showToast('Appliance added successfully!', 'success');
                    e.target.reset();
                    loadAppliances();
                })
                .catch(error => {
                    console.error("Error adding appliance:", error);
                    showAlert('Error adding appliance: ' + error.message, 'danger');
                })
                .finally(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
        }

        function loadAppliances() {
            const user = auth.currentUser;
            if (!user) return;

            const tableBody = document.getElementById('appliancesTableBody');
            if (!tableBody) return;

            database.ref(`appliances/${user.uid}`).on('value', (snapshot) => {
                tableBody.innerHTML = '';
                const appliances = snapshot.val();

                if (appliances) {
                    Object.entries(appliances).forEach(([id, appliance]) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${appliance.name}</td>
                            <td>${formatLocation(appliance.location)}</td>
                            <td>${formatApplianceType(appliance.type)}</td>
                            <td>
                                <div class="form-check form-switch">
                                    <input class="form-check-input appliance-switch" type="checkbox" 
                                        data-id="${id}" ${appliance.status ? 'checked' : ''}>
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-outline-danger delete-appliance" data-id="${id}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        `;
                        tableBody.appendChild(row);
                    });

                    // Add event listeners for switches
                    document.querySelectorAll('.appliance-switch').forEach(switchEl => {
                        switchEl.addEventListener('change', function() {
                            updateApplianceStatus(this.dataset.id, this.checked);
                        });
                    });

                    // Add event listeners for delete buttons
                    document.querySelectorAll('.delete-appliance').forEach(btn => {
                        btn.addEventListener('click', function() {
                            deleteAppliance(this.dataset.id);
                        });
                    });
                } else {
                    tableBody.innerHTML = `
                        <tr>
                            <td colspan="5" class="text-center py-4 text-muted">
                                No appliances added yet
                            </td>
                        </tr>
                    `;
                }
            });
        }

        function updateApplianceStatus(applianceId, status) {
            const user = auth.currentUser;
            if (!user) return;

            database.ref(`appliances/${user.uid}/${applianceId}/status`).set(status)
                .then(() => {
                    logActivity({
                        type: 'appliance',
                        action: status ? 'turned on' : 'turned off',
                        deviceName: 'Appliance Control',
                        userName: user.displayName || 'You',
                        details: `Appliance ID: ${applianceId}`
                    });
                })
                .catch(error => {
                    console.error("Error updating appliance status:", error);
                    showToast('Failed to update appliance status', 'danger');
                });
        }

        function deleteAppliance(applianceId) {
            const user = auth.currentUser;
            if (!user) return;

            if (!confirm('Are you sure you want to delete this appliance?')) {
                return;
            }

            database.ref(`appliances/${user.uid}/${applianceId}`).remove()
                .then(() => {
                    showToast('Appliance deleted successfully', 'success');
                })
                .catch(error => {
                    console.error("Error deleting appliance:", error);
                    showToast('Failed to delete appliance', 'danger');
                });
        }

        function testAlarm() {
            const user = auth.currentUser;
            if (!user) return;

            // Show loading state
            const btn = document.getElementById('testAlarmBtn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Testing...';
            btn.disabled = true;

            // Simulate alarm test (in a real app, this would trigger actual alarm)
            setTimeout(() => {
                showToast('Alarm test completed successfully', 'success');
                logActivity({
                    type: 'security',
                    action: 'tested alarm system',
                    deviceName: 'Security System',
                    userName: user.displayName || 'You'
                });
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 2000);
        }

        function viewCameras() {
            // In a real app, this would open camera feeds
            showToast('Opening camera feeds...', 'info');
        }

        function loadSecurityLogs() {
            const user = auth.currentUser;
            if (!user) return;

            const tableBody = document.getElementById('securityLogsTable');
            if (!tableBody) return;

            database.ref(`securityLogs/${user.uid}`).limitToLast(10).on('value', (snapshot) => {
                tableBody.innerHTML = '';
                const logs = snapshot.val();

                if (logs) {
                    Object.entries(logs).forEach(([id, log]) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${log.event || 'Security Event'}</td>
                            <td>${formatTimestamp(log.timestamp)}</td>
                            <td>${log.location || 'N/A'}</td>
                            <td>${log.details || 'No details available'}</td>
                        `;
                        tableBody.appendChild(row);
                    });
                } else {
                    tableBody.innerHTML = `
                        <tr>
                            <td colspan="4" class="text-center py-4 text-muted">
                                No security logs yet
                            </td>
                        </tr>
                    `;
                }
            });
        }

        // Helper functions
        function formatLocation(location) {
            const locations = {
                'living-room': 'Living Room',
                'bedroom': 'Bedroom',
                'kitchen': 'Kitchen',
                'bathroom': 'Bathroom',
                'garage': 'Garage',
                'garden': 'Garden'
            };
            return locations[location] || location;
        }

        function formatApplianceType(type) {
            const types = {
                'light': 'Light',
                'fan': 'Fan',
                'tv': 'TV',
                'ac': 'Air Conditioner',
                'other': 'Other'
            };
            return types[type] || type;
        }



  // Settings save buttons
  document.getElementById('saveThemeBtn')?.addEventListener('click', saveThemeSettings);
  document.getElementById('saveNotificationBtn')?.addEventListener('click', saveNotificationSettings);

// Load current settings from Firebase
function loadSettings() {
  const user = auth.currentUser;
  if (!user) return;
  
  database.ref('settings/' + user.uid).once('value').then(snapshot => {
    const settings = snapshot.val();
    if (settings) {
      // Theme settings
      if (settings.theme) {
        document.getElementById('themeSelect').value = settings.theme;
      }
      
      // Notification settings
      if (settings.notifications) {
        document.getElementById('emailNotifications').checked = settings.notifications.email || false;
        document.getElementById('pushNotifications').checked = settings.notifications.push || false;
        document.getElementById('soundAlerts').checked = settings.notifications.sound || false;
      }
    }
  }).catch(error => {
    console.error("Error loading settings:", error);
  });
}


// Save notification settings
function saveNotificationSettings() {
  const user = auth.currentUser;
  if (!user) return;
  
  const notifications = {
    email: document.getElementById('emailNotifications').checked,
    push: document.getElementById('pushNotifications').checked,
    sound: document.getElementById('soundAlerts').checked
  };
  
  database.ref('settings/' + user.uid + '/notifications').set(notifications)
    .then(() => {
      showToast('Notification settings saved successfully!', 'success');
    })
    .catch(error => {
      console.error("Error saving notifications:", error);
      showToast('Failed to save notification settings', 'danger');
    });
}

    // Activity Logs Functions
    function setupActivityLogsSection() {
        // Load activity logs when section is shown
        document.querySelector('.sidebar-menu a[href="#logs"]')?.addEventListener('click', () => {
            loadActivityLogsTable(auth.currentUser?.uid); // Changed from loadActivityLogs
        });
        
        // Clear all logs button
        document.getElementById('clearAllLogsBtn')?.addEventListener('click', clearAllActivityLogs);
    }
    // Rename the function
    function loadActivityLogsTable(userId) {
        if (!userId) return;
        
        const tableBody = document.getElementById('activityLogsTableBody');
        if (!tableBody) return;

        // Clear existing listeners to prevent duplicates
        database.ref(`activity/${userId}`).off();
        
        // Set up new listener
        database.ref(`activity/${userId}`).orderByChild('timestamp').on('value', (snapshot) => {
            tableBody.innerHTML = '';
            const activities = snapshot.val();

            if (activities) {
                // Convert to array and sort by timestamp (newest first)
                const activitiesArray = Object.entries(activities).map(([id, activity]) => ({
                    id,
                    ...activity
                })).sort((a, b) => b.timestamp - a.timestamp);

                activitiesArray.forEach(activity => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>
                            <div class="d-flex align-items-center">
                                <div class="activity-icon-sm ${getActivityIconClass(activity.type)} me-2">
                                    <i class="bi ${getActivityIcon(activity.type)}"></i>
                                </div>
                                <span>${activity.action || 'Activity'}</span>
                            </div>
                            ${activity.details ? `<small class="text-muted d-block mt-1">${activity.details}</small>` : ''}
                        </td>
                        <td>${activity.deviceName || 'System'}</td>
                        <td>${activity.userName || 'You'}</td>
                        <td>${formatTimestamp(activity.timestamp)}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-danger delete-activity" data-id="${activity.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });

                // Add event listeners for delete buttons
                document.querySelectorAll('.delete-activity').forEach(btn => {
                    btn.addEventListener('click', function() {
                        deleteActivityLog(this.dataset.id);
                    });
                });
            } else {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center py-4 text-muted">
                            No activity logs found
                        </td>
                    </tr>
                `;
            }
        });
    }

    function deleteActivityLog(activityId) {
        const user = auth.currentUser;
        if (!user) return;

        if (!confirm('Are you sure you want to delete this activity log?')) {
            return;
        }

        database.ref(`activity/${user.uid}/${activityId}`).remove()
            .then(() => {
                showToast('Activity log deleted successfully', 'success');
            })
            .catch(error => {
                console.error("Error deleting activity log:", error);
                showToast('Failed to delete activity log', 'danger');
            });
    }

    function clearAllActivityLogs() {
        const user = auth.currentUser;
        if (!user) return;

        if (!confirm('Are you sure you want to delete ALL activity logs? This cannot be undone.')) {
            return;
        }

        // Show loading state
        const btn = document.getElementById('clearAllLogsBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Deleting...';
        btn.disabled = true;

        database.ref(`activity/${user.uid}`).remove()
            .then(() => {
                showToast('All activity logs deleted successfully', 'success');
                // Also clear notifications
                clearAllNotifications();
            })
            .catch(error => {
                console.error("Error deleting activity logs:", error);
                showToast('Failed to delete activity logs', 'danger');
            })
            .finally(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
    }

    function clearAllNotifications() {
        const user = auth.currentUser;
        if (!user) return;

        // Update all notifications as read
        database.ref(`activity/${user.uid}`).once('value').then(snapshot => {
            const updates = {};
            snapshot.forEach(child => {
                updates[`${child.key}/read`] = true;
                updates[`${child.key}/readAt`] = firebase.database.ServerValue.TIMESTAMP;
            });
            
            return database.ref(`activity/${user.uid}`).update(updates);
        }).then(() => {
            // Update UI
            unreadNotifications = [];
            updateNotificationBadge();
            renderNotifications();
        }).catch(error => {
            console.error("Error clearing notifications:", error);
        });
    }

    // Add this to your existing getActivityIconClass function
    function getActivityIconClass(type) {
        switch(type) {
            case 'alert': 
            case 'motion': return 'bg-danger text-white';
            case 'warning': return 'bg-warning text-dark';
            case 'info': return 'bg-info text-white';
            case 'success': 
            case 'door': return 'bg-success text-white';
            case 'member': return 'bg-primary text-white';
            case 'settings': return 'bg-secondary text-white';
            case 'appliance': return 'bg-light text-dark';
            default: return 'bg-light text-dark';
        }
    }

// Show toast notification
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toastContainer');
  const toastId = 'toast-' + Date.now();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.id = toastId;
  toast.innerHTML = `
    <div class="toast-header">
      <i class="bi ${type === 'success' ? 'bi-check-circle' : type === 'danger' ? 'bi-exclamation-circle' : 'bi-info-circle'} me-2"></i>
      <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
      <button type="button" class="toast-close" onclick="document.getElementById('${toastId}').remove()">
        <i class="bi bi-x"></i>
      </button>
    </div>
    <div class="toast-body">
      ${message}
    </div>
  `;
  
  toastContainer.appendChild(toast);
  
  // Show the toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 5000);
}

function checkAuthState() {
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            window.location.href = 'index.html';
            return;
        }
        
        try {
            await user.reload();
            
            // Check if email was recently changed and needs verification
            if (user.emailVerified === false) {
                showToast('Please verify your email address', 'warning');
                await auth.signOut();
                window.location.href = 'index.html';
                return;
            }
            
            loadDashboardData(user);
        } catch (error) {
            console.error("Auth state error:", error);
            window.location.href = 'index.html';
        }
    });
}

// Handle device switch changes
function toggleSidebar() {
  sidebar.classList.toggle('show');
  localStorage.setItem('sidebarState', sidebar.classList.contains('show') ? 'open' : 'closed');
}

function restoreSidebarState() {
  const savedState = localStorage.getItem('sidebarState');
  if (savedState === 'open') sidebar.classList.add('show');
}

async function handleDeviceSwitchChange() {
  const deviceId = this.id.replace('Switch', '');
  const isOn = this.checked;
  
  const user = auth.currentUser;
  if (!user) return;

  this.disabled = true;
  const originalState = this.checked;
  
  try {
    await database.ref('devices/' + user.uid + '/' + deviceId).set({
      status: isOn,
      lastChanged: firebase.database.ServerValue.TIMESTAMP,
      changedBy: user.uid
    });
    
    await logActivity({
      type: deviceId,
      action: isOn ? 'turned on' : 'turned off',
      deviceName: formatDeviceName(deviceId),
      userName: user.displayName || 'You'
    });
  } catch (error) {
    console.error("Device update error:", error);
    this.checked = !originalState;
  } finally {
    this.disabled = false;
  }
}

function setupIconSelection() {
    const roleSelect = document.getElementById('memberRole');
    const iconOptions = document.getElementById('iconOptions');
    
    if (!roleSelect || !iconOptions) return;
    
    roleSelect.addEventListener('change', function() {
        const role = this.value;
        populateIconOptions(role);
    });
    
    // Initialize with default role
    populateIconOptions(roleSelect.value);
}

function populateIconOptions(role) {
    const iconOptions = document.getElementById('iconOptions');
    if (!iconOptions) return;
    
    iconOptions.innerHTML = '';
    
    const icons = FAMILY_ICONS[role] || FAMILY_ICONS['guest'];
    const defaultIcon = DEFAULT_ICONS[role] || 'fa-user';
    
    icons.forEach(icon => {
        const iconEl = document.createElement('div');
        iconEl.className = `icon-option ${icon === defaultIcon ? 'selected' : ''}`;
        iconEl.innerHTML = `<i class="fas ${icon}"></i>`;
        iconEl.dataset.icon = icon;
        
        iconEl.addEventListener('click', function() {
            document.querySelectorAll('.icon-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
        });
        
        iconOptions.appendChild(iconEl);
    });
}

async function saveFamilyMember() {
    // Get form values
    const name = document.getElementById('memberName').value.trim();
    const email = document.getElementById('memberEmail').value.trim();
    const role = document.getElementById('memberRole').value;
    
    // Validate required fields
    if (!name || !email || !role) {
        showAlert('Please fill in all required fields', 'danger');
        return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showAlert('Please enter a valid email address', 'danger');
        return;
    }

    // Get selected permissions
    const permissions = [];
    if (document.getElementById('accessLights').checked) permissions.push('lights');
    if (document.getElementById('accessDoors').checked) permissions.push('doors');
    if (document.getElementById('accessAC').checked) permissions.push('ac');
    if (document.getElementById('accessTV').checked) permissions.push('tv');
    if (document.getElementById('accessSecurity').checked) permissions.push('security');

    const user = auth.currentUser;
    if (!user) {
        showAlert('You must be logged in to add members', 'danger');
        return;
    }

    // Show loading state
    const originalText = saveMemberBtn.innerHTML;
    saveMemberBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
    saveMemberBtn.disabled = true;

    try {
        // Get selected icon
        const selectedIcon = document.querySelector('.icon-option.selected')?.dataset.icon || 
                           DEFAULT_ICONS[role] || 'fa-user';

        // Create member data object
        const memberData = {
            name: name,
            email: email,
            role: role,
            icon: selectedIcon,
            permissions: permissions.join(','),
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            lastActive: firebase.database.ServerValue.TIMESTAMP
        };

        // Generate a new unique ID for the member
        const newMemberRef = database.ref(`members/${user.uid}`).push();
        const memberId = newMemberRef.key;

        // Save to database
        await newMemberRef.set(memberData);

        // Log the activity
        await logActivity({
            type: 'member',
            action: 'added new family member',
            deviceName: 'Family Management',
            userName: user.displayName || 'You',
            details: `${name} (${role})`
        });

        // Show success and reset form
        showToast('Member added successfully!', 'success');
        addMemberModal.hide();
        document.querySelector('#addMemberModal form').reset();

        // Refresh members list
        loadFamilyMembers(user.uid);

    } catch (error) {
        console.error("Error adding member:", error);
        showAlert('Error adding member: ' + error.message, 'danger');
    } finally {
        // Restore button state
        saveMemberBtn.innerHTML = originalText;
        saveMemberBtn.disabled = false;
    }
}

// Helper function to show alerts
function showAlert(message, type) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.role = 'alert';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  const container = document.querySelector('.main-content') || document.body;
  container.prepend(alertDiv);
  
  setTimeout(() => {
    const bsAlert = new bootstrap.Alert(alertDiv);
    bsAlert.close();
  }, 5000);
}


// Save emergency contacts
async function saveEmergencyContacts() {
    const user = auth.currentUser;
    if (!user) return;

    const policeNumber = document.getElementById('policeNumber').value.trim();
    const fireNumber = document.getElementById('fireNumber').value.trim();
    const hospitalNumber = document.getElementById('hospitalNumber').value.trim();
    
    if (!policeNumber || !fireNumber || !hospitalNumber) {
        showToast('Please fill in all emergency contact numbers', 'warning');
        return;
    }

    const btn = document.getElementById('saveContactsBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
    btn.disabled = true;

    try {
        // Get current contacts for comparison
        const currentContacts = await database.ref('emergencyContacts/' + user.uid).once('value');
        
        const contactsData = {
            police: policeNumber,
            fire: fireNumber,
            hospital: hospitalNumber,
            updatedAt: firebase.database.ServerValue.TIMESTAMP
        };

        await database.ref('emergencyContacts/' + user.uid).set(contactsData);

        // Log the activity only if contacts changed
        if (!currentContacts.exists() || 
            currentContacts.val().police !== policeNumber || 
            currentContacts.val().fire !== fireNumber || 
            currentContacts.val().hospital !== hospitalNumber) {
            
            await logActivity({
                type: 'settings',
                action: 'updated emergency contacts',
                deviceName: 'Emergency Settings',
                userName: user.displayName || 'You',
                details: `Police: ${policeNumber}, Fire: ${fireNumber}, Hospital: ${hospitalNumber}`,
                important: true
            });
        }

        showToast('Emergency contacts saved successfully!', 'success');
        
        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('emergencyContactsModal'));
        modal.hide();
    } catch (error) {
        console.error("Error saving emergency contacts:", error);
        showToast('Failed to save emergency contacts: ' + error.message, 'danger');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}


// Log activity
async function logActivity(activityData) {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const completeData = {
            ...activityData,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            read: false
        };

        await database.ref('activity/' + user.uid).push(completeData);
        console.log("Activity logged successfully:", completeData);
    } catch (error) {
        console.error("Error logging activity:", error);
    }
}

// Profile Settings Functions
function initProfileSettings() {
    const user = auth.currentUser;
    if (!user) return;

    // Show loading state
    document.getElementById('headName').placeholder = 'Loading...';
    document.getElementById('headEmail').placeholder = 'Loading...';

    // Load user data from database
    database.ref('users/' + user.uid).once('value').then(snapshot => {
        const userData = snapshot.val();
        
        // Set form values
        document.getElementById('headName').value = userData?.name || '';
        
        // Only set email if it exists in Auth
        if (user.email) {
            document.getElementById('headEmail').value = user.email;
            document.getElementById('headEmail').placeholder = 'Leave unchanged to keep current email';
        } else {
            document.getElementById('headEmail').placeholder = 'No email set';
        }
        
    }).catch(error => {
        console.error("Error loading profile:", error);
        showToast('Failed to load profile', 'danger');
    });

    // Setup form submission
    document.getElementById('profileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfile();
    });
}

// Initialize settings section
function initSettingsSection() {
    // Load current profile data
    loadProfileData();
    
    // Setup avatar selection
    setupAvatarSelection();
    
    // Setup emergency contacts button
    document.querySelector('[data-bs-target="#emergencyContactsModal"]')?.addEventListener('click', loadEmergencyContacts);
    
    // Setup form submission for profile
    document.getElementById('profileForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfile();
    });
    
    // Setup save avatar button
    document.getElementById('saveAvatarBtn')?.addEventListener('click', saveAvatar);
}

// Load profile data
function loadProfileData() {
    const user = auth.currentUser;
    if (!user) return;

    // Show loading state
    document.getElementById('headName').placeholder = 'Loading...';
    document.getElementById('headEmail').placeholder = 'Loading...';

    // Load user data from database
    database.ref('users/' + user.uid).once('value').then(snapshot => {
        const userData = snapshot.val();
        
        // Set form values
        document.getElementById('headName').value = userData?.name || '';
        
        // Only set email if it exists in Auth
        if (user.email) {
            document.getElementById('headEmail').value = user.email;
            document.getElementById('headEmail').placeholder = 'Leave unchanged to keep current email';
        } else {
            document.getElementById('headEmail').placeholder = 'No email set';
        }
        
        // Select current avatar if exists
        if (userData?.avatar) {
            document.querySelectorAll('.avatar-option').forEach(option => {
                option.classList.remove('selected');
                if (option.dataset.avatar === userData.avatar) {
                    option.classList.add('selected');
                }
            });
        }
    }).catch(error => {
        console.error("Error loading profile:", error);
        showToast('Failed to load profile data', 'danger');
    });
}

// Setup avatar selection
function setupAvatarSelection() {
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            document.querySelectorAll('.avatar-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            // Add selected class to clicked option
            this.classList.add('selected');
        });
    });
}


// Save profile information
async function saveProfile() {
    const user = auth.currentUser;
    if (!user) return;

    const btn = document.getElementById('saveProfileBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
    btn.disabled = true;

    const newName = document.getElementById('headName').value.trim();
    const newEmail = document.getElementById('headEmail').value.trim();
    const currentEmail = user.email;
    const currentName = user.displayName || '';

    try {
        // Validate name is not empty
        if (!newName) {
            throw new Error('Name is required');
        }

        // Prepare updates
        const updates = {
            name: newName,
            updatedAt: firebase.database.ServerValue.TIMESTAMP
        };

        // Log name change activity if name changed
        if (newName !== currentName) {
            await logActivity({
                type: 'profile',
                action: 'updated profile name',
                deviceName: 'Profile Settings',
                userName: currentName || 'You',
                details: `From "${currentName}" to "${newName}"`,
                important: true
            });
        }

        // Handle email change
        if (newEmail && newEmail !== currentEmail) {
            // Show confirmation dialog using SweetAlert
            const confirmChange = await Swal.fire({
                title: 'Email Change Verification',
                html: `Changing email requires verification. You will be logged out. Continue?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Continue',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33'
            });

            if (!confirmChange.isConfirmed) {
                throw new Error('Email change cancelled');
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
                throw new Error('Please enter a valid email address');
            }

            // Get password using SweetAlert
            const { value: password } = await Swal.fire({
                title: 'Confirm Password',
                input: 'password',
                inputLabel: 'Please enter your password to confirm:',
                inputPlaceholder: 'Enter your password',
                inputAttributes: {
                    autocapitalize: 'off',
                    autocorrect: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel'
            });

            if (!password) {
                throw new Error('Password required');
            }

            // Reauthenticate user
            const credential = firebase.auth.EmailAuthProvider.credential(currentEmail, password);
            await user.reauthenticateWithCredential(credential);

            // Verify new email before updating
            await user.verifyBeforeUpdateEmail(newEmail);
            
            updates.email = newEmail;
            updates.emailVerified = false;
            
            // Show success message
            await Swal.fire({
                title: 'Verification Email Sent',
                text: 'Please check your new email address for a verification link. You will be logged out.',
                icon: 'success'
            });

            // Log email change activity
            await logActivity({
                type: 'security',
                action: 'changed email address',
                deviceName: 'Profile Settings',
                userName: newName || 'You',
                details: `From ${currentEmail} to ${newEmail}`,
                important: true
            });

            // Logout after delay
            setTimeout(() => {
                handleLogout();
            }, 3000);
        }

        // Update database
        await database.ref('users/' + user.uid).update(updates);
        
        // Update UI
        updateSidebarProfile();
        
        // Show success message if not changing email
        if (!newEmail || newEmail === currentEmail) {
            await Swal.fire({
                title: 'Success!',
                text: 'Profile updated successfully',
                icon: 'success'
            });
        }
        
    } catch (error) {
        console.error("Error saving profile:", error);
        
        // Show appropriate error message
        let errorMessage = error.message;
        if (error.code === 'auth/operation-not-allowed') {
            errorMessage = 'Please verify your current email before changing to a new one.';
        }
        
        await Swal.fire({
            title: 'Error',
            text: errorMessage,
            icon: 'error'
        });
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Save avatar selection
async function saveAvatar() {
    const user = auth.currentUser;
    if (!user) {
        showToast('You must be logged in to change avatar', 'warning');
        return;
    }

    const selectedAvatar = document.querySelector('.avatar-option.selected')?.dataset.avatar;
    if (!selectedAvatar) {
        showToast('Please select an avatar first', 'warning');
        return;
    }

    const btn = document.getElementById('saveAvatarBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
    btn.disabled = true;

    try {
        // Get current avatar for comparison
        const userRef = database.ref('users/' + user.uid);
        const snapshot = await userRef.once('value');
        const currentAvatar = snapshot.val()?.avatar;

        // Only update if avatar changed
        if (currentAvatar !== selectedAvatar) {
            // Update in database
            await userRef.update({
                avatar: selectedAvatar,
                updatedAt: firebase.database.ServerValue.TIMESTAMP
            });

            // Log the activity
            await logActivity({
                type: 'profile',
                action: 'changed avatar',
                deviceName: 'Profile Settings',
                userName: user.displayName || 'You',
                details: `Changed to avatar: ${selectedAvatar}`,
                important: true
            });

            // Update UI immediately
            updateAvatarInUI(selectedAvatar);
            updateSidebarProfile();

            showToast('Avatar updated successfully!', 'success');
        } else {
            showToast('This avatar is already selected', 'info');
        }
    } catch (error) {
        console.error("Error updating avatar:", error);
        showToast('Failed to update avatar: ' + error.message, 'danger');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Update avatar in UI elements
function updateAvatarInUI(avatarKey) {
    const avatarMap = {
        'avatar1': 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        'avatar2': 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',
        'avatar3': 'https://cdn-icons-png.flaticon.com/512/4333/4333609.png',
        'avatar4': 'https://cdn-icons-png.flaticon.com/512/921/921071.png',
        'avatar5': 'https://cdn-icons-png.flaticon.com/512/4202/4202839.png',
        'avatar6': 'https://cdn-icons-png.flaticon.com/512/706/706830.png'
    };

    // Update the sidebar avatar
    const sidebarAvatar = document.querySelector('.sidebar-footer .avatar');
    if (sidebarAvatar) {
        sidebarAvatar.src = avatarMap[avatarKey] || avatarMap['avatar1'];
    }

    // Update any other avatars with id 'userAvatar'
    const userAvatars = document.querySelectorAll('#userAvatar');
    userAvatars.forEach(avatar => {
        avatar.src = avatarMap[avatarKey] || avatarMap['avatar1'];
    });
}

// Update sidebar profile (unchanged from your original)
function updateSidebarProfile() {
    const user = auth.currentUser;
    if (!user) return;

    database.ref('users/' + user.uid).once('value').then(snapshot => {
        const userData = snapshot.val();
        
        // Update name in sidebar
        const nameElement = document.getElementById('userNameDisplay');
        if (nameElement) nameElement.textContent = userData?.name || 'User';
        
        // Update role in sidebar
        const roleElement = document.getElementById('userRoleDisplay');
        if (roleElement) roleElement.textContent = userData?.role ? formatRole(userData.role) : 'Member';
        
        // Update avatar in sidebar
        updateAvatarInUI(userData?.avatar || 'avatar1');
        
    }).catch(error => {
        console.error("Error loading user profile:", error);
        // Fallback to default avatar if there's an error
        updateAvatarInUI('avatar1');
    });
}


// Load user profile
function loadUserProfile(userId) {
  database.ref('users/' + userId).once('value').then(snapshot => {
    const userData = snapshot.val();
    if (userData) {
      if (userNameDisplay) userNameDisplay.textContent = userData.name || 'User';
      if (userRoleDisplay) userRoleDisplay.textContent = userData.role ? formatRole(userData.role) : 'Member';
      if (userAvatar && userData.photoURL) userAvatar.src = userData.photoURL;
    }
  }).catch(error => {
    console.error("Error loading user profile:", error);
  });
}


// Load family members (updated to handle real-time updates)
function loadFamilyMembers(userId) {
    const dashboardMembersTable = document.getElementById('dashboardFamilyMembersTableBody');
    const fullMembersTable = document.getElementById('fullFamilyMembersTableBody');
    
    if (!dashboardMembersTable || !fullMembersTable) return;

    database.ref(`members/${userId}`).on('value', (snapshot) => {
        const members = snapshot.val();
        
        dashboardMembersTable.innerHTML = '';
        fullMembersTable.innerHTML = '';

        if (members) {
            const membersArray = Object.entries(members).map(([id, member]) => ({
                id,
                ...member
            })).sort((a, b) => b.createdAt - a.createdAt);

            updateMembersCount(membersArray.length);

            // Add only first 3 members to dashboard table
            const dashboardMembers = membersArray.slice(0, 3);
            dashboardMembers.forEach(member => {
                const row = createMemberRow(member);
                dashboardMembersTable.appendChild(row);
            });

            // Add all members to full table
            membersArray.forEach(member => {
                const row = createMemberRow(member);
                fullMembersTable.appendChild(row);
            });

            // Show "View All" button if there are more than 3 members
            if (membersArray.length > 3) {
                const viewAllRow = document.createElement('tr');
                viewAllRow.innerHTML = `
                    <td colspan="6" class="text-center">
                        <a href="#members" class="btn btn-sm btn-outline-primary view-all-members-link">
                            <i class="bi bi-arrow-right"></i> View All ${membersArray.length} Members
                        </a>
                    </td>
                `;
                dashboardMembersTable.appendChild(viewAllRow);
            }
        } else {
            // Show empty state for dashboard
            dashboardMembersTable.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4">
                        <i class="bi bi-people text-muted" style="font-size: 2rem;"></i>
                        <p class="mt-2">No family members added yet</p>
                        <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addMemberModal">
                            <i class="bi bi-plus"></i> Add First Member
                        </button>
                    </td>
                </tr>
            `;

            // Show empty state for full table
            fullMembersTable.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4">
                        <i class="bi bi-people text-muted" style="font-size: 2rem;"></i>
                        <p class="mt-2">No family members added yet</p>
                        <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addMemberModal">
                            <i class="bi bi-plus"></i> Add First Member
                        </button>
                    </td>
                </tr>
            `;
            
            updateMembersCount(0);
        }
    }, (error) => {
        console.error("Error loading members:", error);
        showAlert('Error loading family members', 'danger');
    });
}function loadFamilyMembers(userId) {
  const dashboardMembersTable = document.getElementById('dashboardFamilyMembersTableBody');
  const fullMembersTable = document.getElementById('fullFamilyMembersTableBody');
  
  if (!dashboardMembersTable || !fullMembersTable) return;

  database.ref(`members/${userId}`).on('value', (snapshot) => {
    const members = snapshot.val();
    
    dashboardMembersTable.innerHTML = '';
    fullMembersTable.innerHTML = '';

    if (members) {
      const membersArray = Object.entries(members).map(([id, member]) => ({
        id,
        ...member
      })).sort((a, b) => b.createdAt - a.createdAt);

      updateMembersCount(membersArray.length);

      // Add only first 3 members to dashboard table
      const dashboardMembers = membersArray.slice(0, 3);
      dashboardMembers.forEach(member => {
        const row = createMemberRow(member);
        dashboardMembersTable.appendChild(row);
      });

      // Add all members to full table
      membersArray.forEach(member => {
        const row = createMemberRow(member);
        fullMembersTable.appendChild(row);
      });

      // Show "View All" button if there are more than 3 members
      if (membersArray.length > 3) {
        const viewAllRow = document.createElement('tr');
        viewAllRow.innerHTML = `
          <td colspan="6" class="text-center">
            <a href="#members" class="btn btn-sm btn-outline-primary view-all-members-link">
              <i class="bi bi-arrow-right"></i> View All ${membersArray.length} Members
            </a>
          </td>
        `;
        dashboardMembersTable.appendChild(viewAllRow);
      }
    } else {
      // Show empty state for dashboard
      dashboardMembersTable.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4">
            <i class="bi bi-people text-muted" style="font-size: 2rem;"></i>
            <p class="mt-2">No family members added yet</p>
            <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addMemberModal">
              <i class="bi bi-plus"></i> Add First Member
            </button>
          </td>
        </tr>
      `;

      // Show empty state for full table
      fullMembersTable.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4">
            <i class="bi bi-people text-muted" style="font-size: 2rem;"></i>
            <p class="mt-2">No family members added yet</p>
            <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addMemberModal">
              <i class="bi bi-plus"></i> Add First Member
            </button>
          </td>
        </tr>
      `;
      
      updateMembersCount(0);
    }
  }, (error) => {
    console.error("Error loading members:", error);
    showAlert('Error loading family members', 'danger');
  });
}


function updateExistingMembersWithIcons() {
  const user = auth.currentUser;
  if (!user) return;
  
  database.ref('members/' + user.uid).once('value').then(snapshot => {
    const updates = {};
    snapshot.forEach(childSnapshot => {
      const member = childSnapshot.val();
      if (!member.icon) {
        updates[childSnapshot.key + '/icon'] = DEFAULT_ICONS[member.role] || 'fa-user';
      }
    });
    
    if (Object.keys(updates).length > 0) {
      return database.ref('members/' + user.uid).update(updates);
    }
  }).then(() => {
    console.log('Successfully updated members with icons');
  }).catch(error => {
    console.error('Error updating members:', error);
  });
}

// Helper to update members count display
function updateMembersCount(count) {
    const countElement = document.getElementById('familyMembersCount');
    if (countElement) {
        countElement.textContent = `${count} ${count === 1 ? 'member' : 'members'}`;
    }
}

// Create member table row (updated)
function createMemberRow(member) {
  const row = document.createElement('tr');
  
  // Get icon class (default if not specified)
  const iconClass = member.icon || DEFAULT_ICONS[member.role] || 'fa-user';
  
  // Role badge with proper styling
  const roleBadge = document.createElement('span');
  roleBadge.className = `badge ${getRoleBadgeClass(member.role)}`;
  roleBadge.textContent = formatRole(member.role);

  // Handle permissions
  let accessBadges = '';
  if (member.permissions) {
    const permissionsArray = member.permissions.split(',');
    if (permissionsArray.includes('lights') && 
        permissionsArray.includes('doors') && 
        permissionsArray.includes('ac') && 
        permissionsArray.includes('tv') && 
        permissionsArray.includes('security')) {
      accessBadges = '<span class="badge bg-success">Full Access</span>';
    } else {
      accessBadges = permissionsArray.map(p => 
        `<span class="badge bg-light text-dark me-1">${formatPermission(p)}</span>`
      ).join('');
    }
  }
  
  row.innerHTML = `
    <td>
      <div class="member-info">
        <div class="member-icon">
          <i class="fas ${iconClass}"></i>
        </div>
        <span>${member.name}</span>
      </div>
    </td>
    <td></td>
    <td>${member.email || 'N/A'}</td>
    <td>${accessBadges}</td>
    <td>${formatTimestamp(member.lastActive || member.createdAt)}</td>
    <td>
      <button class="btn btn-sm btn-outline-secondary edit-member" title="Edit Member" data-id="${member.id}">
        <i class="bi bi-pencil"></i>
      </button>
      <button class="btn btn-sm btn-outline-danger delete-member ms-1" title="Remove Member" data-id="${member.id}" data-name="${member.name}">
        <i class="bi bi-trash"></i>
      </button>
    </td>
  `;
  
  // Insert role badge
  row.children[1].appendChild(roleBadge);
  
  // Add event listeners
  row.querySelector('.edit-member').addEventListener('click', () => editFamilyMember(member.id, member));
  row.querySelector('.delete-member').addEventListener('click', () => deleteFamilyMember(member.id, member.name));
  
  return row;
}

// Edit member function
async function editFamilyMember(memberId, currentData) {
  try {
    const editModal = new bootstrap.Modal(document.getElementById('editMemberModal'));
    populateIconOptions(currentData.role);
    
    // Select the current icon
    setTimeout(() => {
      const currentIcon = currentData.icon || DEFAULT_ICONS[currentData.role];
      if (currentIcon) {
        document.querySelectorAll('.icon-option').forEach(opt => {
          if (opt.dataset.icon === currentIcon) {
            opt.classList.add('selected');
          }
        });
      }
    }, 100);
    
    // Populate the form with current data
    document.getElementById('editMemberName').value = currentData.name;
    document.getElementById('editMemberEmail').value = currentData.email;
    document.getElementById('editMemberRole').value = currentData.role;
    
    // Convert permissions string to array and check boxes
    const permissions = currentData.permissions ? currentData.permissions.split(',') : [];
    document.getElementById('editAccessLights').checked = permissions.includes('lights');
    document.getElementById('editAccessDoors').checked = permissions.includes('doors');
    document.getElementById('editAccessAC').checked = permissions.includes('ac');
    document.getElementById('editAccessTV').checked = permissions.includes('tv');
    document.getElementById('editAccessSecurity').checked = permissions.includes('security');

    // Store memberId in the modal for later use
    document.getElementById('editMemberModal').dataset.memberId = memberId;
    
    // Show the modal
    editModal.show();

  } catch (error) {
    console.error("Error preparing edit:", error);
    showAlert('Error preparing to edit member', 'danger');
  }
}


// Save edited member
async function saveEditedMember() {
  const saveEditBtn = document.getElementById('saveEditBtn');
  const originalText = saveEditBtn.innerHTML;
  saveEditBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
  saveEditBtn.disabled = true;

  try {
    const user = auth.currentUser;
    if (!user) return;

    const memberId = document.getElementById('editMemberModal').dataset.memberId;
    const name = document.getElementById('editMemberName').value.trim();
    const email = document.getElementById('editMemberEmail').value.trim();
    const role = document.getElementById('editMemberRole').value;
    const selectedIcon = document.querySelector('.icon-option.selected')?.dataset.icon || 
                    DEFAULT_ICONS[role] || 'fa-user';

    // Validate inputs
    if (!name || !email || !role) {
      showAlert('Please fill in all required fields', 'danger');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showAlert('Please enter a valid email address', 'danger');
      return;
    }

    // Get selected permissions
    const permissions = [];
    if (document.getElementById('editAccessLights').checked) permissions.push('lights');
    if (document.getElementById('editAccessDoors').checked) permissions.push('doors');
    if (document.getElementById('editAccessAC').checked) permissions.push('ac');
    if (document.getElementById('editAccessTV').checked) permissions.push('tv');
    if (document.getElementById('editAccessSecurity').checked) permissions.push('security');

    // Update member data
    await database.ref(`members/${user.uid}/${memberId}`).update({
      name: name,
      email: email,
      role: role,
      icon: selectedIcon,
      permissions: permissions.join(','),
      lastActive: firebase.database.ServerValue.TIMESTAMP
    });

    // Log activity
    await logActivity({
      type: 'member',
      action: 'updated family member',
      deviceName: 'Family Management',
      userName: user.displayName || 'You',
      details: `${name} (${role})`
    });

    showToast('Member updated successfully!', 'primary');
    bootstrap.Modal.getInstance(document.getElementById('editMemberModal')).hide();

  } catch (error) {
    console.error("Error updating member:", error);
    showAlert('Error updating member: ' + error.message, 'danger');
  } finally {
    saveEditBtn.innerHTML = originalText;
    saveEditBtn.disabled = false;
  }
}

// Delete member function
async function deleteFamilyMember(memberId, memberName) {
  try {
    const user = auth.currentUser;
    if (!user) return;

    if (!confirm(`Are you sure you want to remove ${memberName}? This cannot be undone.`)) {
      return;
    }

    await database.ref(`members/${user.uid}/${memberId}`).remove();

    // Log activity
    await logActivity({
      type: 'member',
      action: 'removed family member',
      deviceName: 'Family Management',
      userName: user.displayName || 'You',
      details: memberName
    });

    showToast(`${memberName} has been removed`, 'danger');

  } catch (error) {
    console.error("Error deleting member:", error);
    showAlert('Error removing member: ' + error.message, 'danger');
  }
}



// Load device statuses
function loadDeviceStatuses(userId) {
    database.ref('devices/' + userId).on('value', snapshot => {
        const devices = snapshot.val();
        
        if (devices) {
            Object.keys(devices).forEach(deviceId => {
                const switchEl = document.getElementById(deviceId + 'Switch');
                if (switchEl) {
                    switchEl.checked = devices[deviceId].status;
                }
            });
        }
    }, error => {
        console.error("Error loading device statuses:", error);
    });
}

// Load activity logs
function loadActivityLogs(userId) {
    const activityContainer = document.querySelector('.activity-timeline');
    if (!activityContainer) return;
    
    database.ref('activity/' + userId).limitToLast(5).on('value', snapshot => {
        const activities = snapshot.val();
        
        if (activities) {
            activityContainer.innerHTML = '';
            
            // Convert to array and sort by timestamp (newest first)
            const activitiesArray = Object.entries(activities).map(([id, activity]) => ({
                id,
                ...activity
            })).sort((a, b) => b.timestamp - a.timestamp);
            
            activitiesArray.forEach(activity => {
                const activityItem = createActivityItem(activity);
                activityContainer.appendChild(activityItem);
            });
        } else {
            activityContainer.innerHTML = `
                <div class="text-center py-4 text-muted">
                    <i class="bi bi-clock-history" style="font-size: 2rem;"></i>
                    <p class="mt-2">No recent activity</p>
                </div>
            `;
        }
    }, error => {
        console.error("Error loading activity logs:", error);
    });
}

// Create activity timeline item
function createActivityItem(activity) {
    const item = document.createElement('div');
    item.className = 'activity-item';
    
    // Set different icons for different activity types
    let icon, bgClass;
    switch(activity.type) {
        case 'profile':
            icon = 'bi-person-fill';
            bgClass = 'bg-primary';
            break;
        case 'security':
            icon = 'bi-shield-lock';
            bgClass = 'bg-warning';
            break;
        default:
            icon = 'bi-info-circle';
            bgClass = 'bg-secondary';
    }
    
    item.innerHTML = `
        <div class="activity-icon ${bgClass}">
            <i class="bi ${icon}"></i>
        </div>
        <div class="activity-content">
            <p>
                <strong>${activity.deviceName || 'System'}</strong> 
                ${activity.action}
                ${activity.userName ? `by <strong>${activity.userName}</strong>` : ''}
            </p>
            ${activity.details ? `<small class="text-muted">${activity.details}</small>` : ''}
            <small class="activity-time">${formatTimestamp(activity.timestamp)}</small>
        </div>
    `;
    
    return item;
}

    function loadDashboardData(user) {
  if (!user) {
    console.error("No user found");
    return;
  }
  
  console.log("Loading dashboard data for user:", user.uid);
  
  // Clear existing listeners to prevent duplicates
  database.ref('members/' + user.uid).off();
  database.ref('devices/' + user.uid).off();
  database.ref('activity/' + user.uid).off();
  
  try {
    loadUserProfile(user.uid);
    loadFamilyMembers(user.uid);
    loadDeviceStatuses(user.uid);
    loadActivityLogs(user.uid);
    loadEmergencyContacts(user.uid);
    setupFamilyMembersSection();
    setupActivityLogsSection();
    setupSecuritySection();
    setupNotificationSystem();
    console.log("Dashboard data loaded successfully");
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    showErrorAlert("Failed to load dashboard data. Please refresh the page.");
  }
}

// Load emergency contacts
function loadEmergencyContacts() {
    const user = auth.currentUser;
    if (!user) return;

    database.ref('emergencyContacts/' + user.uid).once('value').then(snapshot => {
        const contacts = snapshot.val();
        if (contacts) {
            document.getElementById('policeNumber').value = contacts.police || '';
            document.getElementById('fireNumber').value = contacts.fire || '';
            document.getElementById('hospitalNumber').value = contacts.hospital || '';
        }
    }).catch(error => {
        console.error("Error loading emergency contacts:", error);
        showToast('Failed to load emergency contacts', 'danger');
    });
}

// Format timestamp to relative time
function formatTimestamp(timestamp) {
  if (!timestamp) return 'Just now';
  
  const now = Date.now();
  const diff = now - timestamp;
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;
  
  if (diff < minute) {
    return 'Just now';
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diff < week) {
    const days = Math.floor(diff / day);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diff < month) {
    const weeks = Math.floor(diff / week);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diff < year) {
    const months = Math.floor(diff / month);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diff / year);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}

function getRoleBadgeClass(role) {
  switch(role) {
    case 'head': return 'bg-primary';
    case 'wife': 
    case 'husband': return 'bg-info';
    case 'son': 
    case 'daughter': return 'bg-warning';
    case 'helper': return 'bg-secondary';
    case 'guest': return 'bg-light text-dark';
    default: return 'bg-light text-dark';
  }
}

function formatRole(role) {
  if (!role) return 'Member';
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function formatPermission(permission) {
  const permissionNames = {
    'lights': 'Lights',
    'doors': 'Doors',
    'ac': 'AC',
    'tv': 'TV',
    'security': 'Security'
  };
  return permissionNames[permission] || permission;
}


// Helper function to get activity icon
function getActivityIcon(type) {
    switch(type) {
        case 'light': return 'bi-lightbulb';
        case 'door': return 'bi-door-open';
        case 'motion': 
        case 'security': return 'bi-shield-exclamation';
        case 'ac': return 'bi-thermometer-snow';
        case 'tv': return 'bi-tv';
        case 'member': return 'bi-person-plus';
        case 'settings': return 'bi-gear';
        default: return 'bi-info-circle';
    }
}

function setupNotificationSystem() {
    const user = auth.currentUser;
    if (!user) return;

    // Real-time listener for notifications
    database.ref('activity/' + user.uid).orderByChild('timestamp').limitToLast(20).on('value', (snapshot) => {
        notifications = [];
        unreadNotifications = [];
        
        snapshot.forEach((childSnapshot) => {
            const notification = {
                id: childSnapshot.key,
                ...childSnapshot.val()
            };
            
            notifications.push(notification);
            
            // Track unread notifications
            if (!notification.read) {
                unreadNotifications.push(notification);
            }
        });
        
        // Sort by timestamp (newest first)
        notifications.sort((a, b) => b.timestamp - a.timestamp);
        unreadNotifications.sort((a, b) => b.timestamp - a.timestamp);
        
        updateNotificationBadge();
        renderNotifications();
        renderActivityLogs();
        
        // Show toast for new unread notifications
        checkForNewNotifications();
    });
}

function checkForNewNotifications() {
    // Only show toast for important unread notifications (alerts/warnings)
    const importantUnread = unreadNotifications.filter(n => 
        n.type === 'alert' || n.type === 'warning' || n.type === 'security'
    );
    
    importantUnread.forEach(notification => {
        if (!notification.toastShown) {
            showToastNotification(notification);
            // Mark as toast shown to prevent duplicates
            notification.toastShown = true;
        }
    });
}

function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toastContainer');
  const toastId = 'toast-' + Date.now();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.id = toastId;
  toast.innerHTML = `
    <div class="toast-header">
      <i class="bi ${type === 'success' ? 'bi-check-circle' : type === 'danger' ? 'bi-exclamation-circle' : 'bi-info-circle'} me-2"></i>
      <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
      <button type="button" class="toast-close" onclick="document.getElementById('${toastId}').remove()">
        <i class="bi bi-x"></i>
      </button>
    </div>
    <div class="toast-body">
      ${message}
    </div>
  `;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 5000);
}

function updateNotificationBadge() {
    const badge = document.getElementById('unreadCount');
    if (badge) {
        badge.textContent = unreadNotifications.length;
        badge.style.display = unreadNotifications.length > 0 ? 'inline-block' : 'none';
        
        // Pulse animation for new notifications
        if (unreadNotifications.length > 0) {
            badge.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                badge.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
        }
    }
}

function renderNotifications() {
    const container = document.getElementById('notificationList');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (notifications.length === 0) {
        container.innerHTML = '<div class="notification-item empty text-center py-3 text-muted">No notifications</div>';
        return;
    }
    
    notifications.forEach(notification => {
        const isUnread = unreadNotifications.some(unread => unread.id === notification.id);
        
        const item = document.createElement('div');
        item.className = `notification-item ${isUnread ? 'unread' : ''}`;
        item.dataset.notificationId = notification.id;
        
        item.innerHTML = `
            <div class="d-flex align-items-start">
                <div class="notification-icon ${getActivityIconClass(notification.type)}">
                    <i class="bi ${getActivityIcon(notification.type)}"></i>
                </div>
                <div class="notification-content flex-grow-1">
                    <p class="mb-1">
                        <strong>${formatDeviceName(notification.deviceName) || 'System'}</strong> 
                        ${notification.action} 
                        ${notification.userName ? `by <strong>${notification.userName}</strong>` : ''}
                    </p>
                    ${notification.details ? `<small class="text-muted d-block">${notification.details}</small>` : ''}
                    <small class="notification-time text-muted">${formatTimestamp(notification.timestamp)}</small>
                </div>
                ${isUnread ? '<span class="unread-dot"></span>' : ''}
            </div>
        `;
        
        item.addEventListener('click', () => markAsRead(notification.id));
        container.appendChild(item);
    });
}

function markAsRead(notificationId) {
    const user = auth.currentUser;
    if (!user) return;
    
    // Find the notification
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification || notification.read) return;
    
    // Update in Firebase
    database.ref(`activity/${user.uid}/${notificationId}`).update({
        read: true,
        readAt: firebase.database.ServerValue.TIMESTAMP
    })
    .then(() => {
        // Update local state
        notification.read = true;
        unreadNotifications = unreadNotifications.filter(n => n.id !== notificationId);
        
        updateNotificationBadge();
        renderNotifications();
    })
    .catch(error => {
        console.error("Error marking as read:", error);
        showToast('Failed to mark notification as read', 'danger');
    });
}

// Update your activity logs function to use the same data
function renderActivityLogs() {
    const activityContainer = document.querySelector('.activity-timeline');
    if (!activityContainer) return;
    
    activityContainer.innerHTML = '';
    
    if (notifications.length === 0) {
        activityContainer.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="bi bi-clock-history" style="font-size: 2rem;"></i>
                <p class="mt-2">No recent activity</p>
            </div>
        `;
        return;
    }
    
    // Show only the 5 most recent activities
    const recentActivities = notifications.slice(0, 5);
    
    recentActivities.forEach(activity => {
        const activityItem = createActivityItem(activity);
        activityContainer.appendChild(activityItem);
    });
}

// Helper function to get activity icon class
function getActivityIconClass(type) {
    switch(type) {
        case 'alert': 
        case 'motion': return 'danger';
        case 'warning': return 'warning';
        case 'info': return 'info';
        case 'success': 
        case 'door': return 'success';
        case 'member': return 'primary';
        case 'settings': return 'secondary';
        default: return 'primary';
    }
}

// Helper function to format device name
function formatDeviceName(deviceId) {
    const names = {
        'lights': 'Lights',
        'door': 'Main Door',
        'ac': 'AC',
        'tv': 'TV',
        'cameras': 'Cameras',
        'alarm': 'Alarm'
    };
    return names[deviceId] || deviceId;
}


function showErrorAlert(message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-danger alert-dismissible fade show';
  alertDiv.role = 'alert';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  document.body.prepend(alertDiv);
  
  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}
window.logoutUser = handleLogout;

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);
