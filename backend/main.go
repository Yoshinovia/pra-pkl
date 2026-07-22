package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Message string `json:"message"`
	Success bool   `json:"success"`
}

func initDB() {
	var err error
	// Format: username:password@tcp(127.0.0.1:3306)/nama_database
	dsn := "root:@tcp(127.0.0.1:3306)/db_invent" 
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal(err)
	}
	fmt.Println("Koneksi MySQL Berhasil!")
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

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

	// Cek user di MySQL
	var storedPassword string
	query := "SELECT password FROM users WHERE email = ?"
	err = db.QueryRow(query, req.Email).Scan(&storedPassword)

	w.Header().Set("Content-Type", "application/json")
	var res LoginResponse

	if err != nil || storedPassword != req.Password {
		w.WriteHeader(http.StatusUnauthorized)
		res = LoginResponse{Message: "Email atau Password Salah", Success: false}
	} else {
		w.WriteHeader(http.StatusOK)
		res = LoginResponse{Message: "Login Berhasil!", Success: true}
	}

	json.NewEncoder(w).Encode(res)
}

func main() {
	initDB()
	defer db.Close()

	http.HandleFunc("/api/login", loginHandler)

	fmt.Println("Backend Go berjalan di http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}