package main

type ActivityLog struct {
  ID           int    `json:"id"`
  UserID       int    `json:"user_id"`
  UserName     string `json:"user_name"`
  Action       string `json:"action"`
  TargetEntity string `json:"target_entity"`
  Details      string `json:"details"`
  Timestamp    string `json:"timestamp"`
}

type CreateActivityLogRequest struct {
  UserID       int    `json:"user_id"`
  UserName     string `json:"user_name"`
  Action       string `json:"action"`
  TargetEntity string `json:"target_entity"`
  Details      string `json:"details"`
}

type CreateUserRequest struct {
  Name     string `json:"name"`
  Email    string `json:"email"`
  Password string `json:"password"`
  Role     string `json:"role"` // "admin" or "inventory_manager"
}

type UserResponse struct {
  ID        int    `json:"id"`
  Name      string `json:"name"`
  Email     string `json:"email"`
  Role      string `json:"role"`
  CreatedAt string `json:"created_at"`
}