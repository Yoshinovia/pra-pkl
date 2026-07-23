package main

import (
	"encoding/json"
	"net/http"
)

type LoginRequest struct {
    Email    string `json:"email"`
    Password string `json:"password"`
}

type User struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
    Role  string `json:"role"`
}

type LoginResponse struct {
    Message string `json:"message"`
    Success bool   `json:"success"`
    User    *User  `json:"user,omitempty"`
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Credentials", "true")
    w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")

    if r.Method == "OPTIONS" {
        w.WriteHeader(http.StatusOK)
        return
    }

    if r.Method != "POST" {
        http.Error(w, "Method tidak diizinkan", http.StatusMethodNotAllowed)
        return
    }

    var req LoginRequest
    err := json.NewDecoder(r.Body).Decode(&req)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    var (
        userID          int
        userName        string
        userEmail       string
        storedPassword  string
        userRole        string
    )

    query := "SELECT id, name, email, password, role FROM users WHERE email = ?"
    err = db.QueryRow(query, req.Email).Scan(&userID, &userName, &userEmail, &storedPassword, &userRole)

    w.Header().Set("Content-Type", "application/json")

    if err != nil || storedPassword != req.Password {
        w.WriteHeader(http.StatusUnauthorized)
        json.NewEncoder(w).Encode(LoginResponse{
            Message: "Email atau Password Salah",
            Success: false,
        })
        return
    }

    http.SetCookie(w, &http.Cookie{
        Name:     "token",
        Value:    "user_logged_in_token_123",
        Path:     "/",
        HttpOnly: true,
        Secure:   false,
        SameSite: http.SameSiteLaxMode,
    })

    http.SetCookie(w, &http.Cookie{
        Name:     "role",
        Value:    userRole,
        Path:     "/",
        HttpOnly: false,
        Secure:   false,
        SameSite: http.SameSiteLaxMode,
    })

    json.NewEncoder(w).Encode(LoginResponse{
        Message: "SUk masuk gees",
        Success: true,
        User: &User{
            ID:    userID,
            Name:  userName,
            Email: userEmail,
            Role:  userRole,
        },
    })
}

func logoutHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   -1,
	})

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]bool{"success": true})
}