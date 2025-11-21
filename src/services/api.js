// src/services/api.js
const BASE_URL = "http://localhost:3000";

async function request(endpoint, method = "GET", data = null) {
  const config = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(BASE_URL + endpoint, config);
  
  if (!response.ok) {
    console.error("API Error:", response.status);
    alert(`Something went wrong: ERROR ${response.status}`);
    throw new Error(`HTTP ${response.status}`);
  }

  if (method === "GET") {
    return await response.json();
  }
  return true;
}

// TILs
export const getTils = () => request("/tils");
export const addTil = (til) => request("/tils", "POST", til);
export const updateTil = (id, til) => request(`/tils/${id}`, "PUT", til);
export const deleteTil = (id) => request(`/tils/${id}`, "DELETE");

// Subjects
export const getSubjects = () => request("/subject");
export const addSubject = (subject) => request("/subject", "POST", subject);
export const updateSubject = (id, subject) => request(`/subject/${id}`, "PUT", subject);
export const deleteSubject = (id) => request(`/subject/${id}`, "DELETE");
