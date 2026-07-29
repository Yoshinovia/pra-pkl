package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
)

func setCORSHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
}

func insertMovement(inventoryID int, movementType string, quantity int, reference string) error {
    _, err := db.Exec(
        `INSERT INTO movements (inventory_id, type, quantity, reference, movement_date) VALUES (?, ?, ?, ?, CURDATE())`,
        inventoryID,
        movementType,
        quantity,
        reference,
    )
    return err
}

func createInventoryHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Method tidak diizinkan", http.StatusMethodNotAllowed)
		return
	}

	var req CreateInventoryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Basic validation
	if req.Name == "" || req.Category == "" {
		http.Error(w, "Name dan Category wajib diisi", http.StatusBadRequest)
		return
	}
	if req.Status == "" {
		req.Status = "active"
	}

	query := `INSERT INTO inventory (name, category, stock, price, status) VALUES (?, ?, ?, ?, ?)`
	result, err := db.Exec(query, req.Name, req.Category, req.Stock, req.Price, req.Status)
	if err != nil {
		http.Error(w, "Gagal menyimpan data: "+err.Error(), http.StatusInternalServerError)
		return
	}

	newID, err := result.LastInsertId()
	if err != nil {
		http.Error(w, "Gagal mengambil ID baru: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if req.Stock > 0 {
		if err := insertMovement(int(newID), "Stock In", req.Stock, "Initial stock"); err != nil {
			http.Error(w, "Gagal menyimpan movement: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}
	created := Inventory{
		ID:       int(newID),
		Name:     req.Name,
		Category: req.Category,
		Stock:    req.Stock,
		Price:    req.Price,
		Status:   req.Status,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(created)
}
func updateInventoryHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "PUT" {
		http.Error(w, "Method tidak diizinkan", http.StatusMethodNotAllowed)
		return
	}

	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "ID wajib diisi", http.StatusBadRequest)
		return
	}
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID tidak valid", http.StatusBadRequest)
		return
	}

	var req UpdateInventoryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Ambil data lama dulu supaya bisa partial update
	var current Inventory
	row := db.QueryRow("SELECT id, name, category, stock, price, status FROM inventory WHERE id = ?", id)
	if err := row.Scan(&current.ID, &current.Name, &current.Category, &current.Stock, &current.Price, &current.Status); err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Item tidak ditemukan", http.StatusNotFound)
			return
		}
		http.Error(w, "Gagal mengambil data: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if req.Name != nil {
		current.Name = *req.Name
	}
	if req.Category != nil {
		current.Category = *req.Category
	}
	if req.Stock != nil {
		current.Stock = *req.Stock
	}
	if req.Price != nil {
		current.Price = *req.Price
	}
	if req.Status != nil {
		current.Status = *req.Status
	}

	oldStock := current.Stock

	if req.Stock != nil {
		current.Stock = *req.Stock
		delta := current.Stock - oldStock
		if delta > 0 {
			if err := insertMovement(id, "Stock In", delta, "Stock adjustment"); err != nil {
				http.Error(w, "Gagal menyimpan movement: "+err.Error(), http.StatusInternalServerError)
				return
			}
		} else if delta < 0 {
			if err := insertMovement(id, "Stock Out", -delta, "Stock adjustment"); err != nil {
				http.Error(w, "Gagal menyimpan movement: "+err.Error(), http.StatusInternalServerError)
				return
			}
		}
	}

	_, err = db.Exec(
		`UPDATE inventory SET name = ?, category = ?, stock = ?, price = ?, status = ? WHERE id = ?`,
		current.Name, current.Category, current.Stock, current.Price, current.Status, id,
	)
	if err != nil {
		http.Error(w, "Gagal mengupdate data: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(current)
}

func getInventoriesHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "GET" {
		http.Error(w, "Method tidak diizinkan", http.StatusMethodNotAllowed)
		return
	}

	rows, err := db.Query("SELECT id, name, category, stock, price, status FROM inventory")
	if err != nil {
		http.Error(w, "Gagal mengambil data: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var items []Inventory
	for rows.Next() {
		var item Inventory
		if err := rows.Scan(&item.ID, &item.Name, &item.Category, &item.Stock, &item.Price, &item.Status); err != nil {
			http.Error(w, "Gagal membaca data: "+err.Error(), http.StatusInternalServerError)
			return
		}
		items = append(items, item)
	}

	// Jika data di database kosong, kembalikan array kosong [] bukan null
	if items == nil {
		items = []Inventory{}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(items)
}

func deleteInventoryHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "DELETE" {
		http.Error(w, "Method tidak diizinkan", http.StatusMethodNotAllowed)
		return
	}

	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "ID wajib diisi", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID tidak valid", http.StatusBadRequest)
		return
	}

	result, err := db.Exec("DELETE FROM inventory WHERE id = ?", id)
	if err != nil {
		http.Error(w, "Gagal menghapus data: "+err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		http.Error(w, "Gagal memeriksa hasil hapus: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if rowsAffected == 0 {
		http.Error(w, "Item tidak ditemukan", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]bool{"success": true})
}