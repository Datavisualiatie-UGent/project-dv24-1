package main

import "time"

type Station struct {
	Identifier     int16    `pg:"id,pk"`
	Latitude       float64  `pg:"latitude,notnull"`
	Longitude      float64  `pg:"longitude,notnull"`
	CommercialName string   `pg:"commercial_name,notnull"`
	InternalName   string   `pg:"internal_name,notnull"`
	Stops          []*Stop  `pg:"rel:has-many"`
	Routes         []*Route `pg:"rel:has-many"`
}

type Route struct {
	Identifier string   `pg:"id,pk"`
	StartId    int16    `pg:"start_id,notnull"`
	Start      *Station `pg:"rel:has-one"`
	EndId      int16    `pg:"end_id,notnull"`
	End        *Station `pg:"rel:has-one"`
	Trains     []*Train `pg:"rel:has-many"`
}

type Train struct {
	Identifier int16  `pg:"id,pk"`
	RouteId    string `pg:"route_id,notnull"`
	Route      *Route `pg:"rel:has-one"`
}

type Stop struct {
	Identifier     int32     `pg:"id,pk"`
	Arrival        time.Time `pg:"arrival"`
	Departure      time.Time `pg:"departure"`
	ArrivalDelay   int16     `pg:"arrival_delay"`
	DepartureDelay int16     `pg:"departure_delay"`
	TrainId        int16     `pg:"train_id,notnull"`
	Train          *Train    `pg:"rel:has-one"`
	StationId      int16     `pg:"station_id,notnull"`
	Station        *Station  `pg:"rel:has-one"`
}
