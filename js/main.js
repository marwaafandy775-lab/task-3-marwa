"use strict";

class Student {
  #subjectOne;
  #subjectTwo;
  #subjectThree;
  #attendance;

  constructor(name, subjectOne, subjectTwo, subjectThree, attendance) {
    if (!name || !name.trim()) {
      throw new Error("يرجى إدخال اسم الطالب.");
    }

    this.name = name.trim();
    this.subjectOne = subjectOne;
    this.subjectTwo = subjectTwo;
    this.subjectThree = subjectThree;
    this.attendance = attendance;
  }

  #validatePercentage(value, label) {
    if (value === "" || value === null || value === undefined) {
      throw new Error(`حقل ${label} مطلوب.`);
    }

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue < 0 || numericValue > 100) {
      throw new Error(`${label} يجب أن تكون رقماً بين 0 و100.`);
    }

    return numericValue;
  }

  set subjectOne(value) {
    this.#subjectOne = this.#validatePercentage(value, "درجة المادة الأولى");
  }

  set subjectTwo(value) {
    this.#subjectTwo = this.#validatePercentage(value, "درجة المادة الثانية");
  }

  set subjectThree(value) {
    this.#subjectThree = this.#validatePercentage(value, "درجة المادة الثالثة");
  }

  set attendance(value) {
    this.#attendance = this.#validatePercentage(value, "نسبة الحضور");
  }

  get average() {
    return (this.#subjectOne + this.#subjectTwo + this.#subjectThree) / 3;
  }
}

const studentsList = [];

const studentForm = document.getElementById("studentForm");
const studentNameInput = document.getElementById("studentName");
const subjectOneInput = document.getElementById("subjectOne");
const subjectTwoInput = document.getElementById("subjectTwo");
const subjectThreeInput = document.getElementById("subjectThree");
const attendanceInput = document.getElementById("attendance");
const errorBox = document.getElementById("errorBox");
const studentsListBox = document.getElementById("studentsList");
const studentsCount = document.getElementById("studentsCount");
const mercyCommitteeBtn = document.getElementById("mercyCommitteeBtn");
const reportBox = document.getElementById("reportBox");

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("d-none");
}

function clearError() {
  errorBox.textContent = "";
  errorBox.classList.add("d-none");
}

function escapeHtml(value) {
  const characters = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  };
  return value.replace(/[&<>"']/g, (character) => characters[character]);
}

function renderStudents() {
  studentsCount.textContent = `${studentsList.length} ${studentsList.length === 1 ? "طالب" : "طلاب"}`;
  studentsListBox.classList.remove("empty-state");
  studentsListBox.innerHTML = studentsList.map((student, index) => `
    <div class="list-group-item d-flex justify-content-between align-items-center">
      <span>${index + 1}. ${escapeHtml(student.name)}</span>
      <small class="text-secondary">المتوسط: ${student.average.toFixed(2)}</small>
    </div>`).join("");
}

studentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearError();

  try {
    const student = new Student(
      studentNameInput.value,
      subjectOneInput.value,
      subjectTwoInput.value,
      subjectThreeInput.value,
      attendanceInput.value
    );

    studentsList.push(student);
    renderStudents();
    studentForm.reset();
    studentNameInput.focus();
  } catch (error) {
    showError(error.message);
  }
});

mercyCommitteeBtn.addEventListener("click", () => {
  const strugglingStudents = studentsList.filter((student) => {
    const average = student.average;
    return average >= 40 && average <= 49;
  });

  const adjustedStudents = strugglingStudents.map((student) => ({
    name: student.name,
    adjustedAverage: student.average + 5
  }));

  const totalAdjustedAverages = adjustedStudents.reduce(
    (total, student) => total + student.adjustedAverage,
    0
  );
  const overallAverage = adjustedStudents.length
    ? totalAdjustedAverages / adjustedStudents.length
    : 0;

  const names = adjustedStudents.length
    ? adjustedStudents.map((student) => escapeHtml(student.name)).join("، ")
    : "لا يوجد";

  reportBox.innerHTML = `
    <p class="mb-2">عدد الطلاب المتعثرين: <span class="report-value">${adjustedStudents.length}</span></p>
    <p class="mb-2">الأسماء: <span class="report-value">${names}</span></p>
    <p class="mb-0">المتوسط العام بعد الرأفة: <span class="report-value">${overallAverage.toFixed(2)}</span></p>`;
  reportBox.classList.remove("empty-state");
});
