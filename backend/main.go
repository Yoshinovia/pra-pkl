package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

func initDB() {
	var err error
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

func main() {
	initDB()
	defer db.Close()

	http.HandleFunc("/api/login", loginHandler)
	http.HandleFunc("/api/logout", logoutHandler)
	http.HandleFunc("/api/inventory", createInventoryHandler)
	http.HandleFunc("/api/inventory/delete", deleteInventoryHandler)
	http.HandleFunc("/api/inventory/get", getInventoriesHandler)

	fmt.Println("Backend Go berjalan di http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}