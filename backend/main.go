package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var db *sql.DB

func initDB() {
	if err := godotenv.Load(); err != nil{
		log.Println("Peringatan: File .env tidak ditemukan, kalau ga ada. Buat dulu guys")
	}

	dbUser := getEnv("DB_USER", "")
	dbPass := getEnv("DB_PASS", "")
	dbHost := getEnv("DB_HOST", "127.0.0.1")
	dbPort := getEnv("DB_PORT", "3306")
	dbName := getEnv("DB_NAME", "")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", dbUser, dbPass, dbHost, dbPort, dbName)

	var err error
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal(err)
	}
	fmt.Println("Koneksi MySQL Berhasil!")
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func main() {
	initDB()
	defer db.Close()

	http.HandleFunc("/api/login", loginHandler)
	http.HandleFunc("/api/logout", logoutHandler)

	// Route for Inventories
	http.HandleFunc("/api/inventory", createInventoryHandler)
	http.HandleFunc("/api/inventory/delete", deleteInventoryHandler)
	http.HandleFunc("/api/inventory/get", getInventoriesHandler)
	http.HandleFunc("/api/inventory/update", updateInventoryHandler)

	// Route for Suppliers
	http.HandleFunc("/api/suppliers/get", getSuppliersHandler)
	http.HandleFunc("/api/suppliers/create", createSupplierHandler)
	http.HandleFunc("/api/suppliers/update", updateSupplierHandler)
	http.HandleFunc("/api/suppliers/delete", deleteSupplierHandler)
	

	fmt.Println("Backend Go berjalan di http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}