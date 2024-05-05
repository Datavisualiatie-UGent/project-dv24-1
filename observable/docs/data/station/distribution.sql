SELECT
    arrivals.station,
    arrivals.delay,
    arrivals.count as arrival_count,
    departures.count as departure_count

FROM (
    SELECT
        count(round(s1.arrival_delay / 60)) as count,
        round(s1.arrival_delay / 60) as delay,
        s1.station_id as station

    FROM
        public.stops s1

    WHERE s1.arrival_delay NOTNULL
       AND round(s1.arrival_delay / 60) < 60
       AND round(s1.arrival_delay / 60) > -5

    GROUP BY round(s1.arrival_delay / 60), station
) AS arrivals

FULL JOIN (
    SELECT
        count(round(s1.departure_delay / 60)) as count,
        round(s1.departure_delay / 60) as delay,
        s1.station_id as station

    FROM
        public.stops s1

    WHERE s1.departure_delay NOTNULL
      AND round(s1.departure_delay / 60) < 60
      AND round(s1.departure_delay / 60) > -5

    GROUP BY round(s1.departure_delay / 60), station
) AS departures

ON arrivals.delay = departures.delay AND arrivals.station = departures.station

WHERE arrivals.station IS NOT NULL AND departures.station IS NOT NULL
