document.addEventListener("DOMContentLoaded", () => {
  const currentDate = new Date();
        document.getElementById("month").textContent = currentDate
          .toLocaleString("default", { month: "long" })
          .toUpperCase();
        document.getElementById("year").textContent = currentDate.getFullYear();
        document.getElementById("day").textContent = currentDate.getDate();
});