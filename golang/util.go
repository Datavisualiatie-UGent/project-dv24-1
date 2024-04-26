package main

import (
	"fmt"
	"log"
	"time"
)

var monthMap = map[string]string{
	"JAN": "01",
	"FEB": "02",
	"MAR": "03",
	"APR": "04",
	"MAY": "05",
	"JUN": "06",
	"JUL": "07",
	"AUG": "08",
	"SEP": "09",
	"OCT": "10",
	"NOV": "11",
	"DEC": "12",
}

func parseTime(date string, timeExpr string) time.Time {
	if date == "" || timeExpr == "" {
		return time.Time{}
	}

	year := date[5:]
	month, ok := monthMap[date[2:5]]
	if !ok {
		log.Fatalln(fmt.Sprintf("Invalid month: %s", date[2:5]))
	}
	day := date[:2]

	const layout = "2006-01-02T15:04:05-0700"
	tm, err := time.Parse(layout, fmt.Sprintf("%s-%s-%sT%s+0100", year, month, day, timeExpr))

	if err != nil {
		log.Fatalln(err)
	}

	return tm
}
