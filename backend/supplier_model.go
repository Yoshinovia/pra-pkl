package main

type Supplier struct {
	ID                int    `json:"id"`
	Name              string `json:"name"`
	ContactPerson     string `json:"contact_person"`
	Email             string `json:"email"`
	Phone             string `json:"phone"`
	ProductsSupplied  int    `json:"products_supplied"`
	Status            string `json:"status"`
}

type CreateSupplierRequest struct {
	Name             string `json:"name"`
	ContactPerson    string `json:"contact_person"`
	Email            string `json:"email"`
	Phone            string `json:"phone"`
	ProductsSupplied int    `json:"products_supplied"`
	Status           string `json:"status"`
}

type UpdateSupplierRequest struct {
	Name             string `json:"name"`
	ContactPerson    string `json:"contact_person"`
	Email            string `json:"email"`
	Phone            string `json:"phone"`
	ProductsSupplied int    `json:"products_supplied"`
	Status           string `json:"status"`
}