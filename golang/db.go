package main

import (
	"encoding/csv"
	"errors"
	"fmt"
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
	"github.com/gocarina/gocsv"
	"io"
	"log"
	"os"
	"strings"
)

type Database struct {
	Connection *pg.DB
	stations   map[string]Station
	routes     map[string]Route
	trains     map[int16]Train
}

func localhost() Database {
	var result Database

	result.Connection = pg.Connect(&pg.Options{
		User:     "postgres",
		Password: "QM34aDUGA6t8MwB&VfnPy&agGRT#9^",
		Database: "postgres",
		Addr:     "localhost:5432",
	})

	result.stations = make(map[string]Station)
	result.routes = make(map[string]Route)
	result.trains = make(map[int16]Train)

	return result
}

func (db *Database) createSchema() {
	_, err := db.Connection.Model(&Stop{}).Where("TRUE").Delete()
	if err != nil {
		log.Println(err)
	}

	_, err = db.Connection.Model(&Train{}).Where("TRUE").Delete()
	if err != nil {
		log.Println(err)
	}

	_, err = db.Connection.Model(&Route{}).Where("TRUE").Delete()
	if err != nil {
		log.Println(err)
	}

	_, err = db.Connection.Model(&Station{}).Where("TRUE").Delete()
	if err != nil {
		log.Println(err)
	}

	models := []interface{}{
		(*Station)(nil),
		(*Route)(nil),
		(*Train)(nil),
		(*Stop)(nil),
	}

	for _, model := range models {
		err := db.Connection.Model(model).CreateTable(&orm.CreateTableOptions{
			IfNotExists:   true,
			FKConstraints: true,
		})
		if err != nil {
			log.Fatalln(err)
		}
	}
}

func (db *Database) initNetwork() {
	// Configure the CSV reader in order to properly parse the difficult CSV
	// files supplied form Infrabel.
	gocsv.SetCSVReader(func(in io.Reader) gocsv.CSVReader {
		r := csv.NewReader(in)
		r.LazyQuotes = true
		r.Comma = ';'
		r.TrimLeadingSpace = true
		return r
	})

	f, err := os.OpenFile("./data/operational_points.csv", os.O_RDONLY, os.ModePerm)
	if err != nil {
		log.Fatal(err)
	}

	var raw []OperationalPoint
	if err := gocsv.UnmarshalFile(f, &raw); err != nil {
		log.Fatalln(err)
	}

	for _, entry := range raw {
		station := entry.toStation()

		err := db.Connection.Model(&station).WherePK().Select()

		// Insert if not exist.
		if errors.Is(err, pg.ErrNoRows) {
			_, err = db.Connection.Model(&station).Insert()
		}

		// If an error remains, it is fatal.
		if err != nil {
			log.Fatalln(err)
		}

		db.stations[station.InternalName] = station
	}
}

func (db *Database) insertDatasets(directory string) {
	// Configure the CSV reader in order to properly parse the difficult CSV
	// files supplied form Infrabel.
	gocsv.SetCSVReader(func(in io.Reader) gocsv.CSVReader {
		r := csv.NewReader(in)
		r.LazyQuotes = true
		r.Comma = ','
		r.TrimLeadingSpace = true
		return r
	})

	directoryHandle, err := os.Open(directory)
	if err != nil {
		log.Fatalln(err)
	}
	defer func(f *os.File) {
		err := f.Close()
		if err != nil {
			log.Fatalln(err)
		}
	}(directoryHandle)

	// Read the contents of the directory
	files, err := directoryHandle.Readdir(-1)
	if err != nil {
		log.Fatalln(err)
	}

	// Iterate over the files
	for _, file := range files {
		if !strings.HasPrefix(file.Name(), "Data_raw_punctuality") {
			continue
		}

		if !strings.HasSuffix(file.Name(), ".csv") {
			continue
		}

		absolutePath := fmt.Sprintf("%s/%s", directory, file.Name())
		db.insertDataset(absolutePath)
	}
}

func (db *Database) insertDataset(path string) {
	log.Printf("Parsing %s\n", path)
	file, err := os.OpenFile(path, os.O_RDONLY, os.ModePerm)
	if err != nil {
		log.Fatalln(err)
	}

	var entries []Entry
	if err := gocsv.UnmarshalFile(file, &entries); err != nil {
		log.Fatalln(err)
	}

	for i := 0; i < len(entries); i += 1000 {
		log.Printf("%d/%d\n", i, len(entries))

		batch := make([]Stop, 0)
		for j := 0; i+j < len(entries) && j < 1000; j += 1 {
			result, ok := db.prepare(entries[i+j])
			if ok {
				batch = append(batch, result)
			}
		}

		if len(batch) > 0 {
			_, err = db.Connection.Model(&batch).Insert()
			if err != nil {
				log.Fatalln(err)
			}
		} else {
			log.Println("Empty batch")
		}
	}
}

func (db *Database) prepare(entry Entry) (Stop, bool) {
	if entry.Operator != "SNCB/NMBS" {
		return Stop{}, false
	}

	if !(strings.HasPrefix(entry.Relation, "IC ") || strings.HasPrefix(entry.Relation, "L ")) {
		return Stop{}, false
	}

	// Retrieve stations from the file.
	direction := strings.Split(entry.Direction, ":")
	if len(direction) < 2 {
		log.Printf("Invalid direction: %s\n", entry.Direction)
		return Stop{}, false
	}
	locations := strings.Split(direction[1], "->")
	if len(locations) < 2 {
		log.Printf("Invalid location: %s\n", direction[1])
		return Stop{}, false
	}
	startName := strings.TrimSpace(locations[0])
	endName := strings.TrimSpace(locations[1])

	// Start station.
	start, ok := db.stations[startName]
	if !ok {
		return Stop{}, false
	}

	// End station.
	end, ok := db.stations[endName]
	if !ok {
		return Stop{}, false
	}

	// Retrieve route.
	route, ok := db.routes[entry.Relation]
	if !ok {
		route = Route{
			Identifier: entry.Relation,
			StartId:    start.Identifier,
			EndId:      end.Identifier,
		}
		_, err := db.Connection.Model(&route).Insert()
		if err != nil {
			log.Fatalln(err)
		}

		// Add to the cache.
		db.routes[entry.Relation] = route
	}

	// Retrieve train line.
	train, ok := db.trains[entry.TrainNumber]
	if !ok {
		train = Train{
			Identifier: entry.TrainNumber,
			RouteId:    route.Identifier,
		}
		_, err := db.Connection.Model(&train).Insert()
		if err != nil {
			log.Fatalln(err)
		}

		// Add to the cache.
		db.trains[entry.TrainNumber] = train
	}

	// Current stop.
	station, ok := db.stations[entry.StoppingPlace]
	if !ok {
		return Stop{}, false
	}

	// Parse times.
	arrival := parseTime(entry.PlannedArrivalDate, entry.PlannedArrivalTime)
	departure := parseTime(entry.PlannedDepartureDate, entry.PlannedDepartureTime)

	arrivalReal := parseTime(entry.ActualArrivalDate, entry.ActualArrivalTime)
	departureReal := parseTime(entry.ActualDepartureDate, entry.ActualDepartureTime)

	arrivalDelay := arrivalReal.Unix() - arrival.Unix()
	departureDelay := departureReal.Unix() - departure.Unix()

	// Create and prepare stop.
	stop := Stop{
		Arrival:        arrival,
		Departure:      departure,
		ArrivalDelay:   int16(arrivalDelay),
		DepartureDelay: int16(departureDelay),
		TrainId:        train.Identifier,
		StationId:      station.Identifier,
	}

	return stop, true
}
