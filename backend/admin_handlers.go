package main

import (
	"encoding/json"
	"net/http"
)
func getUsersHandler(w http.ResponseWriter, r *http.Request) {
  // Set CORS headers
  w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
  w.Header().Set("Access-Control-Allow-Credentials", "true")
  
  if r.Method == "OPTIONS" {
    w.WriteHeader(http.StatusOK)
    return
  }
  
  rows, err := db.Query("SELECT id, name, email, role, created_at FROM users")
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }
  defer rows.Close()
  
  var users []UserResponse
  for rows.Next() {
    var u UserResponse
    if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.Role, &u.CreatedAt); err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }
    users = append(users, u)
  }
  
  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(users)
}

func createUserHandler(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
  w.Header().Set("Access-Control-Allow-Credentials", "true")
  w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
  
  if r.Method == "OPTIONS" {
    w.WriteHeader(http.StatusOK)
    return
  }
  
  var req CreateUserRequest
  if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
    http.Error(w, err.Error(), http.StatusBadRequest)
    return
  }
  
  result, err := db.Exec(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    req.Name, req.Email, req.Password, "inventory_manager",
  )
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }
  
  id, _ := result.LastInsertId()
  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(map[string]interface{}{"id": id, "message": "User created"})
}

func getActivityLogsHandler(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
  w.Header().Set("Access-Control-Allow-Credentials", "true")
  w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")

  if r.Method == "OPTIONS" {
    w.WriteHeader(http.StatusOK)
    return
  }

  rows, err := db.Query("SELECT id, user_id, user_name, action, target_entity, details, timestamp FROM activity_logs ORDER BY timestamp DESC")
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }
  defer rows.Close()

  logs := []ActivityLog{}
  for rows.Next() {
    var log ActivityLog
    if err := rows.Scan(&log.ID, &log.UserID, &log.UserName, &log.Action, &log.TargetEntity, &log.Details, &log.Timestamp); err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }
    logs = append(logs, log)
  }

  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(logs)
}

func createActivityLogHandler(w http.ResponseWriter, r *http.Request) {
  // Set CORS headers
  w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
  w.Header().Set("Access-Control-Allow-Credentials", "true")
  w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
  
  if r.Method == "OPTIONS" {
    w.WriteHeader(http.StatusOK)
    return
  }
  
  var req CreateActivityLogRequest
  if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
    http.Error(w, err.Error(), http.StatusBadRequest)
    return
  }
  
  _, err := db.Exec(
    "INSERT INTO activity_logs (user_id, user_name, action, target_entity, details, timestamp) VALUES (?, ?, ?, ?, ?, NOW())",
    req.UserID, req.UserName, req.Action, req.TargetEntity, req.Details,
  )
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }
  
  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(map[string]string{"message": "Log created"})
}