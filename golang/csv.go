package main

import (
	"log"
	"strconv"
	"strings"
)

type Entry struct {
	DateOfDeparture      string `csv:"DATDEP"`
	TrainNumber          int16  `csv:"TRAIN_NO"`
	Relation             string `csv:"RELATION"`
	Operator             string `csv:"TRAIN_SERV"`
	DepartureLine        string `csv:"LINE_NO_DEP"`
	ActualDepartureTime  string `csv:"REAL_TIME_DEP"`
	ActualArrivalTime    string `csv:"REAL_TIME_ARR"`
	PlannedDepartureTime string `csv:"PLANNED_TIME_DEP"`
	PlannedArrivalTime   string `csv:"PLANNED_TIME_ARR"`
	DelayAtArrival       int16  `csv:"DELAY_ARR"`
	DelayAtDeparture     int16  `csv:"DELAY_DEP"`
	Direction            string `csv:"RELATION_DIRECTION"`
	StoppingPlace        string `csv:"PTCAR_LG_NM_NL"`
	ArrivalLine          string `csv:"LINE_NO_ARR"`
	PlannedArrivalDate   string `csv:"PLANNED_DATE_ARR"`
	PlannedDepartureDate string `csv:"PLANNED_DATE_DEP"`
	ActualArrivalDate    string `csv:"REAL_DATE_ARR"`
	ActualDepartureDate  string `csv:"REAL_DATE_DEP"`
}

type OperationalPoint struct {
	Identifier     string `csv:"PTCAR ID"`
	Location       string `csv:"Geo Point"`
	CommercialName string `csv:"Complete name in Dutch"`
	InternalName   string `csv:"Abbreviation BTS Dutch complete"`
	Type           string `csv:"Classification NL"`
}

func (rawOperationalPoint *OperationalPoint) toStation() Station {
	var result Station
	coordinates := strings.Split(rawOperationalPoint.Location, ",")

	lat, err := strconv.ParseFloat(coordinates[0], 64)
	if err != nil {
		log.Fatalln(err)
	}

	lon, err := strconv.ParseFloat(strings.TrimSpace(coordinates[1]), 64)
	if err != nil {
		log.Fatalln(err)
	}

	integer, err := strconv.ParseInt(rawOperationalPoint.Identifier, 10, 16)
	result.Identifier = int16(integer)
	if err != nil {
		log.Fatalln(err)
	}
	result.Longitude = lon
	result.Latitude = lat
	result.CommercialName = rawOperationalPoint.CommercialName
	result.InternalName = rawOperationalPoint.InternalName
	return result
}
