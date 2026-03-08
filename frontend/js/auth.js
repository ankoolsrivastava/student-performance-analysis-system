// Check if teacher is logged in
const teacher = JSON.parse(localStorage.getItem("teacher"));

if (!teacher) {
  window.location.href = "login.html";
}

// Show teacher name if element exists
const teacherNameEl = document.getElementById("teacherName");
if (teacher && teacherNameEl) {
  teacherNameEl.innerText = teacher.name;
}

// Logout function
function logout() {
  localStorage.removeItem("teacher");
  window.location.href = "login.html";
}