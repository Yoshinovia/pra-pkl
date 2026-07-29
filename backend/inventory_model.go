package main

type Inventory struct {
	ID       int     `json:"id"`
	Name     string  `json:"name"`
	Category string  `json:"category"`
	Stock    int     `json:"stock"`
	Price    float64 `json:"price"`
	Status   string  `json:"status"`
}

type CreateInventoryRequest struct {
	Name     string  `json:"name"`
	Category string  `json:"category"`
	Stock    int     `json:"stock"`
	Price    float64 `json:"price"`
	Status   string  `json:"status"`
}

// UpdateInventoryRequest uses pointers so a client can send only the
// fields it wants to change (e.g. just "stock" when adjusting quantity).
type UpdateInventoryRequest struct {
	Name     *string  `json:"name"`
	Category *string  `json:"category"`
	Stock    *int     `json:"stock"`
	Price    *float64 `json:"price"`
	Status   *string  `json:"status"`
}

type Movement struct {
  ID          int    `json:"id"`
  InventoryID int    `json:"inventory_id"`
  ProductName string `json:"productName"`
  Category    string `json:"category"`
  Type        string `json:"type"`
  Quantity    int    `json:"quantity"`
  Reference   string `json:"reference"`
  Date        string `json:"date"`
}