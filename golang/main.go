package main

import (
	"log"
	"os"
)

func main() {
	// A directory should be given in which the punctuality datasets live.
	if len(os.Args) < 2 {
		log.Fatalln("Error: no directory path given")
	}

	// Initialize the database.
	db := localhost()
	db.createSchema()
	db.initNetwork()
	db.insertDatasets(os.Args[1])
}
