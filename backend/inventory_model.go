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