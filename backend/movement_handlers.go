package main

import (
  "encoding/json"
  "net/http"
)

func getMovementsHandler(w http.ResponseWriter, r *http.Request) {
  setCORSHeaders(w)

  if r.Method == "OPTIONS" {
    w.WriteHeader(http.StatusOK)
    return
  }

  if r.Method != "GET" {
    http.Error(w, "Method tidak diizinkan", http.StatusMethodNotAllowed)
    return
  }

  rows, err := db.Query(`
    SELECT
      m.id,
      i.name,
      i.category,
      m.type,
      m.quantity,
      DATE_FORMAT(m.movement_date, '%Y-%m-%d') AS date,
      m.reference
    FROM movements m
    JOIN inventory i ON i.id = m.inventory_id
    ORDER BY m.movement_date DESC, m.id DESC
  `)
  if err != nil {
    http.Error(w, "Gagal mengambil data: "+err.Error(), http.StatusInternalServerError)
    return
  }
  defer rows.Close()

  var movements []Movement
  for rows.Next() {
    var m Movement
    if err := rows.Scan(&m.ID, &m.ProductName, &m.Category, &m.Type, &m.Quantity, &m.Date, &m.Reference); err != nil {
      http.Error(w, "Gagal membaca data: "+err.Error(), http.StatusInternalServerError)
      return
    }
    movements = append(movements, m)
  }

  if movements == nil {
    movements = []Movement{}
  }

  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(movements)
}