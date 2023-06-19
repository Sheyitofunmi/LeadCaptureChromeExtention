// DOM ELEMENTS
const inputEl = document.getElementById("input-el");
const searchInput = document.getElementById("search-input");
const saveBtn = document.getElementById("save-btn");
const deleteAllBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("tab-btn");
const liBtns = document.querySelectorAll(".li-btn");
const ulEl = document.getElementById("ul-el");

let myLeads = [];
let filteredLeads = [];

// DISPLAY ITEM FROM LOCAL STORAGE

const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));

if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage;
  render(myLeads);
}

// RENDER ELEMENT TO DOM
function render(leads) {
  let listItems = "";
  for (let i = 0; i < leads.length; i++) {
    listItems += `<li> <a target = '_blank' href='${leads[i]}'> ${leads[i]} </a>
        <button class='li-btn'>x</button></li>`;
  }
  ulEl.innerHTML = listItems;
}

// ADD ELEMENT TO UI WHEN BUTTON IS CLICKED
saveBtn.addEventListener("click", () => {
  if (!inputEl.value || myLeads.includes(inputEl.value)) {
    return;
  }
  const newLead = inputEl.value;
  myLeads.push(newLead);

  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  inputEl.value = "";
  render(myLeads);
});

// DELETE ALL
deleteAllBtn.addEventListener("click", () => {
  const confirmation = confirm("Are you sure you want to delete all leads?");

  if (confirmation) {
    localStorage.clear();
    myLeads = [];
    render(myLeads);
  };
});

// DELETE SINGLE LIST ELEMENT
ulEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("li-btn")) {
    const listItem = e.target.parentElement;
    const index = Array.from(listItem.parentNode.children).indexOf(listItem);

    myLeads.splice(index, 1);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
  }
});


// SAVE TAB
tabBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs[0].url || myLeads.includes(tabs[0].url)) {
      return;
    }
    myLeads.push(tabs[0].url);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
  });
});

// SEARCH FILTER
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  filteredLeads = myLeads.filter((lead) =>
    lead.toLowerCase().includes(searchTerm)
  );
  render(filteredLeads);
});