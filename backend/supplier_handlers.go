package main

import (
	"encoding/json"
	"net/http"
	"strconv"
)

func getSuppliersHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	if r.Method != "GET" {
		http.Error(w, "Method tidak diizinkan", http.StatusMethodNotAllowed)
		return
	}

	rows, err := db.Query("SELECT id, name, contact_person, email, phone, products_supplied, status FROM suppliers")
	if err != nil {
		http.Error(w, "Gagal mengambil data: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	suppliers := []Supplier{}
	for rows.Next() {
		var s Supplier
		if err := rows.Scan(&s.ID, &s.Name, &s.ContactPerson, &s.Email, &s.Phone, &s.ProductsSupplied, &s.Status); err != nil {
			http.Error(w, "Gagal membaca data: "+err.Error(), http.StatusInternalServerError)
			return
		}
		suppliers = append(suppliers, s)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(suppliers)
}

func createSupplierHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	if r.Method != "POST" {
		http.Error(w, "Method tidak diizinkan", http.StatusMethodNotAllowed)
		return
	}

	var req CreateSupplierRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.Name == "" || req.ContactPerson == "" || req.Email == "" {
		http.Error(w, "Name, Contact Person, dan Email wajib diisi", http.StatusBadRequest)
		return
	}
	if req.Status == "" {
		req.Status = "active"
	}

	query := `INSERT INTO suppliers (name, contact_person, email, phone, products_supplied, status) VALUES (?, ?, ?, ?, ?, ?)`
	result, err := db.Exec(query, req.Name, req.ContactPerson, req.Email, req.Phone, req.ProductsSupplied, req.Status)
	if err != nil {
		http.Error(w, "Gagal menyimpan data: "+err.Error(), http.StatusInternalServerError)
		return
	}

	newID, _ := result.LastInsertId()

	created := Supplier{
		ID:               int(newID),
		Name:             req.Name,
		ContactPerson:    req.ContactPerson,
		Email:            req.Email,
		Phone:            req.Phone,
		ProductsSupplied: req.ProductsSupplied,
		Status:           req.Status,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(created)
}

func updateSupplierHandler(w http.ResponseWriter, r *http.Request) {
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

	var req UpdateSupplierRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	query := `UPDATE suppliers SET name = ?, contact_person = ?, email = ?, phone = ?, products_supplied = ?, status = ? WHERE id = ?`
	result, err := db.Exec(query, req.Name, req.ContactPerson, req.Email, req.Phone, req.ProductsSupplied, req.Status, id)
	if err != nil {
		http.Error(w, "Gagal mengupdate data: "+err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Supplier tidak ditemukan", http.StatusNotFound)
		return
	}

	updated := Supplier{
		ID:               id,
		Name:             req.Name,
		ContactPerson:    req.ContactPerson,
		Email:            req.Email,
		Phone:            req.Phone,
		ProductsSupplied: req.ProductsSupplied,
		Status:           req.Status,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(updated)
}

func deleteSupplierHandler(w http.ResponseWriter, r *http.Request) {
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

	result, err := db.Exec("DELETE FROM suppliers WHERE id = ?", id)
	if err != nil {
		http.Error(w, "Gagal menghapus data: "+err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Supplier tidak ditemukan", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]bool{"success": true})
}