// ================= STORAGE KEY =================
const STORAGE_KEY = "nscdc_replacements";

// ================= STATES =================
const states = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue",
  "Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu",
  "Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi",
  "Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo",
  "Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara","FCT - Abuja"
];

// Populate state dropdown
const stateSelect = document.getElementById("state");
if (stateSelect) {
  states.forEach(state => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  });
}

// ================= FORM SUBMISSION =================
const regForm = document.getElementById("regForm");

if (regForm) {
  regForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get existing records
    let volunteers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // Create new record
    let data = {
      fullname: document.getElementById("fullname").value,
      replacementNo: document.getElementById("replacementNo").value,
      nin: document.getElementById("nin").value,
      state: document.getElementById("state").value,
      lga: document.getElementById("lga").value,
      nextOfKin: document.getElementById("nok").value,
      email: document.getElementById("email").value,
      address: document.getElementById("address").value,
      qualification: document.getElementById("qualification").value,
      maritalStatus: document.getElementById("marital").value,
      status: "Pending"
    };

    // Save
    volunteers.push(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(volunteers));

    // Show popup
    const popup = document.getElementById("successPopup");
    popup.classList.add("show");
    setTimeout(() => popup.classList.remove("show"), 3000);

    // Show message in <p id="msg">
    document.getElementById("msg").innerText = "Application submitted successfully!";

    this.reset();

    // Update admin dashboard
    loadAdminTable();
  });
}

// ================= ADMIN DASHBOARD =================
function loadAdminTable() {
  let volunteers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  let tbody = document.getElementById("adminData");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (volunteers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="12">No applications submitted</td></tr>`;
    return;
  }

  volunteers.forEach((v, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${v.fullname}</td>
        <td>${v.replacementNo}</td>
        <td>${v.nin}</td>
        <td>${v.state}</td>
        <td>${v.lga}</td>
        <td>${v.nextOfKin}</td>
        <td>${v.email}</td>
        <td>${v.address}</td>
        <td>${v.qualification}</td>
        <td>${v.maritalStatus}</td>
        <td class="${v.status.toLowerCase()}">${v.status}</td>
        <td>
          <button class="approve" onclick="updateStatus(${i}, 'Approved')">Approve</button>
          <button class="reject" onclick="updateStatus(${i}, 'Rejected')">Reject</button>
          <button class="delete" onclick="deleteRecord(${i})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// ================= UPDATE STATUS =================
function updateStatus(index, status) {
  let volunteers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  volunteers[index].status = status;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(volunteers));
  loadAdminTable();
}

// ================= DELETE RECORD =================
function deleteRecord(index) {
  let volunteers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  if (!confirm("Are you sure you want to delete this record?")) return;
  volunteers.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(volunteers));
  loadAdminTable();
}

// ================= AUTO LOAD ADMIN =================
document.addEventListener("DOMContentLoaded", () => {
  loadAdminTable();
});
