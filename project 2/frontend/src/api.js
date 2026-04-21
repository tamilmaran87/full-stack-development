const BASE = "/api";

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  // Stats
  stats:              ()           => req("GET",    "/stats"),
  health:             ()           => req("GET",    "/health"),

  // Events
  getEvents:          ()           => req("GET",    "/events"),
  createEvent:        (data)       => req("POST",   "/events",        data),
  updateEvent:        (id, data)   => req("PATCH",  `/events/${id}`,  data),
  deleteEvent:        (id)         => req("DELETE", `/events/${id}`),

  // Registrations
  getRegistrations:   (eventId)    => req("GET",    `/registrations${eventId ? `?event_id=${eventId}` : ""}`),
  register:           (data)       => req("POST",   "/registrations", data),
  removeRegistration: (regId)      => req("DELETE", `/registrations/${regId}`),

  // Students
  getStudents:        ()           => req("GET",    "/students"),

  // Raw SQL (admin)
  runSQL:             (sql)        => req("POST",   "/sql",           { sql }),
};
